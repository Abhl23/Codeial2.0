const passport = require("passport");

const LocalStrategy = require("passport-local").Strategy;

const User = require("../models/user");

// authentication using passport
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async function (email, password, done) {
        // find a user and establish the identity
      try {
        const user = await User.findOne({ email: email });

        if (!user || user.password != password) {
          console.log("Invalid Username/Password");
          return done(null, false);
        }

        return done(null, user);
      } catch (err) {
        console.log("Error in finding the user --> Passport");
        return done(err);
      }
    }
  )
);

// serializing to decide which key is to be kept in the cookies
passport.serializeUser(function (user, done) {
  return done(null, user.id);
});

// deserializing the user from the key in the cookies
passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);

    return done(null, user);
  } catch (err) {
    console.log("Error in finding the user --> Passport");
    return done(err);
  }
});

module.exports = passport;
