import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

const PROTO_PATH = "./proto/universidad.proto";
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const proto = grpc.loadPackageDefinition(packageDefinition).universidad;

const client = new proto.UniversidadService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

client.AgregarEstudiante(
  { ci: "123", nombres: "Ana", apellidos: "Suárez", carrera: "Sistemas" },
  (err, resEst) => {
    if (err) return console.error(err);
    console.log("Estudiante agregado:", resEst.estudiante);


    client.AgregarCurso(
      { codigo: "INF101", nombre: "Programación I", docente: "Juan Pérez" },
      (err, resC1) => {
        if (err) return console.error(err);
        console.log("Curso agregado:", resC1.curso);


        client.AgregarCurso(
          { codigo: "INF102", nombre: "Bases de Datos", docente: "María López" },
          (err, resC2) => {
            if (err) return console.error(err);
            console.log("Curso agregado:", resC2.curso);


            client.InscribirEstudiante(
              { ci: "123", codigo: "INF101" },
              (err, resI1) => {
                if (err) return console.error(err);
                console.log(resI1.mensaje);

                client.InscribirEstudiante(
                  { ci: "123", codigo: "INF102" },
                  (err, resI2) => {
                    if (err) return console.error(err);
                    console.log(resI2.mensaje);

                    
                    client.ListarCursosDeEstudiante(
                      { ci: "123" },
                      (err, resCursos) => {
                        if (err) return console.error(err);
                        console.log("Cursos de Ana:", resCursos.cursos);

                       
                        client.ListarEstudiantesDeCurso(
                          { codigo: "INF101" },
                          (err, resEsts) => {
                            if (err) return console.error(err);
                            console.log(
                              "Estudiantes en Programación I:",
                              resEsts.estudiantes
                            );
                          }
                        );
                      }
                    );
                  }
                );
              }
            );
          }
        );
      }
    );
  }
);
