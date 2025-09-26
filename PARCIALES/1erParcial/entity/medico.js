const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Medico',
  tableName: 'medico',
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
    cedula_profesional: {
      type: 'varchar',
      length: 100,
    },
    especialidad: {
      type: 'varchar',
      length: 70,
    },
    años_experiencia: {
      type: 'int',
    },
    correo: {
      type: 'varchar',
      length: 50,
    },
  },
});
