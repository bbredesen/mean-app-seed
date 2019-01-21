/*
Never commit passwords or API keys! For dev and testing, store appropriate
values in a .env file, which will be loaded as environment variables here.
*/
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

const config = {
  // Connection string for MongoDB, both to store sessions and load user records
  database : {
    connectUri: process.env.DATABASE_URI
  },

  passport : {
    // Strategy is an arbitrary, unique name to identify the strategy in Passport
    strategy : "oauth",

    // clientId and clientSecret come from the Google Developer Dashboard
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,

    jwtIssuer: "berp",
    jwtSecret: process.env.JWT_SIGNATURE_SECRET,

    // Paths used by Express; arbitrary, you can redefine here as desired
    loginPath : "/login",
    logoutPath : "/logout",
    successPath : "/login/success",
    failurePath : "/login/failure",

    // Must match a path that you have defined on the Developer Dashboard
    callbackPath : "/login/redirect",
    // Leave null, value is set at the bottom of the file, following this object declaration
    callbackURL : null,

    // Where to redirect if an unathorized user attempts to access a protected path
    unauthorizedPath : "/"
  },

  session : {
    secret : process.env.SESSION_SECRET_SALT,
    // Maximum age in milliseconds of a login session, before requiring the user to log in again
    maxAge : 24*60*60*1000 // 24 hours
  }
}

// include your port number when setting BASE_URL, if you are not using a standard protocol port
config.passport.callbackURL = `${process.env.BASE_URL}${config.passport.callbackPath}`

export default config;
