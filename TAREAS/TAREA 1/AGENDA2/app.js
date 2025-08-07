const express = require("express");
const bodyParser = require("body-parser");
const AppDataSource = require("./data_source");
const Agenda = require("./entity/agenda");
const expressLayouts = require('express-ejs-layouts');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set('layout', 'layout');

AppDataSource.initialize()
  .then(() => {
    console.log("Base de datos conectada");

    // Listar todos
    app.get("/", async (req, res) => {
      const agendaRepo = AppDataSource.getRepository(Agenda);
      const agenda = await agendaRepo.find();
      res.render("index", { agenda });
    });

    // Mostrar formulario para agregar
    app.get("/add", (req, res) => {
      res.render("add");
    });

    // Guardar nuevo contacto
    app.post("/add", async (req, res) => {
      const agendaRepo = AppDataSource.getRepository(Agenda);
      const nuevo = agendaRepo.create(req.body);
      await agendaRepo.save(nuevo);
      res.redirect("/");
    });

    // Mostrar formulario para editar
    app.get("/edit/:id", async (req, res) => {
      const agendaRepo = AppDataSource.getRepository(Agenda);
      const contacto = await agendaRepo.findOneBy({ id: parseInt(req.params.id) });
      if (!contacto) return res.send("No existe contacto");
      res.render("edit", { contacto });
    });

    // Actualizar contacto
    app.post("/edit/:id", async (req, res) => {
      const agendaRepo = AppDataSource.getRepository(Agenda);
      const contacto = await agendaRepo.findOneBy({ id: parseInt(req.params.id) });
      if (!contacto) return res.send("No existe contacto");

      agendaRepo.merge(contacto, req.body);
      await agendaRepo.save(contacto);
      res.redirect("/");
    });

    // Eliminar contacto
    app.get("/delete/:id", async (req, res) => {
      const agendaRepo = AppDataSource.getRepository(Agenda);
      await agendaRepo.delete(req.params.id);
      res.redirect("/");
    });

    app.listen(3000, () => {
      console.log("Servidor iniciado en http://localhost:3000");
    });
  })
  .catch((error) => console.log(error));
