const passport = require("passport");

const LocalStrategy = require("passport-local").Strategy;

const User = require("../models/user");

// authentication using passport
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passReqToCallback: true
    },
    async function (req, email, password, done) {
      // find the user and establish the identity
      try {
        const user = await User.findOne({ email: email });

        if (!user || user.password != password) {
          req.flash("error", "Invalid Username/Password!");
          return done(null, false);
        }

        return done(null, user);
      } catch (err) {
        req.flash('error', err);
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

// check if the user is authenticated
passport.checkAuthentication = function (req, res, next) {
  // if the user is signed in, then pass on the request to the next function(controller's action)
  if (req.isAuthenticated()) {
    return next();
  }

  // if the user is not signed in
  return res.redirect("/users/sign-in");
};


passport.setAuthenticatedUser = function (req, res, next) {
  // req.user contains the current signed in user from the session cookie and we are just sending it to the locals for the views
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }

  next();
};

module.exports = passport;
