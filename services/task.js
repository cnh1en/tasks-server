import TaskModel from "../models/task.js";

const createTask = async (data) => {
  try {
    const task = await TaskModel.create(data);
    return task;
  } catch (error) {
    console.log(error);
  }
};

const findTaskByAdmin = async (user) => {
  try {
    const tasks = await TaskModel.find({ assignby: user.email });
    return tasks;
  } catch (error) {
    console.log(error);
  }
};

const findTask = async (data) => {
  try {
    const tasks = await TaskModel.find({ assignto: data.email });
    return tasks;
  } catch (error) {
    console.log(error);
  }
};
const deleteTaskById = async (id) => {
  try {
    await TaskModel.findByIdAndRemove({ _id: id });
  } catch (error) {
    console.log(error);
  }
};
export { createTask, findTaskByAdmin, findTask, deleteTaskById };
