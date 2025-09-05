const { getRepository } = require("typeorm");
const bcrypt = require("bcrypt");
const { Cliente } = require("../entity/Cliente");

const obtenerClientes = async (req, res) => {
    const clientes = await getRepository(Cliente).find();
    res.json(clientes);
};

const crearClientes = async (req, res) => {
    const { ci, nombres, apellidos, sexo } = req.body;
    const nuevoCliente = getRepository(Cliente).create({
        ci,
        nombres,
        apellidos,
        sexo,
    });
    const resultado = await getRepository(Cliente).save(nuevoCliente);
    res.json(resultado);
};

//const editarCliente = async (req, res) => {
//  const { ci, nombres, apellidos, sexo  } = req.body;
//  const cliente = await getRepository(Cliente).findOne(req.params.id);
//  if (cliente) {
//    cliente.ci = ci;
//    cliente.nombres = nombres;
//    cliente.apellidos = apellidos;
//    cliente.sexo = sexo;
//    const resultado = await getRepository(Cliente).save(cliente);
//    res.json(resultado);
//  } else {
//    res.status(404).json({ mensaje: "Cliente no encontrado" });
//  }
//};
const editarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { ci, nombres, apellidos, sexo } = req.body;

    const repo = getRepository(Cliente);
    const cliente = await repo.findOne({ where: { id: parseInt(id) } });

    if (!cliente) {
      return res.status(404).json({ mensaje: "Cliente no encontrado" });
    }

    cliente.ci = ci;
    cliente.nombres = nombres;
    cliente.apellidos = apellidos;
    cliente.sexo = sexo;

    const resultado = await repo.save(cliente);
    res.json(resultado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al editar cliente" });
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