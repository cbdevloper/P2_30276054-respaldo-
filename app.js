import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import indexRouter from "./routes/routes.js";
import bodyParser from "body-parser";
import Router from "./routes/userRoutes.js";
import { isAuthenticated, isAdmin } from "./middlewares/middlewares.js";

const app = express();
const PORT = process.env.PORT || 7000;

app.set("view engine", "ejs");
app.set("views", "./views");
dotenv.config();

app.use(express.static("public"));
app.get("/", (req, res) => {
  res.render("index");
});

app.set("trust proxy", true);
app.use(
  session({
    secret: "tu_clave_secreta",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  }),
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", indexRouter);
app.use("/users", Router);

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/signup", isAuthenticated, isAdmin, (req, res) => {
  res.render("signup");
});

app.get("/contacts", isAuthenticated, async (req, res) => {
  try {
    const response = await fetch("http://localhost:3000/contactos");
    const contactos = await response.json();
    res.render("contacts", { contactos: contactos });
  } catch (error) {
    console.error("Error fetching contactos:", error);
    res.status(500).send("Error fetching contactos");
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
