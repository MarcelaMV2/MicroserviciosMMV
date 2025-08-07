const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Agenda',
  tableName: 'agenda',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    nombres: {
      type: 'varchar',
      length: 50,
    },
    apellidos: {
      type: 'varchar',
      length: 50,
    },
    fecha_nacimiento: {
      type: 'date',
    },
    direccion: {
      type: 'varchar',
      length: 70,
    },
    celular: {
      type: 'int',
    },
    correo: {
      type: 'varchar',
      length: 50,
    },
  },
});
