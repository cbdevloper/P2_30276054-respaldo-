import sqlite3 from 'sqlite3';
import path from 'path';

const sqlit = sqlite3.verbose();

class ContactoModel {
    constructor() {
        this.db = new sqlit.Database(path.join('./contact.db'), (err) => {
            if (err) {
                console.error('Error opening database:', err);
            } else {
                this.createTable();
            }
        });
    }

    createTable() {
        const sql = `
        CREATE TABLE IF NOT EXISTS contactos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL,
            nombre TEXT NOT NULL,
            comentario TEXT NOT NULL,
            ip TEXT NOT NULL,
            fecha_hora TEXT NOT NULL
        )`;
        this.db.run(sql);
    }

    save(contacto, callback) {
        const sql = `INSERT INTO contactos (email, nombre, comentario, ip, fecha_hora) VALUES (?, ?, ?, ?, ?)`;
        const params = [contacto.email, contacto.nombre, contacto.comentario, contacto.ip, contacto.fecha_hora];
        this.db.run(sql, params, callback);
    }

    fetchAll(callback) {
        const sql = `SELECT * FROM contactos`;
        this.db.all(sql, [], callback);
    }
}

export default ContactoModel;
