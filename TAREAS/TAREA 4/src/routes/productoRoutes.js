const express = require("express");
const { getRepository } = require("typeorm");
const { Producto } = require("../entity/Producto");
const { obtenerProductos, crearProductos, editarProducto, eliminarProducto } = require("../controller/productoController");

const router = express.Router();

/**
 * @swagger
 * /api/productos:
 *   get:
 *     summary: Obtener todos los productos (con paginación)
 *     description: Retorna una lista de productos de la base de datos.
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
 *         description: Lista de productos obtenida correctamente.
 */
router.get("/", obtenerProductos);


/**
 * @swagger
 * /api/productos/{id}:
 *   get:
 *     summary: Obtener un producto por ID
 *     description: Retorna un producto específico.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto a buscar.
 *     responses:
 *       200:
 *         description: Producto encontrado.
 *       404:
 *         description: Producto no encontrado.
 */
router.get("/:id", async (req, res) => {
  const producto = await getRepository(Producto).findOneBy({ id: req.params.id });
  if (!producto) {
    return res.status(404).json({ mensaje: "Producto no encontrado" });
  }
  res.json(producto);
});

/**
 * @swagger
 * /api/productos:
 *   post:
 *     summary: Crear un producto
 *     description: Crea un nuevo producto en la base de datos.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               marca:
 *                 type: string
 *               stock:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Producto creado correctamente.
 */
router.post("/", crearProductos);

/**
 * @swagger
 * /api/productos/{id}:
 *   put:
 *     summary: Editar un producto
 *     description: Actualiza los datos de un producto existente.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del Producto a editar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre: 
 *                 type: string
 *                 example: "string"
 *               descripcion: 
 *                 type: string
 *                 example: "string"
 *               marca: 
 *                 type: string
 *                 example: "string"
 *               stock:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Producto actualizado correctamente.
 *       404:
 *         description: Producto no encontrado.
 */
router.put("/:id", editarProducto);

/**
 * @swagger
 * /api/productos/{id}:
 *   delete:
 *     summary: Eliminar un producto
 *     description: Elimina un producto por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Producto eliminado correctamente.
 *       404:
 *         description: Producto no encontrado.
 */
router.delete("/:id", eliminarProducto);

module.exports = router;
