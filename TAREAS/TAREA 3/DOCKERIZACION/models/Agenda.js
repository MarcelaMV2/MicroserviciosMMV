const mongoose = require('mongoose');

const AgendaSchema = new mongoose.Schema({
  nombres: { type: String, required: true, trim: true },
  apellidos: { type: String, required: true, trim: true },
  fecha_nacimiento: { type: Date, required: true },
  direccion: { type: String, trim: true },
  celular: { type: String, trim: true },
  correo: { type: String, trim: true, lowercase: true }
}, { collection: 'agenda' });

module.exports = mongoose.model('Agenda', AgendaSchema);
