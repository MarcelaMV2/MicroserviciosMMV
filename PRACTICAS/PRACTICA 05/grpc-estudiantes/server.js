import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

const PROTO_PATH = "./proto/universidad.proto";
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const proto = grpc.loadPackageDefinition(packageDefinition).universidad;


const estudiantes = [];
const cursos = [];
const inscripciones = []; 


const serviceImpl = {
  AgregarEstudiante: (call, callback) => {
    const nuevo = call.request;
    estudiantes.push(nuevo);
    callback(null, { estudiante: nuevo });
  },

  AgregarCurso: (call, callback) => {
    const nuevo = call.request;
    cursos.push(nuevo);
    callback(null, { curso: nuevo });
  },

  InscribirEstudiante: (call, callback) => {
    const { ci, codigo } = call.request;
    const yaExiste = inscripciones.find(i => i.ci === ci && i.codigo === codigo);
    if (yaExiste) {
      return callback({
        code: grpc.status.ALREADY_EXISTS,
        message: "El estudiante ya está inscrito en este curso"
      });
    }
    inscripciones.push({ ci, codigo });
    callback(null, { mensaje: "Inscripción realizada correctamente" });
  },

  ListarCursosDeEstudiante: (call, callback) => {
    const { ci } = call.request;
    const cursosEst = inscripciones
      .filter(i => i.ci === ci)
      .map(i => cursos.find(c => c.codigo === i.codigo));
    callback(null, { cursos: cursosEst });
  },

  ListarEstudiantesDeCurso: (call, callback) => {
    const { codigo } = call.request;
    const ests = inscripciones
      .filter(i => i.codigo === codigo)
      .map(i => estudiantes.find(e => e.ci === i.ci));
    callback(null, { estudiantes: ests });
  }
};


const server = new grpc.Server();
server.addService(proto.UniversidadService.service, serviceImpl);

const PORT = "50051";
server.bindAsync(
  `0.0.0.0:${PORT}`,
  grpc.ServerCredentials.createInsecure(),
  (err, bindPort) => {
    if (err) return console.error(err);
    console.log(`Servidor gRPC escuchando en ${bindPort}`);
    server.start();
  }
);
