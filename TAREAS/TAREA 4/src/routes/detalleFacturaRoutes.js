const express = require("express");
const { getRepository } = require("typeorm");
const { DetalleFactura } = require("../entity/DetalleFactura");
const {obtenerDetalles, obtenerDetallesPorFactura, crearDetalle, editarDetalle, eliminarDetalle } = require("../controller/detalleFacturaController");

const router = express.Router();

/**
 * @swagger
 * /detalles:
 *   get:
 *     summary: Obtener todos los detalles de facturas
 *     description: Retorna una lista de todos los detalles de facturas con sus productos y facturas asociadas.
 *     responses:
 *       200:
 *         description: Lista de detalles obtenida correctamente.
 */
router.get("/", obtenerDetalles);

/**
 * @swagger
 * /detalles/factura/{facturaId}:
 *   get:
 *     summary: Obtener detalles de una factura específica
 *     description: Retorna todos los detalles de una factura en particular.
 *     parameters:
 *       - in: path
 *         name: facturaId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la factura.
 *     responses:
 *       200:
 *         description: Lista de detalles de la factura.
 *       404:
 *         description: No se encontraron detalles para esta factura.
 */
router.get("/factura/:facturaId", obtenerDetallesPorFactura);

/**
 * @swagger
 * /detalles:
 *   post:
 *     summary: Crear un detalle de factura
 *     description: Crea un nuevo detalle de factura asociado a un producto y una factura existente.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               factura_id:
 *                 type: integer
 *                 example: 1
 *               producto_id:
 *                 type: integer
 *                 example: 2
 *               cantidad:
 *                 type: integer
 *                 example: 3
 *               precio:
 *                 type: number
 *                 format: float
 *                 example: 150.50
 *     responses:
 *       201:
 *         description: Detalle creado correctamente.
 */
router.post("/", crearDetalle);

/**
 * @swagger
 * /detalles/{id}:
 *   put:
 *     summary: Editar un detalle de factura
 *     description: Actualiza los datos de un detalle de factura existente.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del detalle a editar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               factura_id:
 *                 type: integer
 *                 example: 1
 *               producto_id:
 *                 type: integer
 *                 example: 3
 *               cantidad:
 *                 type: integer
 *                 example: 5
 *               precio:
 *                 type: number
 *                 format: float
 *                 example: 200.00
 *     responses:
 *       200:
 *         description: Detalle actualizado correctamente.
 *       400:
 *         description: Datos inválidos.
 *       404:
 *         description: Detalle no encontrado.
 */
router.put("/:id", editarDetalle);

/**
 * @swagger
 * /detalles/{id}:
 *   delete:
 *     summary: Eliminar un detalle de factura
 *     description: Elimina un detalle de factura por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del detalle a eliminar.
 *     responses:
 *       200:
 *         description: Detalle eliminado correctamente.
 *       404:
 *         description: Detalle no encontrado.
 */
router.delete("/:id", eliminarDetalle);

module.exports = router;
