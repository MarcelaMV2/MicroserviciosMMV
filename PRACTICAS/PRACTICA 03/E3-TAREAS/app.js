const express = require('express');
const { default: mongoose } = require('mongoose');
const Tarea = require('./models/tarea');

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended:true}));

mongoose.connect('mongodb://mongo:27017/db_tareas')
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

app.get('/', async (req,res)=>{
    const tareas = await Tarea.find();
    res.render('index', {tareas });
});

app.get('/add', (req, res) => {
    res.render('add');
})


app.post('/add', async(req,res) => {
    const {titulo, descripcion, estado } = req.body;
    await Tarea.create({ titulo, descripcion, estado});
    res.redirect('/');
})

app.get('/edit/:id', async (req,res) => {
    const tarea = await Tarea.findById(req.params.id);
    res.render('edit',{ tarea });
});

app.post('/edit/:id', async (req,res) => {
    const {titulo, descripcion, estado } = req.body;
    await Tarea.findByIdAndUpdate(req.params.id, {titulo, descripcion, estado});
    res.redirect('/');
});

app.get('/delete/:id', async (req,res) => {
    await Tarea.findByIdAndDelete(req.params.id);
    res.redirect('/');
})
const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
