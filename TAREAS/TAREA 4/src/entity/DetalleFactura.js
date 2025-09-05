const { EntitySchema } = require("typeorm");

module.exports.DetalleFactura = new EntitySchema({
    name: "DetalleFactura",
    tableName: "detalles_factura",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        cantidad: {
            type: "int",
        },
        precio: {
            type: "decimal",
            precision: 10,
            scale: 2, 
        },
    },
    relations: {
        factura: {
            type: "many-to-one",        
            target: "Factura",
            joinColumn: {
                name: "factura_id",
            },
            onDelete: "CASCADE",       
            eager: true,
        },
        producto: {
            type: "many-to-one",        
            target: "Producto",
            joinColumn: {
                name: "producto_id",
            },
            eager: true,
        },
    },
});
