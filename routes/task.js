import express from "express";
import {
  createTaskController,
  deleteTaskByIdController,
  fetchTaksController,
  doneTaskController,
  updateTaskController,
  checkTaskController,
  deleteAllTasks,
} from "../controllers/taskController.js";
import verifyUser from "../middlewares/auth.js";

const router = express.Router();

router.route("/create-task").post(verifyUser, createTaskController);
router.route("/delete-all-task/:email").delete(verifyUser, deleteAllTasks);
router.route("/:task_id").delete(verifyUser, deleteTaskByIdController);
router.route("/check-task").get(verifyUser, checkTaskController);
router.route("/").get(verifyUser, fetchTaksController);
router.route("/submit-task/:task_id").patch(verifyUser, doneTaskController);
router.route("/:taskId").patch(verifyUser, updateTaskController);
export default router;
