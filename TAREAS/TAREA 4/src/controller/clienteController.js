const { getRepository } = require("typeorm");
const bcrypt = require("bcrypt");
const { Cliente } = require("../entity/Cliente");

const obtenerClientes = async (req, res) => {
    const clientes = await getRepository(Cliente).find();
    res.json(clientes);
};

const crearClientes = async (req, res) => {
    const { nombres, apellidos, sexo } = req.body;
    const nuevoCliente = getRepository(Cliente).create({
        nombres,
        apellidos,
        sexo,
    });
    const resultado = await getRepository(Cliente).save(nuevoCliente);
    res.json(resultado);
};

const editarCliente = async (req, res) => {
  const { nombres, apellidos, sexo  } = req.body;
  const cliente = await getRepository(Cliente).findOne(req.params.id);
  if (cliente) {
    cliente.nombres = nombres;
    cliente.apellidos = apellidos;
    cliente.sexo = sexo;
    const resultado = await getRepository(Cliente).save(cliente);
    res.json(resultado);
  } else {
    res.status(404).json({ mensaje: "Cliente no encontrado" });
  }
};

// Eliminar un usuario
const eliminarCliente = async (req, res) => {
  const resultado = await getRepository(Cliente).delete(req.params.id);
  res.json(resultado);
};


module.exports = {
    obtenerClientes,
    crearClientes,
    editarCliente,
    eliminarCliente,
}