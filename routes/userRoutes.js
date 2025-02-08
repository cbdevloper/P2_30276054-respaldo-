import express from "express";
import userController from "../controllers/userController.js";
import userLoginController from "../controllers/userLoginController.js";
const Router = express.Router();

//Rutas de usuarios
Router.post("/register", userController.createUser);
Router.get("/getUsers", userController.getUsers);
Router.post("/login", userLoginController.authLogin);

export default Router;
