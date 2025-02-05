const express = require('express')
const app = express();
app.use(express.json())
const funcionarios = require('./entidades/funcionarios');
const produtos = require('./entidades/produtos');
const categorias = require('./entidades/categorias');
const vendas = require('./entidades/vendas');

app.use(funcionarios, produtos, categorias, vendas);

app.listen(8080, (error) => {
    if (error)
        console.log('Houve algum erro: ' + error)
    else
        console.log('Sistema inicializado com sucesso.\nEscutando requisições HTTP nos métodos GET, POST, PUT e DELETE.')
})