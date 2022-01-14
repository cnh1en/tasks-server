import mailer from "nodemailer";

const deadlineCall = (title, user) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: "cnhien12@gmail.com",
    subject: `Thời hạn công việc của bạn còn 1 ngày duy nhất !`,
    text: `"${title}" chưa được hoàn thành, bạn cần hoàn thành công việc`,
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
      console.log("Email sent: " + info.response + " " + user);
    }
  });
};
const checkTaskEveryDay = (task) => {
  deadlineCall(task.title, task.assignto);
};
export { checkTaskEveryDay };
