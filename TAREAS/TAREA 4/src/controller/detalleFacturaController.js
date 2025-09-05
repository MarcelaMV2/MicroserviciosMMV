const { getRepository } = require("typeorm");
const { DetalleFactura } = require("../entity/DetalleFactura");

//const obtenerDetalles = async (req, res) => {
//  try {
//    const detalles = await getRepository(DetalleFactura).find({
//      relations: ["factura", "producto"],
//    });
//    res.json(detalles);
//  } catch (err) {
//    console.error(err);
//    res.status(500).json({ error: "Error al obtener detalles" });
//  }
//};

const obtenerDetalles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;    // número de página
    const limit = parseInt(req.query.limit) || 10; // registros por página
    const skip = (page - 1) * limit;

    const repo = getRepository(DetalleFactura);

    const [detalles, total] = await repo.findAndCount({
      relations: ["factura", "producto"],
      skip,
      take: limit,
    });

    res.json({
      total,   // total de detalles en la BD
      page,    // página actual
      limit,   // registros por página
      data: detalles,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener detalles" });
  }
};


const obtenerDetallesPorFactura = async (req, res) => {
  try {
    const { facturaId } = req.params;
    const detalles = await getRepository(DetalleFactura).find({
      where: { factura: { id: parseInt(facturaId) } },
      relations: ["producto", "factura"],
    });

    if (!detalles || detalles.length === 0) {
      return res.status(404).json({ mensaje: "No hay detalles para esta factura" });
    }

    res.json(detalles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener detalles de la factura" });
  }
};

const crearDetalle = async (req, res) => {
  try {
    const { factura_id, producto_id, cantidad, precio } = req.body;

    const nuevoDetalle = getRepository(DetalleFactura).create({
      cantidad,
      precio,
      factura: { id: factura_id },
      producto: { id: producto_id },
    });

    const resultado = await getRepository(DetalleFactura).save(nuevoDetalle);
    res.json(resultado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear detalle de factura" });
  }
};

const editarDetalle = async (req, res) => {
  try {
    const { id } = req.params;
    const { factura_id, producto_id, cantidad, precio } = req.body;

    const repo = getRepository(DetalleFactura);
    const detalle = await repo.findOne({
      where: { id: parseInt(id) },
      relations: ["factura", "producto"],
    });

    if (!detalle) {
      return res.status(404).json({ mensaje: "Detalle no encontrado" });
    }

    detalle.cantidad = cantidad;
    detalle.precio = precio;
    if (factura_id) detalle.factura = { id: factura_id };
    if (producto_id) detalle.producto = { id: producto_id };

    const resultado = await repo.save(detalle);
    res.json(resultado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al editar detalle de factura" });
  }
};


const eliminarDetalle = async (req, res) => {
  try {
    const resultado = await getRepository(DetalleFactura).delete({
      id: parseInt(req.params.id),
    });
    res.json(resultado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar detalle de factura" });
  }
};

module.exports = {
  obtenerDetalles,
  obtenerDetallesPorFactura,
  crearDetalle,
  editarDetalle,
  eliminarDetalle,
};
