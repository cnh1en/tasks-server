import mailer from "nodemailer";

const dispatchPassword = (user) => {
  const mailOptions = {
    from: "cnhien12@gmail.com",
    to: user.email,
    subject: `Password`,
    text: `Your password: ${user.password}`,
  };

  const transporter = mailer.createTransport({
    service: "gmail",
    auth: {
      user: "cnhien12@gmail.com",
      pass: "lequynh012",
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
