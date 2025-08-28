const express = require('express');
const router = express.Router();
const Tarea = require('../models/tarea');

// Crear tarea
router.post('/', async (req, res) => {
  try {
    const tarea = new Tarea(req.body);
    await tarea.save();
    res.json(tarea);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Listar todas las tareas
router.get('/', async (req, res) => {
  const tareas = await Tarea.find();
  res.json(tareas);
});

// Obtener una tarea por ID
router.get('/:id', async (req, res) => {
  try {
    const tarea = await Tarea.findById(req.params.id);
    if (!tarea) return res.status(404).json({ error: 'Tarea no encontrada' });
    res.json(tarea);
  } catch (err) {
    res.status(404).json({ error: 'Tarea no encontrada' });
  }
});

// Actualizar tarea
router.put('/:id', async (req, res) => {
  try {
    const actualizada = await Tarea.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(actualizada);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Eliminar tarea
router.delete('/:id', async (req, res) => {
  try {
    await Tarea.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Tarea eliminada' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
