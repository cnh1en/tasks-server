import Joi from "joi";
import UserModel from "../models/user.js";
import TaskModel from "../models/task.js";
import dispatchPassword from "../services/dispatchPassword.js";
import { createUser, findAllUsers, deleteUser } from "../services/user.js";
import uuidApiKey from "uuid-apikey";
import argon2 from "argon2";
const createUserController = async (req, res, next) => {
  const reqBody = req.body;
  let resBody = { success: false, message: "" };

  const inputSchema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(32).required(),
    usertype: Joi.string()
      .required()
      .valid(UserModel.TYPE_ADMIN, UserModel.TYPE_NORMAL, UserModel.TYPE_SDE),
    api_key: Joi.string(),
    date: Joi.date().required(),
    location: Joi.string().max(100).required(),
    phone: Joi.string().max(12).required(),
    task_complete: Joi.number(),
    tasks: Joi.number(),
    gender: Joi.required().valid(
      UserModel.GENDER_MALE,
      UserModel.GENDER_FEMALE,
      UserModel.GENDER_NONE
    ),
  });
  const newUser = {
    name: reqBody.name,
    email: reqBody.email,
    password: reqBody.password,
    usertype: reqBody.usertype,
    api_key: uuidApiKey.create().apiKey,
    date: reqBody.date,
    location: reqBody.location,
    phone: reqBody.phone,
    task_complete: 0,
    tasks: 0,
    gender: reqBody.gender,
  };
  try {
    await inputSchema.validateAsync(newUser);
  } catch (error) {
    resBody.message = error.message.replace(/\"/g, "");
    return res.status(400).json(resBody);
  }
  //check mail
  try {
    const emailCheck = await UserModel.findOne({ email: reqBody.email });
    if (emailCheck) {
      resBody.message = "Account with email address already exist!!";
      return res.status(400).json(resBody);
    }
    // const hashedPassword = await argon2.hash(reqBody.password);
    const user = await UserModel.create({
      ...newUser,
      // password: hashedPassword,
    });
    resBody.success = true;
    resBody.message = "Account Created Successfully";
    return res.status(200).json({ ...resBody, user });
  } catch (error) {
    return res.status(400).json(error);
  }
};

const loginAccountController = async (req, res, next) => {
  const reqBody = req.body;
  let resBody = { success: false, message: "" };

  const inputSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  const accountInfo = {
    email: reqBody.email,
    password: reqBody.password,
  };

  try {
    await inputSchema.validateAsync(accountInfo);
  } catch (error) {
    resBody.message = error.message.replace(/\"/g, "");
    return res.status(200).json(resBody);
  }

  try {
    let user = await UserModel.findOne({ email: reqBody.email });
    // check mail
    if (!user) {
      resBody.message = "Invalid email provided";
      return res.status(200).json(resBody);
    }
    // check password
    const hashedPassword = await argon2.hash(reqBody.password);
    if (user.password !== reqBody.password) {
      resBody.message = "Invalid password provided";
      return res.status(200).json(resBody);
    }

    resBody.success = true;
    resBody.message = "Login successfully";

    return res.status(200).json({ ...resBody, apiKey: user.api_key, user });
  } catch (error) {
    return res.status(400).json({ ...resBody, error });
  }
};

const fetchUsersController = async (req, res, next) => {
  let resBody = { success: false, message: "", data: [] };
  try {
    const users = await UserModel.find({});
    resBody = { success: true, message: "successfully", users };
    return res.status(200).json(resBody);
  } catch (error) {
    resBody.message = error.message;
    return res.status(400).json(resBody);
  }
};

const deleteUserController = async (req, res, next) => {
  let resBody = { success: false, message: "" };
  const userID = req.params.id;
  try {
    const user = await UserModel.findOne({ _id: userID });
    // await TaskModel.deleteMany({ assignto: user.email });
    await UserModel.findByIdAndRemove({ _id: userID });
    return res
      .status(200)
      .json({ ...resBody, message: "Xóa thành công !", success: true });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({ ...resBody, message: "UserID lỗi!" });
    }
  }
};

const getCurrentUser = async (req, res, next) => {
  const resBody = { success: false, messgae: "" };

  try {
    const user_current = await UserModel.findOne({ api_key: req.user.api_key });
    if (!user_current) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    return res
      .status(200)
      .json({ ...resBody, success: true, user: user_current });
  } catch (error) {
    return res.status(400).json({ ...resBody, error });
  }
};

const updateUserController = async (req, res, next) => {
  const reqBody = req.body;
  let resBody = { success: false, message: "" };
  const userId = req.params.userId;

  const inputSchema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    date: Joi.date().required(),
    location: Joi.string().max(100).required(),
    phone: Joi.string().max(12).required(),
    gender: Joi.required().valid(
      UserModel.GENDER_MALE,
      UserModel.GENDER_FEMALE,
      UserModel.GENDER_NONE
    ),
  });

  const updateUser = {
    name: reqBody.name,
    email: reqBody.email,
    date: reqBody.date,
    location: reqBody.location,
    phone: reqBody.phone,
    gender: reqBody.gender,
  };

  try {
    await inputSchema.validateAsync(updateUser);
  } catch (error) {
    resBody.message = error.message.replace(/\"/g, "");
    return res.status(400).json(resBody);
  }

  try {
    let userFind = await UserModel.findOne({ _id: userId });
    let user = await UserModel.findOne({ email: reqBody.email });
    if (user && user.email !== userFind.email) {
      resBody.message = "Account with email address already exist!!";
      return res.status(400).json(resBody);
    }
  } catch (error) {
    return res.status(400).json({ ...reqBody, error });
  }

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(userId, updateUser, {
      new: true,
    });
    resBody.success = true;
    resBody.message = "User updated successfully";
    return res.status(200).json({ ...resBody, user: updatedUser });
  } catch (error) {
    return res.status(400).json({ ...reqBody, error });
  }
};

const changePassword = async (req, res, next) => {
  let resBody = { success: false, message: "" };
  const reqBody = req.body;
  let oldPass = reqBody.oldPassword;
  let newPass = reqBody.newPassword;
  const userCurrent = req.user;

  try {
    const user = await UserModel.findById(userCurrent._id);
    if (user.password !== oldPass) {
      return res
        .status(400)
        .json({ ...resBody, message: "Password incorrect!" });
    }
    const newUserPass = await UserModel.findByIdAndUpdate(
      userCurrent._id,
      { password: newPass },
      { new: true }
    );
    return res.status(200).json({
      ...resBody,
      success: true,
      message: "Successfully !",
      newPass: newUserPass,
    });
  } catch (error) {
    return res.status(400).json({ ...reqBody, error });
  }
};

const forgotPassword = async (req, res, next) => {
  let resBody = { success: false, message: "" };
  const reqBody = req.body;

  try {
    const confirmEmail = reqBody.email;
    const user = await UserModel.findOne({ email: confirmEmail });
    if (!user) {
      return res.status(400).json({ ...resBody, message: "Email invalid !" });
    }
    dispatchPassword(user);
    return res
      .status(200)
      .json({ ...resBody, message: "Successfully !", success: true });
  } catch (error) {
    return res.status(400).json({ ...resBody, error });
  }
};
export {
  deleteUserController,
  createUserController,
  fetchUsersController,
  loginAccountController,
  getCurrentUser,
  updateUserController,
  changePassword,
  forgotPassword,
};
