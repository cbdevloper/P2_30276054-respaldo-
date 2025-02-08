import userModel from "../models/userModel.js";

export const createUser = async (userData) => {
  try {
    const user = await userModel.createUser(userData);
    return user;
  } catch (err) {
    throw err;
  }
};

export const getAllUsers = async () => {
  try {
    const users = await userModel.getAllUsers();
    return users;
  } catch (err) {
    throw err;
  }
};

export default {
  createUser,
  getAllUsers,
};
