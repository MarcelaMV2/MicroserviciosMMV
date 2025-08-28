const express = require('express');
const app = express()
const port = 8080;

app.use(express.urlencoded({ extended: false}));

// Ruta para mostrar el formulario
app.get('/', (req, res) => {
    res.send(`
        <head>
        <style>
            .container{
                width: 30%;
                text-align: center;
                margin: 0 auto;
                padding-top: 20px;
                height: 500px;
                border-radius: 2px solid black;
            }
            label{
                font-family: Verdana, Geneva, Tahoma, sans-serif;
            }
            input, select, button {
                display: block;
                margin: 10px auto;
                padding: 10px;
                font-size: 18px;
                width: 200px;
            }
            h2{
                font-family: Verdana, Geneva, Tahoma, sans-serif;
                color: rgb(6, 69, 129);
            }
            button{
                background-color: rgb(6, 69, 129);
                color: white;
                border: none;
                cursor: pointer;
                border-radius: 5px;
            }
            button:hover{
                background-color: rgb(4, 49, 95);
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>CALCULADORA</h2>
            <form method="POST" action="/calcular">
                <label for="num1">Numero 1: </label> <br>
                <input type="number" id="num1" name="num1" required>
                <br>
                <label for="num2">Numero 2: </label> <br>
                <input type="number" id="num2" name="num2" required>
                <br>
                <select name="op" required>
                    <option value="">Escoje el operador</option>
                    <option value="sumar">SUMA</option>
                    <option value="restar">RESTA</option>
                    <option value="multiplicar">MULTIPLICACION</option>
                    <option value="dividir">DIVISION</option>
                </select>
                <button type="submit">Calcular</button>
            </form>
        </div>
    </body>
    `);
});


app.post('/calcular', (req,res) =>{
    const num1 = parseFloat(req.body.num1);    
    const num2 = parseFloat(req.body.num2);
    let resultado;
    const op = req.body.op;
    switch(op){
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
    
    res.send(`
        <head>
        <style>
            .container{
                width: 40%;
                text-align: center;
                margin: 50px auto;
                padding: 20px;
                border: 2px solid black;
                border-radius: 8px;
                font-family: Verdana, Geneva, Tahoma, sans-serif;
            }
            .resultado{
                font-size: 22px;
                color: white;
                background-color: rgb(6, 69, 129);
                padding: 15px;
                border-radius: 8px;
                margin: 20px 0;
            }
            a{
                display: inline-block;
                margin-top: 20px;
                padding: 10px 20px;
                background-color: rgb(6, 69, 129);
                color: white;
                text-decoration: none;
                border-radius: 5px;
            }
            a:hover{
                background-color: rgb(4, 49, 95);
            }
        </style>
        </head>
        <body>
            <div class="container">
                <h2>RESULTADO</h2>
                <div class="resultado">La ${op} de ${num1} y ${num2} es <b>${resultado}</b></div>
                <a href="/">Volver a la Calculadora</a>
            </div>
        </body>
    `);
});

app.listen(port, () => { 
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
