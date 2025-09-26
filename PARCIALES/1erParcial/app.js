const express = require("express");
const bodyParser = require("body-parser");
const AppDataSource = require("./data_source");
const Medico = require("./entity/medico"); 

const app = express();

app.use(bodyParser.json());

AppDataSource.initialize()
  .then(() => {
    console.log("Base de datos conectada");

    app.get("/api/medicos", async (req, res) => {
      const medicoRepo = AppDataSource.getRepository(Medico);
      const medicos = await medicoRepo.find();
      res.json(medicos);
    });

    app.post("/api/medicos", async (req, res) => {
      const medicoRepo = AppDataSource.getRepository(Medico);
      const nuevoMedico = medicoRepo.create(req.body);
      await medicoRepo.save(nuevoMedico);
      res.status(201).json(nuevoMedico);
    });

    app.get("/api/medicos/:id", async (req, res) => {
      const medicoRepo = AppDataSource.getRepository(Medico);
      const medico = await medicoRepo.findOneBy({ id: parseInt(req.params.id) });
      if (!medico) return res.status(404).json({ message: "Medico no encontrado" });
      res.json(medico); 
    });

    app.put("/api/medicos/:id", async (req, res) => {
      const medicoRepo = AppDataSource.getRepository(Medico);
      const medico = await medicoRepo.findOneBy({ id: parseInt(req.params.id) });
      if (!medico) return res.status(404).json({ message: "Medico no encontrado" });

      medicoRepo.merge(medico, req.body); 
      await medicoRepo.save(medico); 
      res.json(medico); 
    });


    app.delete("/api/medicos/:id", async (req, res) => {
      const medicoRepo = AppDataSource.getRepository(Medico);
      const result = await medicoRepo.delete(req.params.id);
      if (result.affected === 0) return res.status(404).json({ message: "Medico no encontrado" });
      res.status(204).send();
    });

    app.listen(3000, () => {
      console.log("Servidor API REST iniciado en http://localhost:3000");
    });
  })
  .catch((error) => console.log(error));
