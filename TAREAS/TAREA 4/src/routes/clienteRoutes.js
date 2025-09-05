const express = require("express");
const { getRepository } = require("typeorm");
const { Cliente } = require("../entity/Cliente");
const { obtenerClientes, crearClientes, editarCliente, eliminarCliente } = require("../controller/clienteController");

const router = express.Router();

/**
 * @swagger
 * /api/clientes:
 *   get:
 *     summary: Obtener todos los clientes (con paginación)
 *     description: Retorna una lista de clientes en la base de datos.
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
 *         description: Lista de clientes obtenida correctamente.
 */
router.get("/", obtenerClientes);


/**
 * @swagger
 * /api/clientes/{id}:
 *   get:
 *     summary: Obtener un cliente por ID
 *     description: Retorna un cliente específico.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cliente a buscar.
 *     responses:
 *       200:
 *         description: Cliente encontrado.
 *       404:
 *         description: Cliente no encontrado.
 */
router.get("/:id", async (req, res) => {
  const cliente = await getRepository(Cliente).findOneBy({ id: req.params.id });
  if (!cliente) {
    return res.status(404).json({ mensaje: "Cliente no encontrado" });
  }
  res.json(cliente);
});

/**
 * @swagger
 * /api/clientes:
 *   post:
 *     summary: Crear un cliente
 *     description: Crea un nuevo cliente en la base de datos.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ci: 
 *                 type: string
 *                 example: "10541111"
 *               nombres: 
 *                 type: string
 *                 example: "Marcela Paola"
 *               apellidos: 
 *                 type: string
 *                 example: "Miranda Veniz"
 *               sexo:
 *                 type: string
 *                 example: "F"
 *     responses:
 *       201:
 *         description: Cliente creado correctamente.
 */
router.post("/", crearClientes);

/**
 * @swagger
 * /api/clientes/{id}:
 *   put:
 *     summary: Editar un cliente
 *     description: Actualiza los datos de un cliente existente.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cliente a editar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ci: 
 *                 type: string
 *                 example: "10541111"
 *               nombres: 
 *                 type: string
 *                 example: "Emanuel Editado"
 *               apellidos: 
 *                 type: string
 *                 example: "Miranda Veniz"
 *               sexo:
 *                 type: string
 *                 enum: [M, F]
 *                 example: "M"
 *     responses:
 *       200:
 *         description: Cliente actualizado correctamente.
 *       400:
 *         description: Datos inválidos.
 *       404:
 *         description: Cliente no encontrado.
 */
router.put("/:id", editarCliente);


/**
 * @swagger
 * /api/clientes/{id}:
 *   delete:
 *     summary: Eliminar un cliente
 *     description: Elimina un cliente por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cliente a eliminar.
 *     responses:
 *       200:
 *         description: Cliente eliminado correctamente.
 *       404:
 *         description: Cliente no encontrado.
 */
router.delete("/:id", eliminarCliente);

module.exports = router;
