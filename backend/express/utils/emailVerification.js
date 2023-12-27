const nodemailer = require("nodemailer");

module.exports = async (email, subject, text,code) => {
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
      // html:`<h1 >hello</h1>`,
      subject: subject,
      text: `${text} ${code}`,
    });
    console.log("Email sent Successfully");
  } catch (error) {
    console.log("Email not Sent!");
    console.log(error);
    return error;
  }
};


