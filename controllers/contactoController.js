import ContactoModel from '../models/contactoModel.js';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { DateTime } from 'luxon';
import dotenv from 'dotenv'
//import account_transport from './account_transport.json';


dotenv.config();
const accountTransport = { 
    service: "gmail",
    auth: {
        type: "OAuth2",            
        user: process.env.MAIN_EMAIL,
        clientId: process.env.CLIENT_ID_OAUTH,
        clientSecret: process.env.CLIENT_SECRET_OAUTH,
        refreshToken: process.env.REFRESH_TOKEN_OAUTH
    }
}

const model = new ContactoModel();
const OAuth2 = google.auth.OAuth2;





const mail_rover = async (callback) => {

    const oauth2Client = new OAuth2(
        accountTransport.auth.clientId,
        accountTransport.auth.clientSecret,
        "https://developers.google.com/oauthplayground",
    );
    oauth2Client.setCredentials({
        refresh_token: accountTransport.auth.refreshToken,
        tls: {
            rejectUnauthorized: false
        }
    });
    oauth2Client.getAccessToken((err, token) => {
        if (err)
            return console.log(err);;
        accountTransport.auth.accessToken = token;
        callback(nodemailer.createTransport(accountTransport));
    });
};

const sendEmail = async (email, nombre, comentario, fecha_hora, ip) => {
    return new Promise((resolve, reject) => {
        mail_rover(async (transporter) => {
            const date = new Date().toISOString();
            const formattedDate = DateTime.fromISO(date) 
            .setZone('America/Caracas') 
            .toFormat('dd/MM/yyyy HH:mm:ss');
            try {
                const info = await transporter.sendMail({
                    from: `Carlos Plomery <${process.env.MAIN_EMAIL}>`,
                    to: ['penamartinezdev@gmail.com', 'cb0872271@gmail.com'],
                    subject: 'Carlos Plomery | Formulario de contacto',
                    text: `
                    Nombre: ${nombre}
                    Correo: ${email}
                    Comentario: ${comentario}
                    Fecha: ${formattedDate}
                    Ip: ${ip}
                    `
                });
                console.log('Mensaje enviado:', info.messageId);
                resolve(info);
            } catch (error) {
                console.error('Error al enviar el correo:', error);
                reject(error);
            }
        });
    });
};


class ContactoController {
    static add(req, res) {
        const { email, nombre, comentario } = req.body;
        const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const date = new Date().toISOString();
        const fecha_hora = DateTime.fromISO(date) 
        .setZone('America/Caracas') 
        .toFormat('dd/MM/yyyy HH:mm:ss');

        if (!email || !nombre || !comentario) {
            return res.status(400).send("Datos incompletos");
        }
        console.log(`Fecha: ${fecha_hora} IP: ${ip} Email: ${email} Nombre: ${nombre} Comentario: ${comentario}`);

        sendEmail(email, nombre, comentario)
        .then(async info =>{
            console.log("Mensaje enviado:", info);
        })

        const contacto = { email, nombre, comentario, ip, fecha_hora };
        model.save(contacto, (err) => {
            if (err) {
                return res.status(500).send("Error al guardar los datos");
            }
            res.redirect('/success');
        });
    }

    static showForm(req, res) {
        res.render('formulario');
    }

    static showSuccess(req, res) {
        res.render('success');
    }
}

export default ContactoController;
