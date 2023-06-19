const passport = require("passport");
const googleStrategy = require("passport-google-oauth").OAuth2Strategy;

const crypto = require("crypto");

const User = require("../models/user");

// tell passport to use new strategy for google login
passport.use(
  new googleStrategy(
    {
      clientID:
        "472497485199-pn5tuecdo07qi24t9oqq3shrcpe2lvpe.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:8000/users/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        console.log("*********", profile);

        const user = await User.findOne({ email: profile.emails[0].value });

        // if found, set this user as req.user
        if (user) {
          return done(null, user);
        }
        // if not found, create the user and set it as req.user
        else {
          const user = await User.create({
            email: profile.emails[0].value,
            name: profile.displayName,
            password: crypto.randomBytes(20).toString("hex"),
            avatar: profile.photos[0].value
          });

          return done(null, user);
        }
      } catch (err) {
        console.log("Error in googleStrategy of passport", err);
        return done(err);
      }
    }
  )
);

module.exports = passport;
