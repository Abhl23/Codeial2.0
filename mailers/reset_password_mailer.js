const nodeMailer = require("../config/nodemailer");

module.exports.resetPassword = (resetToken) => {
  let htmlString = nodeMailer.renderTemplate(
    { resetToken: resetToken },
    "/passwords/reset_password.ejs"
  );

  nodeMailer.transporter.sendMail({
    from: "codeial.updates@gmail.com",
    to: resetToken.user.email,
    subject: "Reset Password Link",
    html: htmlString
  }, function(err, info){
    if(err){
        console.log(`Error in sending reset password mail: ${err}`);
        return;
    }

    console.log("Mail Delivered!");
    return;
  });
};
