import dayjs from "dayjs";
import Joi from "joi";
import TaskModel from "../models/task.js";
import UserModel from "../models/user.js";
import * as service from "../services/emailService.js";
const createTaskController = async (req, res, next) => {
  const reqBody = req.body;
  const currentUser = req.user;
  let resBody = { success: false, message: "" };
  reqBody.like = false;

  const inputSchema = Joi.object({
    title: Joi.string().min(5).max(100).required(),
    assignby: Joi.string().required(),
    assignto: Joi.string().required(),
    describe: Joi.string().min(5).required(),
    project: Joi.string(),
    deadlineAt: Joi.date().required(),
    status: Joi.string().valid(
      TaskModel.TASK_SUCCESS,
      TaskModel.TASK_PENDING,
      TaskModel.TASK_FAILURE
    ),
    like: Joi.string()
      .required()
      .valid(TaskModel.TASK_LIKE, TaskModel.TASK_DISLIKE),
    isEmail: Joi.bool().required(),
  });

  const newtask = {
    title: reqBody.title,
    assignby: reqBody.assignby,
    describe: reqBody.describe,
    project: reqBody.project,
    status: reqBody.status,
    like: reqBody.like,
    deadlineAt: reqBody.deadlineAt,
    assignto: reqBody.assignto,
    isEmail: false,
  };
  if (currentUser.usertype !== "admin") {
    return res
      .status(400)
      .json({ ...resBody, message: "Chỉ có admin mới được tạo công việc" });
  }
  try {
    await inputSchema.validateAsync(newtask);
  } catch (error) {
    resBody.message = error.message.replace(/\"/g, "");
    return res.status(400).json(resBody);
  }

  try {
    await UserModel.findOneAndUpdate(
      { email: newtask.assignto },
      { $inc: { tasks: 1 } },
      { new: true }
    );
    const taskSuccess = await TaskModel.create(newtask);
    resBody = {
      success: true,
      message: "Successfully !!",
    };
    return res.status(200).json({ ...resBody, newTask: taskSuccess });
  } catch (error) {
    return res.status(400).json({ ...resBody, message: error });
  }
};
const deleteTaskByIdController = async (req, res, next) => {
  let resBody = { success: false, message: "" };
  const taskID = req.params.task_id;
  const currentUser = req.user;

  if (currentUser.usertype === "admin") {
    try {
      const taskDelete = await TaskModel.findById(taskID);
      if (taskDelete.status === "pending") {
        await UserModel.findOneAndUpdate(
          { email: taskDelete.assignto },
          { $inc: { tasks: -1 } },
          { new: true }
        );
      }
      await TaskModel.findByIdAndRemove({ _id: taskID });
      resBody = { sucess: true, message: "Task deleted Successfully" };
      return res.status(200).json(resBody);
    } catch (error) {
      return res.status(400).json({ ...resBody, error });
    }
  } else {
    resBody.message = "Chỉ có admin mới được quyền xóa công việc !";
    return res.status(400).json(resBody);
  }
};

const fetchTaksController = async (req, res, next) => {
  let resBody = { success: false, message: "" };
  const currentUser = req.user;
  switch (currentUser.usertype) {
    case "admin": // admin thi tim dc tat ca cac task tao boi admin
      try {
        const tasks = await TaskModel.find({ assignby: currentUser.email });
        // serivce.checkTaskEveryDay(tasks);
        resBody = {
          ...resBody,
          tasks,
          success: true,
          message: "Truy vấn thành công !",
        };
        // service.checkTaskEveryDay(tasks);
        // for (let task of tasks) {
        //   if (task.status === "pending" && task.isEmail === false) {
        //     await TaskModel.findByIdAndUpdate(task._id, { isEmail: true });
        //   }
        // }
        return res.status(200).json(resBody);
      } catch (error) {
        resBody.message = error.message;
        return res.status(400).json(resBody);
      }

    default:
      // user chi tim dc bai dang cua minh task cua minh
      try {
        const tasks = await TaskModel.find({ assignto: currentUser.email });
        resBody = {
          ...resBody,
          tasks,
          success: true,
          message: "Truy vấn thành công !",
        };
        return res.status(200).json(resBody);
      } catch (error) {
        resBody.message = error.message;
        return res.status(400).json(resBody);
      }
  }
};

const doneTaskController = async (req, res, next) => {
  const reqBody = req.body;
  let resBody = { success: false, message: "" };
  const taskId = req.params.task_id;
  try {
    let taskDone = await TaskModel.findOne({ _id: taskId });
    let emailFind = taskDone.assignto;
    let user = await UserModel.findOne({ email: emailFind });
    await UserModel.findOneAndUpdate(
      { email: emailFind },
      { task_complete: user.task_complete + 1 },
      { new: true }
    );
    const task = await TaskModel.findOneAndUpdate(
      { _id: taskId },
      { status: "success" },
      { new: true }
    );
    resBody.success = true;
    resBody.message = "Updated successfully!";
    return res.status(200).json({ ...resBody, task });
  } catch (error) {
    resBody.message = "Updated failure!";
    return res.status(400).json(resBody, error);
  }
};

const updateTaskController = async (req, res, next) => {
  const reqBody = req.body;
  let resBody = { success: false, message: "" };
  const taskId = req.params.taskId;

  const inputSchema = Joi.object({
    title: Joi.string().min(5).max(100).required(),
    describe: Joi.string().min(5).required(),
    deadlineAt: Joi.date().required(),
  });

  const updatedTask = {
    title: reqBody.title,
    describe: reqBody.describe,
    deadlineAt: reqBody.deadlineAt,
  };

  try {
    await inputSchema.validateAsync(updatedTask);
  } catch (error) {
    resBody.message = error.message.replace(/\"/g, "");
    return res.status(400).json(resBody);
  }

  try {
    const task = await TaskModel.findByIdAndUpdate(taskId, updatedTask, {
      new: true,
    });
    return res.status(200).json({
      ...resBody,
      success: true,
      message: "Updated task successfully!",
      task,
    });
  } catch (error) {
    return res.status(400).json({ ...resBody, message: "Failure", error });
  }
};

const checkTaskController = async (req, res, next) => {
  let resBody = { success: false, message: "" };
  try {
    let tasks = await TaskModel.find({});
    for (let task of tasks) {
      let deadline = dayjs(task.deadlineAt).diff(dayjs(), "day");
      console.log(deadline, task.title);
      if (
        task.status === "pending" &&
        task.isEmail === false &&
        deadline === 1
      ) {
        service.checkTaskEveryDay(task);
        await TaskModel.findByIdAndUpdate(task._id, { isEmail: true });
      }
      if (deadline === 0) {
        await TaskModel.findByIdAndUpdate(task._id, { status: "failure" });
      }
    }
    return res
      .status(200)
      .json({ ...resBody, success: true, message: "Successfully !" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ ...resBody, error });
  }
};
const deleteAllTasks = async (req, res, next) => {
  let resBody = { success: false, message: "" };
  const email = req.params.email;
  try {
    await TaskModel.deleteMany({ assignto: email });

    const allTask = await TaskModel.find({});
    return res.status(200).json({
      ...resBody,
      success: true,
      message: "Successlly !",
      tasks: allTask,
    });
  } catch (error) {
    return res.status(400).json({ ...resBody, message: "Error", error });
  }
};
export {
  createTaskController,
  deleteTaskByIdController,
  fetchTaksController,
  doneTaskController,
  updateTaskController,
  checkTaskController,
  deleteAllTasks,
};
