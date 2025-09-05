const express = require("express");
const { getRepository } = require("typeorm");
const { Factura } = require("../entity/Factura");
const { obtenerFacturas, crearFactura, editarFactura, eliminarFactura } = require("../controller/facturaController");

const router = express.Router();

/**
 * @swagger
 * /api/facturas:
 *   get:
 *     summary: Obtener todas las facturas (con paginación)
 *     description: Retorna una lista de facturas con su cliente asociado.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Número de página (por defecto 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Cantidad de registros por página (por defecto 10)
 *     responses:
 *       200:
 *         description: Lista de facturas obtenida correctamente.
 */
router.get("/", obtenerFacturas);


/**
 * @swagger
 * /api/facturas/{id}:
 *   get:
 *     summary: Obtener una factura por ID
 *     description: Retorna una factura específica con su cliente asociado.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la factura a buscar.
 *     responses:
 *       200:
 *         description: Factura encontrada.
 *       404:
 *         description: Factura no encontrada.
 */
router.get("/:id", async (req, res) => {
  const factura = await getRepository(Factura).findOne({
    where: { id: parseInt(req.params.id) },
    relations: ["cliente"],
  });
  if (!factura) {
    return res.status(404).json({ mensaje: "Factura no encontrada" });
  }
  res.json(factura);
});

/**
 * @swagger
 * /api/facturas:
 *   post:
 *     summary: Crear una factura
 *     description: Crea una nueva factura asociada a un cliente existente.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fecha: 
 *                 type: string
 *                 format: date
 *                 example: "2025-09-05"
 *               cliente_id: 
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Factura creada correctamente.
 */
router.post("/", crearFactura);

/**
 * @swagger
 * /api/facturas/{id}:
 *   put:
 *     summary: Editar una factura
 *     description: Actualiza los datos de una factura existente.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la factura a editar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fecha: 
 *                 type: string
 *                 format: date
 *                 example: "2025-09-10"
 *               cliente_id: 
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Factura actualizada correctamente.
 *       400:
 *         description: Datos inválidos.
 *       404:
 *         description: Factura no encontrada.
 */
router.put("/:id", editarFactura);

/**
 * @swagger
 * /api/facturas/{id}:
 *   delete:
 *     summary: Eliminar una factura
 *     description: Elimina una factura por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la factura a eliminar.
 *     responses:
 *       200:
 *         description: Factura eliminada correctamente.
 *       404:
 *         description: Factura no encontrada.
 */
router.delete("/:id", eliminarFactura);

module.exports = router;
