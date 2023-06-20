const nodeMailer = require("../config/nodemailer");

// this is another way of exporting a method
module.exports.newComment = (comment) => {
  let htmlString = nodeMailer.renderTemplate(
    { comment: comment },
    "/comments/new_comment.ejs"
  );

  nodeMailer.transporter.sendMail(
    {
      from: "codeial.updates@gmail.com",
      to: comment.user.email,
      subject: "New Comment Published!",
      html: htmlString,
    },
    (err, info) => {
      // info carries the information about the request that has been sent to gmail SMTP mailing server
      if (err) {
        console.log(`Error in sending mail: ${err}`);
        return;
      }

      console.log("Mail Delivered!", info);
      return;
    }
  );
};
