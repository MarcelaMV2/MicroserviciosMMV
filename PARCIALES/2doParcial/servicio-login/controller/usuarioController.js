const { getRepository } = require("typeorm");
const bcrypt = require("bcrypt");
const { Usuario } = require("../entity/Usuario");

// Obtener todos los usuarios
const obtenerUsuarios = async (req, res) => {
   const usuarios = await getRepository(Usuario).find();
  res.json(usuarios);
    // const usuarios = await getRepository(Usuario).find();
    // res.render("usuarios/index", { usuarios });
};

// Crear un nuevo usuario
const crearUsuario = async (req, res) => {
  const { correo, contraseña } = req.body;

  if (!correo || !contraseña) {
    return res.status(400).json({ mensaje: "Correo y contraseña son requeridos" });
  }

  const hashedPassword = await bcrypt.hash(contraseña, 10);
  const nuevoUsuario = getRepository(Usuario).create({
    correo,
    contraseña: hashedPassword,
  });

  const resultado = await getRepository(Usuario).save(nuevoUsuario);
  res.status(201).json(resultado);
};

// Actualizar un usuario
const editarUsuario = async (req, res) => {
  const { correo, contraseña } = req.body;
  const usuario = await getRepository(Usuario).findOne(req.params.id);

  if (!usuario) {
    return res.status(404).json({ mensaje: "Usuario no encontrado" });
  }

  usuario.correo = correo;  
  if (contraseña) {
    usuario.contraseña = await bcrypt.hash(contraseña, 10);
  }

  const resultado = await getRepository(Usuario).save(usuario);
  res.json(resultado);
};



const eliminarUsuario = async (req, res) => {
  const resultado = await getRepository(Usuario).delete(req.params.id);
  res.json(resultado);
};

module.exports = {
  obtenerUsuarios,
  crearUsuario,
  editarUsuario,
  eliminarUsuario,
};
