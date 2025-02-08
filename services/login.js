import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import { generateToken } from "../utils/jwtUtils.js";

const login = async (nombre, contraseña) => {
  try {
    const existingUser = await userModel.findUserByNombre(nombre);
    if (!existingUser) {
      throw new Error("User does not exist");
    }

    const isPasswordValid = await bcrypt.compare(
      contraseña,
      existingUser.contraseña,
    );
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    const token = generateToken(existingUser);
    return token;
  } catch (error) {
    if (
      error.message === "User does not exist" ||
      error.message === "Invalid password"
    ) {
      throw new Error("Invalid credentials");
    }

    throw new Error("An error occurred during the login process");
  }
};

export default {
  login,
};
