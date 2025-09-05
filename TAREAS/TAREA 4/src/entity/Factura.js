const { EntitySchema } = require("typeorm");

module.exports.Factura = new EntitySchema({
    name: "Factura",
    tableName: "facturas",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        fecha: {
            type: "date",
        },
    },
    relations: {
        cliente: {
            type: "many-to-one",
            target: "Cliente",
            joinColumn: {
                name: "cliente_id",
            },
            eager: true,
        },
    },
});