const { EntitySchema } = require("typeorm");

module.exports.Cliente = new EntitySchema({
    name: "Cliente",
    tableName: "clientes",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        ci: {
            type: "varchar",
            unique: true,
        },
        nombres:{
            type: "varchar",
        },
        apellidos: {
            type: "varchar",
        },
        sexo: {
            type: "enum",
            enum: ["M", "F"],
        },
    },
});