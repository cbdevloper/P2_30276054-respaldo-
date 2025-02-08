import session from "express-session";

export const isAuthenticated = (req, res, next) => {
  if (req.session.usuarios) {
    next();
  } else {
    res.redirect("/contacts");
  }
};

export const isAdmin = (req, res, next) => {
  if (req.session.usuarios && req.session.usuarios.name === "pedro") {
    next();
  } else {
    res.status(403).render("error", {
      message: "Acceso denegado: solo para administradores",
    });
  }
};

export default {
  isAuthenticated,
  isAdmin,
};
