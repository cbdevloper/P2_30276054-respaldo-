import userService from "../services/signup.js";
import bcrypt from "bcrypt";

const createUser = async (req, res) => {
  try {
    const userData = req.body;

    userData.contraseña = await bcrypt.hash(userData.contraseña, 10);

    const user = await userService.createUser(userData);

    res.redirect("/");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const getUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();

    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export default {
  createUser,
  getUsers,
};
