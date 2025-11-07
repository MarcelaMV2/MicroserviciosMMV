const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET || "secret123";

exports.verifyToken = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer "))
    return res.status(401).json({ mensaje: "Token requerido" });

  const token = auth.split(" ")[1];
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch (err) {
    res.status(401).json({ mensaje: "Token inválido" });
  }
};
