import UserModel from "../models/user.js";
import uuidApiKey from "uuid-apikey";
const createUser = async (data) => {
  try {
    data.api_key = uuidApiKey.create().apiKey;
    const user = await UserModel.create(data);
    return user;
  } catch (error) {
    console.log(error);
  }
};

const findAllUsers = async () => {
  try {
    const users = await UserModel.find({});
    return users;
  } catch (error) {
    console.log(error);
  }
};

const deleteUser = async (userID) => {
  try {
    await UserModel.findByIdAndDelete({ _id: userID });
  } catch (error) {
    console.log(error);
  }
};

export { createUser, findAllUsers, deleteUser };
