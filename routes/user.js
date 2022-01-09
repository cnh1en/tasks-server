import express from "express";
import {
  createUserController,
  deleteUserController,
  fetchUsersController,
  loginAccountController,
  getCurrentUser,
  updateUserController,
  changePassword,
  forgotPassword,
} from "../controllers/userController.js";
import verifyUser from "../middlewares/auth.js";

const router = express.Router();

router.route("/register").post(createUserController);
router.route("/login").post(loginAccountController);
router.route("/forgot-password").post(forgotPassword);
router.route("/change-pass").post(verifyUser, changePassword);
router.route("/user-list").get(verifyUser, fetchUsersController);
router.route("/").get(verifyUser, getCurrentUser);
router.route("/:id").delete(verifyUser, deleteUserController);
router.route("/:userId").patch(verifyUser, updateUserController);
export default router;
