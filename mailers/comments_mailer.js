const nodeMailer=require('../config/nodemailer');

// this is another way of exporting a method
module.exports.newComment=(comment) => {
    console.log('Inside newComment mailer', comment);

    nodeMailer.transporter.sendMail({
        from: "codeial.updates@gmail.com",
        to: comment.user.email,
        subject: "New Comment Published!",
        html: "<h1>Yup, your comment is now published!</h1>"
    }, (err, info) => {                // info carries the information about the request that has been sent to gmail SMTP mailing server
        if(err){
            console.log(`Error in sending mail: ${err}`);
            return;
        }

        console.log('Mail Delivered!', info);
        return;
    });
};