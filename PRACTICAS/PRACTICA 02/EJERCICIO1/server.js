const express = require('express');
const app = express();
const port = 8080; // importante: puerto solicitado

// Middleware para parsear los datos del formulario
app.use(express.urlencoded({ extended: false }));

// Ruta para mostrar el formulario y el resultado
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <title>Calculadora Web</title>
            <style>
                body {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    font-family: Arial, sans-serif;
                }
                .container {
                    text-align: center;
                }
                input, select, button {
                    display: block;
                    margin: 10px auto;
                    padding: 10px;
                    font-size: 18px;
                    width: 200px;
                }
                h2 {
                    margin-bottom: 20px;
                }
                .resultado {
                    margin-top: 20px;
                    font-size: 20px;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Calculadora Web</h2>
                <form method="POST" action="/calcular">
                    <input type="number" name="num1" placeholder="Número 1" required>
                    <input type="number" name="num2" placeholder="Número 2" required>
                    <select name="op">
                        <option value="sumar">Sumar</option>
                        <option value="restar">Restar</option>
                        <option value="multiplicar">Multiplicar</option>
                        <option value="dividir">Dividir</option>
                    </select>
                    <button type="submit">Calcular</button>
                </form>
                <div class="resultado">
                    ${req.query.resultado ? "Resultado: " + req.query.resultado : ""}
                </div>
            </div>
        </body>
        </html>
    `);
});

// Ruta para procesar la operación
app.post('/calcular', (req, res) => {
    const num1 = parseFloat(req.body.num1);
    const num2 = parseFloat(req.body.num2);
    const op = req.body.op;

    let resultado;
    switch (op) {
        case 'sumar':
            resultado = num1 + num2;
            break;
        case 'restar':
            resultado = num1 - num2;
            break;
        case 'multiplicar':
            resultado = num1 * num2;
            break;
        case 'dividir':
            resultado = num2 !== 0 ? num1 / num2 : 'Error: división entre 0';
            break;
    }

    // Redirige a la página principal mostrando el resultado debajo del formulario
    res.redirect('/?resultado=' + resultado);
});

// Levantar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
