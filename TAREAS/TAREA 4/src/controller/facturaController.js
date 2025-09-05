const { getRepository } = require("typeorm");
const { Factura } = require("../entity/Factura");


const obtenerFacturas = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;    // número de página
    const limit = parseInt(req.query.limit) || 10; // registros por página
    const skip = (page - 1) * limit;

    const repo = getRepository(Factura);

    const [facturas, total] = await repo.findAndCount({
      relations: ["cliente"],
      skip,
      take: limit,
    });

    res.json({
      total,   // total de facturas en la BD
      page,    // página actual
      limit,   // registros por página
      data: facturas,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener facturas" });
  }
};


const crearFactura = async (req, res) => {
  try {
    const { fecha, cliente_id } = req.body;

    const nuevaFactura = getRepository(Factura).create({
      fecha,
      cliente: { id: cliente_id }, 
    });

    const resultado = await getRepository(Factura).save(nuevaFactura);
    res.json(resultado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear factura" });
  }
};

const editarFactura = async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha, cliente_id } = req.body;

    const repo = getRepository(Factura);
    const factura = await repo.findOne({
      where: { id: parseInt(id) },
      relations: ["cliente"],
    });

    if (!factura) {
      return res.status(404).json({ mensaje: "Factura no encontrada" });
    }

    factura.fecha = fecha;
    if (cliente_id) {
      factura.cliente = { id: cliente_id };
    }

    const resultado = await repo.save(factura);
    res.json(resultado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al editar factura" });
  }
};

const eliminarFactura = async (req, res) => {
  try {
    const resultado = await getRepository(Factura).delete({
      id: parseInt(req.params.id),
    });
    res.json(resultado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar factura" });
  }
};

module.exports = {
  obtenerFacturas,
  crearFactura,
  editarFactura,
  eliminarFactura,
};
