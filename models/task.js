import mongoose from "mongoose";

const TASK_SUCCESS = "success";
const TASK_PENDING = "pending";
const TASK_FAILURE = "failure";
const TASK_LIKE = true;
const TASK_DISLIKE = false;
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      minlength: 5,
      maxlength: 100,
      required: true,
    },
    assignby: {
      type: String,
      required: true,
    },
    assignto: {
      type: String,
      required: true,
    },
    describe: {
      type: String,
      trim: true,
      minlength: 5,
      required: true,
    },
    project: {
      type: String,
    },
    status: {
      type: String,
      default: TASK_PENDING,
      enum: [TASK_PENDING, TASK_SUCCESS, TASK_FAILURE],
    },
    like: {
      type: String,
      default: TASK_DISLIKE,
      enum: [TASK_DISLIKE, TASK_LIKE],
      required: true,
    },
    deadlineAt: {
      type: Date,
      required: true,
    },
    isEmail: {
      type: Boolean,
      default: false,
    },
  },
  { collection: "tasks", timestamps: true }
);

taskSchema.statics.TASK_DISLIKE = TASK_DISLIKE;
taskSchema.statics.TASK_LIKE = TASK_LIKE;
taskSchema.statics.TASK_SUCCESS = TASK_SUCCESS;
taskSchema.statics.TASK_PENDING = TASK_PENDING;
taskSchema.statics.TASK_FAILURE = TASK_FAILURE;

const Task = mongoose.model("Task", taskSchema);
export default Task;
