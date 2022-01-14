import TaskModel from "../models/task.js";
import dayjs from "dayjs";
import * as service from "../services/emailService.js";
const Schedule = async () => {
  try {
    let tasks = await TaskModel.find({});
    for (let task of tasks) {
      let deadline = dayjs(task.deadlineAt).diff(dayjs(), "day");
      if (
        task.status === "pending" &&
        task.isEmail === false &&
        deadline === 1
      ) {
        service.checkTaskEveryDay(task);
        await TaskModel.findByIdAndUpdate(task._id, { isEmail: true });
      }
      if (deadline <= 0) {
        await TaskModel.findByIdAndUpdate(task._id, { status: "failure" });
      }
    }
  } catch (error) {
    console.log(error);
  }
};
export { Schedule };
