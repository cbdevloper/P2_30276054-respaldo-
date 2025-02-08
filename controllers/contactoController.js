import ContactoModel from "../models/contactoModel.js";
import nodemailer from "nodemailer";
import { google } from "googleapis";
import { DateTime } from "luxon";
import dotenv from "dotenv";

dotenv.config();

const accountTransport = {
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.MAIN_EMAIL,
    clientId: process.env.CLIENT_ID_OAUTH,
    clientSecret: process.env.CLIENT_SECRET_OAUTH,
    refreshToken: process.env.REFRESH_TOKEN_OAUTH,
  },
};

const OAuth2 = google.auth.OAuth2;

const configureMailTransporter = async () => {
  const oauth2Client = new OAuth2(
    accountTransport.auth.clientId,
    accountTransport.auth.clientSecret,
    "https://developers.google.com/oauthplayground",
  );

  oauth2Client.setCredentials({
    refresh_token: accountTransport.auth.refreshToken,
    tls: {
      rejectUnauthorized: false,
    },
  });

  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });

  accountTransport.auth.accessToken = accessToken;
  return nodemailer.createTransport(accountTransport);
};

const sendEmail = async (email, nombre, comentario, ip) => {
  const transporter = await configureMailTransporter();
  const formattedDate = DateTime.now()
    .setZone("America/Caracas")
    .toFormat("dd/MM/yyyy HH:mm:ss");

  const mailOptions = {
    from: `Carlos Plomery <${process.env.MAIN_EMAIL}>`,
    to: ["penamartinezdev@gmail.com", "cb0872271@gmail.com"],
    subject: "Carlos Plomery | Formulario de contacto",
    text: `
      Nombre: ${nombre}
      Correo: ${email}
      Comentario: ${comentario}
      Fecha: ${formattedDate}
      IP: ${ip}
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Mensaje enviado:", info.messageId);
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    throw error;
  }
};

const ContactoController = {
  async add(req, res) {
    const { email, nombre, comentario } = req.body;
    const ip =
      req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const fecha_hora = DateTime.now()
      .setZone("America/Caracas")
      .toFormat("dd/MM/yyyy HH:mm:ss");

    if (!email || !nombre || !comentario) {
      return res.status(400).send("Datos incompletos");
    }

    console.log(
      `Fecha: ${fecha_hora} IP: ${ip} Email: ${email} Nombre: ${nombre} Comentario: ${comentario}`,
    );

    try {
      await sendEmail(email, nombre, comentario, ip);

      const contacto = { email, nombre, comentario, ip, fecha_hora };
      await ContactoModel.save(contacto);

      res.redirect("/success");
    } catch (error) {
      console.error("Error en el proceso:", error);
      res.status(500).send("Error al procesar la solicitud");
    }
  },

  async getAll(req, res) {
    try {
      const contactos = await ContactoModel.obtenerContacto();
      res.render("../views/contactos.ejs", { contactos });
    } catch (error) {
      console.error("Error al obtener los contactos:", error);
      res.status(500).render("../views/error.ejs", {
        message: "Error al obtener los contactos",
      });
    }
  },

  showForm(req, res) {
    res.render("formulario");
  },
  showSuccess(req, res) {
    res.render("success");
  },
};

export default ContactoController;
