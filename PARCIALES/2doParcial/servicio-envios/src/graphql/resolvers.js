import jwt from "jsonwebtoken";
import { AppDataSource } from "../database.js";
import { Envio } from "../entities/envio.js";
import { checkAvailability } from "../grpc/client.js";

const requireAuth = (req) => {
  const auth = req.headers.authorization || "";
  if (!auth.startsWith("Bearer ")) throw new Error("No autorizado");
  const token = auth.split(" ")[1];
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "secret123");
  } catch {
    throw new Error("Token inválido");
  }
};

export const rootResolvers = {
  envios: async (args, req) => {
    requireAuth(req);
    const repo = AppDataSource.getRepository(Envio);
    return await repo.find();
  },

  createEnvio: async ({ usuario_id, vehiculo_id, origen, destino, fecha_envio }, req) => {
    requireAuth(req);

    const available = await checkAvailability(vehiculo_id);
    if (!available) throw new Error("Vehículo no disponible");

    const repo = AppDataSource.getRepository(Envio);
    const nuevo = repo.create({
      usuario_id,
      vehiculo_id,
      origen,
      destino,
      fecha_envio,
      estado: "pendiente"
    });
    const guardado = await repo.save(nuevo);
    return guardado;
  }
};
