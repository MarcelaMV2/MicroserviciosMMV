import "dotenv/config";
import express from "express";
import { graphqlHTTP } from "express-graphql";
import { schema } from "./graphql/schema.js";
import { rootResolvers } from "./graphql/resolvers.js";
import { initDB } from "./database.js";

const app = express();

// GraphQL con acceso al req para JWT (igual patrón del ejemplo)
app.use("/graphql", (req, res) =>
  graphqlHTTP({
    schema,
    rootValue: rootResolvers,
    graphiql: true,      
    context: { req }
  })(req, res)
);

const PORT = process.env.ENVIOS_PORT || 3003;

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Envíos GraphQL en http://localhost:${PORT}/graphql`);
  });
});
