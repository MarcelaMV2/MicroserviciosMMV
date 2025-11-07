import { EntitySchema } from "typeorm";

module.exports.Envio = new EntitySchema({
  name: "Envio",
  tableName: "envios",
  columns: {
    id: { 
      primary: true, 
      type: "int", 
      generated: true,
    },
    usuario_id: { 
      type: "int", 
    },
    vehiculo_id: { 
      type: "varchar", 
      length: 64, 
    },
    origen: { 
      type: "varchar", 
      length: 200, 
    },
    destino: { 
      type: "varchar", 
      length: 200, 
    },
    fecha_envio: { 
      type: "datetime" 
    },
    estado: { 
      type: "enum", 
      enum: ["pendiente", "en_transito", "entregado"], 
      default: "pendiente" 
    },
  },
});
