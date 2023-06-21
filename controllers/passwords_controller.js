const User = require("../models/user");
const ResetToken = require("../models/reset_password_token");

const crypto = require("crypto");

const resetPasswordMailer = require("../mailers/reset_password_mailer");

module.exports.forgotPassword = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }

  return res.render("forgot_password", {
    title: "Codeial | Forgot Password",
  });
};

module.exports.resetLink = async function (req, res) {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      req.flash("error", "Email doesn't exist!");
      return res.redirect("back");
    }

    const resetToken = await ResetToken.create({
      user: user._id,
      accessToken: crypto.randomBytes(20).toString("hex"),
      isValid: true,
    });

    await resetToken.populate("user", "name email");

    resetPasswordMailer.resetPassword(resetToken);

    req.flash("success", "Reset Password Mail Sent!");
    return res.redirect("back");
  } catch (err) {
    console.log("Error in reset link action", err);
    req.flash("error", err);
    return res.redirect("back");
  }
};
