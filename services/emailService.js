import mailer from "nodemailer";

const deadlineCall = (title, user) => {
  const mailOptions = {
    from: "cnhien12@gmail.com",
    to: "cnhien12@gmail.com",
    subject: `Lam deadline di em oiiiii ${user}`,
    text: title,
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
      console.log("Email sent: " + info.response + " " + user);
    }
  });
};
const checkTaskEveryDay = (task) => {
  // const timeSchedule = {
  //   // year: dayjs(task.deadlineAt).get("year"),
  //   // month: dayjs(task.deadlineAt).get("month"),
  //   // date = dayjs(task.deadlineAt).subtract(2, "days").get("date"),
  //   year: 2022,
  //   month: 0,
  //   date: 1,
  //   hour: 21,
  //   minute: 11,
  //   second: 10,
  // };
  // schedule.scheduleJob(timeSchedule, () => {
  //   deadlineCall(task.title, task.assignto);
  // });
  deadlineCall(task.title, task.assignto);
};
export { checkTaskEveryDay };
