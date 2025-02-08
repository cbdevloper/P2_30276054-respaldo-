import authService from "../services/login.js";
import session from "express-session";
import { isAuthenticated, isAdmin } from "../middlewares/middlewares.js";

const authLogin = async (req, res) => {
  try {
    const { nombre, contraseña } = req.body;

    if (!nombre || !contraseña) {
      return res
        .status(400)
        .json({ message: "Nombre and contraseña are required" });
    }

    const token = await authService.login(nombre, contraseña);

    req.session.usuarios = { name: nombre };

    if (contraseña === "admin") {
      res.redirect("/signup");
    }
    if (contraseña != "admin") {
      res.redirect("/contacts");
    }
  } catch (error) {
    if (error.message === "Invalid credentials") {
      return res.redirect("/contacts");
    }
    res.status(500).json({ message: "An error occurred during login process" });
  }
};

export default {
  authLogin,
};
