const User = require("../models/user");
const ResetToken = require("../models/reset_password_token");

const crypto = require("crypto");

const resetPasswordMailer = require("../mailers/reset_password_mailer");

// render the forgot password page
module.exports.forgotPassword = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }

  return res.render("forgot_password", {
    title: "Codeial | Forgot Password",
  });
};

// create the reset password token
module.exports.resetLink = async function (req, res) {
  try {
    if (req.isAuthenticated()) {
      return res.redirect("/");
    }

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

// render the reset password page
module.exports.resetPassword = async function (req, res) {
  try {
    if (req.isAuthenticated()) {
      return res.redirect("/");
    }

    const resetToken = await ResetToken.findOne({
      accessToken: req.query.accessToken,
    });

    if (resetToken) {
      return res.render("reset_password", {
        title: "Codeial | Reset Password",
        resetToken: resetToken,
      });
    } else {
      req.flash("error", "Access Token is Invalid!");
      return res.redirect("/");
    }
  } catch (err) {
    console.log("Error in reset password action", err);
    return res.redirect("/");
  }
};

// update password
module.exports.updatePassword = async function (req, res) {
  try {
    if (req.isAuthenticated()) {
      return res.redirect("/");
    }

    if (req.body.password != req.body.confirm_password) {
      req.flash("error", "Passwords does not match!");
      return res.redirect("back");
    }

    const resetToken = await ResetToken.findByIdAndUpdate(
      req.body.reset_token_id,
      { isValid: false }
    );

    if (resetToken) {
      await User.findByIdAndUpdate(resetToken.user, {
        password: req.body.password,
      });

      req.flash("success", "Password Updated!");
      return res.redirect("/users/sign-in");
    } else {
      req.flash("error", "Reset Token Invalid!");
      return res.redirect("back");
    }
  } catch (err) {
    console.log("Error in update password action", err);
    return res.redirect("/");
  }
};
