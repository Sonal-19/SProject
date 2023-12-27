const nodemailer = require("nodemailer");

module.exports = async (email, subject, text, resetOTP) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: "chysonal729@gmail.com", 
        pass: "xniu bfhz cqzd gzei", 
      }
    });

    await transporter.sendMail({
      from: process.env.USER, 
      to: email,
      subject: subject,
      text: `${text} ${resetOTP}`,
    });

    console.log("Reset Password Email sent Successfully");
  } catch (error) {
    console.log("Reset Password Email not Sent!");
    console.error(error);
    return error;
  }
};
