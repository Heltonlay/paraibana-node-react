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
        console.log('houve algum erro')
    else
        console.log('sistema inicializado com sucesso')
})