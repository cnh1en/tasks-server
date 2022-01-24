import mailer from "nodemailer";

const dispatchPassword = (user) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: user.email,
    subject: `Password`,
    text: `Your password: ${user.password}`,
  };

  const transporter = mailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response + " ");
    }
  });
};
export default dispatchPassword;
