const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const Agenda = require('./models/Agenda'); 

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); 
app.use(methodOverride('_method'));               
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);
app.set('layout', 'layout');

mongoose.connect('mongodb://127.0.0.1:27017/bd_agenda')
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('MongoDB:', err.message));


// LISTAR (GET /)
app.get('/', async (req, res) => {
  const agenda = await Agenda.find();
  res.render('index', { agenda });
});

// FORM CREAR (GET /add)
app.get('/add', (req, res) => {
  res.render('add'); 
});

// CREAR (POST /contactos)
app.post('/contactos', async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.fecha_nacimiento) data.fecha_nacimiento = new Date(data.fecha_nacimiento);
    await Agenda.create(data);
    res.redirect('/');
  } catch (err) {
    res.status(400).send('Error al crear: ' + err.message);
  }
});


// FORM EDITAR (GET /contactos/:id/edit)
app.get('/contactos/:id/edit', async (req, res) => {
  try {
    const persona = await Agenda.findById(req.params.id);
    if (!persona) return res.status(404).send('No encontrado');
    res.render('edit', { persona });
  } catch (err) {
    res.status(400).send('Error al cargar edición: ' + err.message);
  }
});

// ACTUALIZAR (PUT /contactos/:id)
app.put('/contactos/:id', async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.fecha_nacimiento) data.fecha_nacimiento = new Date(data.fecha_nacimiento);
    await Agenda.findByIdAndUpdate(req.params.id, data, { runValidators: true });
    res.redirect('/');
  } catch (err) {
    res.status(400).send('Error al actualizar: ' + err.message);
  }
});

// ELIMINAR (DELETE /contactos/:id)
app.delete('/contactos/:id', async (req, res) => {
  try {
    await Agenda.findByIdAndDelete(req.params.id);
    res.redirect('/');
  } catch (err) {
    res.status(400).send('Error al eliminar: ' + err.message);
  }
});

/* ================== 404 y servidor =================== */
app.use((req, res) => res.status(404).send('Ruta no encontrada'));
app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));
