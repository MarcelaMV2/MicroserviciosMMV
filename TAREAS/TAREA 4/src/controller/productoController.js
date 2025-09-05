const { getRepository } = require("typeorm");
const bcrypt = require("bcrypt");
const { Producto } = require("../entity/Producto") 

const obtenerProductos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;    // número de página
    const limit = parseInt(req.query.limit) || 10; // registros por página
    const skip = (page - 1) * limit;

    const repo = getRepository(Producto);

    const [productos, total] = await repo.findAndCount({
      skip,
      take: limit,
    });

    res.json({
      total,   
      page,    
      limit,  
      data: productos,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener productos" });
  }
};


const crearProductos = async (req, res) => {
    const { nombre, descripcion,marca,stock } = req.body;
    const nuevoProdcuto = getRepository(Producto).create({
        nombre,
        descripcion,
        marca,
        stock,
    });
    const resultado = await getRepository(Producto).save(nuevoProdcuto);
    res.json(resultado);
};

const editarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, marca, stock } = req.body;

    const repo = getRepository(Producto);
    const producto = await repo.findOne({ where: { id: parseInt(id) } });

    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    producto.nombre = nombre;
    producto.descripcion = descripcion;
    producto.marca = marca;
    producto.stock = stock;

    const resultado = await repo.save(producto);
    res.json(resultado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al editar Producto" });
  }
};

// Eliminar un usuario
const eliminarProducto = async (req, res) => {
  const resultado = await getRepository(Producto).delete(req.params.id);
  res.json(resultado);
};


module.exports = {
    obtenerProductos,
    crearProductos,
    editarProducto,
    eliminarProducto,
}