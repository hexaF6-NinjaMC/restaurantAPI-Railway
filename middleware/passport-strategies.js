/**
 * Contains the passport strategies for the application.
 * If GitHub was requested, it would be implemented similarly to the Google strategies.
 */

const GoogleStrategy = require("passport-google-oauth2").Strategy;
const passport = require("passport");

const strategies = () => {
  // Admin passport strategy
  passport.use(
    "admin",
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_ADMIN_CALLBACK_URL, // production: use Render env var, development: use received ENV vars.
        passReqToCallback: true
      },
      (request, accessToken, refreshToken, profile, done) =>
        // User.findOrCreate({ googleId: profile.id }, function (err, user) {
        //  return done(err, user);
        // }); -- unsure how to do this, will look into it or may need help
        done(null, profile)
    ),
    {
      failureRedirect: process.env.FAILURE_REDIRECT,
      session: false
    }
  );

  // Customer passport strategy
  passport.use(
    "customer",
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_USER_CALLBACK_URL, // production: use Render env var, development: use received ENV vars.
        passReqToCallback: true
      },
      (request, accessToken, refreshToken, profile, done) =>
        // User.findOrCreate({ googleId: profile.id }, function (err, user) {
        //  return done(err, user);
        // }); -- unsure how to do this, will look into it or may need help
        done(null, profile)
    ),
    {
      failureRedirect: process.env.FAILURE_REDIRECT,
      session: false
    }
  );
};

module.exports = {
  strategies
};
