import { buildSchema } from "graphql";

export const schema = buildSchema(`
  type Envio {
    id: ID!
    usuario_id: Int!
    vehiculo_id: String!
    origen: String!
    destino: String!
    fecha_envio: String!
    estado: String!
  }

  type Query {
    envios: [Envio!]!
  }

  type Mutation {
    createEnvio(
      usuario_id: Int!,
      vehiculo_id: String!,
      origen: String!,
      destino: String!,
      fecha_envio: String!
    ): Envio!
  }
`);
