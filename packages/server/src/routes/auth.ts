import { Router, Request, Response } from 'express';
import passport from 'passport';
import { bearerAuthCheck, authCallback } from '../passport';

import config from '../config';
import { UserToken } from '../orm/admin/UserToken';

const router = Router();
export default router;

import log from '../logging';
const debug = require('debug')('berp:srv:routes:auth');

/*
This script primarily handles the endpoints for processing of OAuth2 authentication
through Google. Internal processing is handled in ../passport.ts, where the user
is actually looked up, validated on this system, etc.
*/

// Begin the log in process through Google OAuth2
router.get(config.passport.loginPath,
  passport.authenticate(config.passport.strategy, {session: false})
);

// Log out; this invalidates the bearer token that was issued to a user and
// and stored locally. The client application logout procedure should remove the
// token from the browser's local storage as well.
router.get(config.passport.logoutPath,
  bearerAuthCheck,
  function(req : Request, res : Response) {
    debug('%s -> Log out procedure for %s', config.passport.logoutPath, req.user.email);
    if (req.user) {
      let auth : string = req.headers.authorization;
      if (auth.startsWith('Bearer ')) { // it better, since we are alreday authenticated by the bearerAuthCheck
        auth = auth.slice(7);
        debug('Ready to remove auth: %s', auth);
        UserToken.findOneAndRemove({jwt: auth})
          .lean().exec()
          .then( result => {
            debug('Result: %o', result);
            res.json({message: 'OK'})
          } )
      } else {
        log.error('Authorization provided is not a bearer token! (%s)', auth);
        res.status(403).json({ status: 403, message: 'Authorization provided is not a bearer token!' })
      }
    } else {
      log.error('Logout procedure for "%s" passed authentication, but the user was not injected into the request by Passport!', req.user.email);
      res.status(500).json({ status: 500, message: 'Logout procedure failed.' });
    }
  }
);

// Custom callback function to create the JWT token and attach it to the success path.
// The user object is coming from the strategy callback is defined in ../passport.ts
router.get(config.passport.callbackPath, authCallback);

router.get(config.passport.failurePath,
  (req : Request, res : Response) => {
    res.send('Login failed:<br/>' + req.query['message']);
  }
)

// Testing endpoint; you can manually call this with a Bearer token (Postman, curl, etc.)
// to see if you are an authenticated client
router.get('/whoami',
  bearerAuthCheck,
  (req : Request, res : Response) => {
    debug('/whoami -> user is: %o', req.user);

    if (req.user) {
      res.send(`
        Current user is: ${req.user.email}<br/>
        Your organization name is ${req.user.organization.name}<br/>
        <a href="${config.passport.logoutPath}">Logout Now</a>
        `);
    } else {
      res.send(`
        You did not provide a valid token or are not logged in.<br/>
        <a href="${config.passport.loginPath}">Login Now</a>
        `);
    }
  });
