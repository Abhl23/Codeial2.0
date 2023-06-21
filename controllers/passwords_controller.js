const User = require("../models/user");

module.exports.forgotPassword = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }

  return res.render("forgot_password", {
    title: "Forgot Password",
  });
};
