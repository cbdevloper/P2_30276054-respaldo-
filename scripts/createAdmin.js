import sqlite from "sqlite3";
import bcrypt from "bcrypt";

const sqlite3 = sqlite.verbose();

const db = new sqlite3.Database("./database.db");

const createAdminAccount = async () => {
  try {
    db.get(
      "SELECT * FROM usuarios WHERE nombre = ?",
      ["Carlos"],
      async (err, row) => {
        if (err) {
          console.error(err.message);
          return;
        }

        if (!row) {
          const hashedPassword = await bcrypt.hash("admin", 10);
          db.run(
            "INSERT INTO usuarios (nombre, contraseña) VALUES (?, ?)",
            ["pedro", hashedPassword],
            function (err) {
              if (err) {
                console.error(err.message);
              } else {
                console.log("Admin creado");
              }
            },
          );
        } else {
          console.log("Admin ya existe");
        }
      },
    );
  } catch (error) {
    console.error(error.message);
  }
};

export default createAdminAccount;
