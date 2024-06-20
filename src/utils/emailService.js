const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});
const sendEmail = async (subject, text , email = "nilesh@orangeleague.in") => {
  const mailOptions = {
    from: process.env.MAIL_SENDER,
    to: email,
    subject,
    text,
  };
  try {
      transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    console.log( `Email sent to ${mailOptions.to}`);
 
  } catch (error) {
    console.error('Error sending email:', error);
  }
};


module.exports= { sendEmail }