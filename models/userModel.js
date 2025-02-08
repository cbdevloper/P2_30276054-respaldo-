import sqlite from "sqlite3";
import bcrypt from "bcrypt";

const sqlite3 = sqlite.verbose();

const db = new sqlite3.Database("./database.db", (err) => {
  if (err) {
    console.error("Error al conectar con la base de datos:", err);
  } else {
    console.log("Conectado a la base de datos SQLite");

    db.run(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL UNIQUE,
        contraseña TEXT NOT NULL
      )
    `);
  }
});

const findUserByNombre = (nombre) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM usuarios WHERE nombre = ?`;
    db.get(query, [nombre], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

const getAllUsers = () => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM usuarios`;
    db.all(query, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

const createUser = (userData) => {
  return new Promise((resolve, reject) => {
    const { nombre, contraseña } = userData;

    // Hashear la contraseña antes de almacenarla
    bcrypt.hash(contraseña, 10, (err, hashedPassword) => {
      if (err) {
        reject(err);
      } else {
        const query = `INSERT INTO usuarios (nombre, contraseña) VALUES (?, ?)`;
        db.run(query, [nombre, hashedPassword], function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID, nombre });
          }
        });
      }
    });
  });
};

export default {
  findUserByNombre,
  createUser,
  getAllUsers,
};
