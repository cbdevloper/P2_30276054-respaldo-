import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  const payload = {
    id: user.id,
    nombre: user.nombre,
  };

  const token = jwt.sign(payload, "your-secret-key", { expiresIn: "1h" });
  return token;
};

export default {
  generateToken,
};
