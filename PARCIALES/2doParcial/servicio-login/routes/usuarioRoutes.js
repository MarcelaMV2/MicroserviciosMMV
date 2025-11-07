// routes/usuarioRoutes.js
const express = require("express");
const { AppDataSource } = require("../database");
const { Usuario } = require("../entity/Usuario");
const {
  obtenerUsuarios,
  crearUsuario,
  editarUsuario,
  eliminarUsuario,
  loginUsuario,
} = require("../controller/usuarioController");

const router = express.Router();  // Uso correcto de express.Router()

// Definición de rutas
router.get("/", obtenerUsuarios);

router.get("/:id", async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(Usuario);
    const usuario = await repo.findOne({ where: { id: Number(req.params.id) } });
    
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    res.json(usuario);
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
});

// Ruta POST para crear un usuario
router.post("/", async (req, res, next) => {
  try {
    await crearUsuario(req, res);  // Ejecuta la función async crearUsuario
  } catch (error) {
    next(error);  // Pasa el error al middleware de manejo de errores
  }
});

router.put("/:id", editarUsuario);
router.delete("/:id", eliminarUsuario);
router.post("/login", loginUsuario);

// Middleware para manejar errores globales
router.use((err, req, res, next) => {
  console.error(err);  // Log del error
  res.status(500).json({ mensaje: "Error interno del servidor" });
});

module.exports = router;
