import passport from 'passport';
import url from 'url';

import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as BearerStrategy } from 'passport-http-bearer';

import jwt from 'jsonwebtoken';
import { TokenExpiredError } from 'jsonwebtoken';

import { User, UserDoc } from './orm/admin/User';
import { UserToken, UserTokenDoc } from './orm/admin/UserToken';

import config from './config';
import log from './logging';

const debug = require('debug')('berp:srv:auth');
const silly = require('debug')('silly:berp:srv:auth');
/*
HOW SECURITY WORKS IN THIS SEED APPLICATION:

Users are authenticated via Google OAuth. Passport makes it really easy to sub
in other (or even multiple) OAuth providers, or pretty much any other authentication
method. (see http://passportjs.org)

Once the user is authenticated, we drop a JSON Web Token on the client. That token
must be sent along with any API request and can also be used to secure views in
Angular. A middleware function, bearerAuthCheck, is provided for that validation.
*/

// Tell passport how to convert a user object into a string
passport.serializeUser(function(user : any, done : Function) {
  silly('serializeUser -> %s', user.email);
  done(null, user._id);
});

// Tell passport how to convert a string back into a user object
passport.deserializeUser(function(id : any, done : Function) {
  silly('deserializeUser -> %s', id)
  User.findById(id)
    .populate('organization')
    .lean().exec()
    .then( (userDoc : UserDoc) => done(null, userDoc) )
    .catch( err => done(err, null) );
});

// Tell Passport that Google OAuth is one of the strategies that we are using.
// NOTE: You need to enable the Google Plus API, in addition to generating OAuth
// credentials, if you want access to the user's name and profile photo.
passport.use(config.passport.strategy, new GoogleStrategy({
    clientID: config.passport.clientId,
    clientSecret: config.passport.clientSecret,
    callbackURL: config.passport.callbackURL,
    scope: ['email', 'openid'],
  },
  // This callback function is called after Passport negotiates an
  // OAuth2 access token.
  // You will need to save the access and refresh tokens if you plan to make API
  // calls to Google.
  // "next" is a callback function that lets passport know if the user is authenticated, or if there was a problem
  function(accessToken, refreshToken, profile, next) {
    debug('Google Profile found: %s', profile.id);
    silly('%o', profile); // Lots of information besides email address is available in the profile

    User.findOne({ googleId : profile.id })
      .exec()
      .then( (result : UserDoc) => {
        if (!result) {
          // This person has never logged in, let's make sure they have an account
          const emailRec = profile.emails.find( rec => rec.type == 'account' );
          debug('Found an account email record in the Google profile: %o', emailRec);
          if (!emailRec) { throw new Error('No email with "account" type was found!') }

          return User.findOne({ email : emailRec.value })
            .exec()
            .then( (userEmailResult : UserDoc) => {
              if (!userEmailResult) {
                debug('No account associated with user email %s', emailRec.value);
                throw { status: 403, message: 'Sorry, there is no account associated with your email adddress.' }
              }
              silly('Found a user who has NEVER logged in for Google profile id %s', profile.id);
              return userEmailResult;
            });
        } else {
          silly('Found a user who has previously logged in for Google profile id %s', profile.id);
          return result;
        }
      })
      .then( (userDoc : UserDoc) => {
        userDoc.lastLogin = new Date();
        userDoc.givenName = profile.name.givenName;
        userDoc.surname = profile.name.familyName;
        userDoc.googleId = profile.id;
        userDoc.profilePhotoURL = profile.photos[0].value;

        return userDoc.save();
      })
      .then( (userDoc : UserDoc) => {
        debug('After userDoc update, userDoc is: %o', userDoc);
        next(null, userDoc)
      })
      .catch( (err : Error) => next(err, null) );
  }
));

// Tell passport how to authenticate under the 'bearer' strategy
passport.use('bearer', new BearerStrategy({ session: false },
  (token, done) => {
    silly('-> BearerStrategy callback, token is: %s', token);
    let payload : any;

    try {
      // const cert = fs.readFileSync('private.key');
      payload = jwt.verify(token, config.passport.jwtSecret, { algorithms: ['HS256'] }) // use the private key cert instead!
    }
    catch (err) {
      if (err instanceof TokenExpiredError) {
        debug('Token has expired, return status 403');
        UserToken.findOneAndRemove({jwt: token}).exec();
        return done({err: err, status: 403}, false);
      } else {
        log.warn('Other error in BearerStrategy callback: %o', err);
        return done({err: err, status: 403}, false);
      }
    }

    UserToken.findOne({jwt: token})
      .populate({ path : 'user', populate : { path : 'organization' } })
      .lean().exec()
      .then( (result : UserTokenDoc) => {
        // Third parameter on the callback is optional data; pass permissions or any other information needed
        if (result) done(null, result.user, {});
        else throw 'Auth token has been invalidated!';
      })
      .catch( err => {
        log.error('Unexpected error finding user token in BearerStrategy callback: %o', err);
        done({ error: err, status: 403 }, false);
      })
  })
);

// call this middleware on every request that should be secured.
export function bearerAuthCheck(req, res, next) {
  passport.authenticate('bearer', {session: false},
    function(err, user, info) {
      if (err) return res.status(err.status||500).json(err);
      //authentication error, if no token was include in the headers

      if (!user) return res.status(403).json({ status: 403, err: '403 Forbidden: No authentication token was provided.' })
      //success; logIn() sets the user object on the request
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        return next();
      });
    })(req, res, next)
}

// authCallback is only called from the callback route (see ./routes/auth.ts). It
// is part of the OAuth process that is mostly managed by Passport. This function
// either handles an authentication error (bad user, password, etc.) or issues
// the JWT that the client uses to demonstrate auth.
export function authCallback(req, res, next) {
  passport.authenticate(config.passport.strategy, { session: false }, function(err, user, info) {
    debug('-> authCallback, user object is: %o, err is %o', user, err);

    if (err) {
      res.redirect(url.format({
        pathname : config.passport.failurePath,
        query : err
      }));
      return;
    }

    // const cert = fs.readFileSync('private.key');
    const signedToken = jwt.sign({ }, config.passport.jwtSecret, // use the private key cert instead!
    {
      expiresIn: '1h',
      issuer: config.passport.jwtIssuer,
      subject: user._id.toString(),
    });

    debug('authCallback -> Ready to insert the signed token into mongo', config.passport.callbackPath);

    UserToken.create({user: user, jwt: signedToken})
      .then( result => res.redirect(config.passport.successPath+'?jwt='+signedToken) );
  })(req, res, next);
}
