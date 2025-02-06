const express = require('express')
const app = express();
const funcionarios = require('./entidades/funcionarios');
const produtos = require('./entidades/produtos');
const categorias = require('./entidades/categorias');
const vendas = require('./entidades/vendas');

const permitirCross = (req, res, next) => {
    res.header(`Access-Control-Allow-Origin`, `*`);
    res.header(`Access-Control-Allow-Methods`, `GET,PUT,POST,DELETE`);
    res.header(`Access-Control-Allow-Headers`, `Content-Type`);
    next();
};

app.use(express.json())
app.use(permitirCross);
app.use(funcionarios, produtos, categorias, vendas);

app.listen(8080, (error) => {
    if (error)
        console.log('Houve algum erro: ' + error)
    else
        console.log('Sistema inicializado com sucesso.\nEscutando requisicoes HTTP nos metodos GET, POST, PUT e DELETE.')
})