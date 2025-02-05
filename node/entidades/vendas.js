const { Router } = require('express')
const router = Router();
const pool = require('../pool');

router.get('/vendas', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        let rows = await conn.query(`SELECT * FROM vendas`);
        const relacaoProdutosRows = await conn.query(`SELECT * FROM vendas_produtos`);
        const produtosRows = await conn.query(`SELECT * FROM produtos`);
        console.log(rows);

        rows = rows.map(venda => {
            const produtos = relacaoProdutosRows
                .filter(produto => { return produto["id_venda"] == venda["id"]; })
                .map(produto => { return produtosRows.filter(obj => obj["id"] == produto["id_produto"])[0] });

            return { ...venda, produtos: produtos };
        });

        const jsonS = JSON.stringify(rows);
        res.writeHead(200, { 'Content-Type': 'text/json' })
        res.end(jsonS);
    }
    catch (e) {
        console.error(e.message);
        res.writeHead(500, { 'Content-Type': 'text/plain' })
        res.end(e.message);
    }
})

router.post('/vendas', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();

        console.log(req.body)

        if (isNaN(req.body["id_funcionario"]))
            throw new Error("O id do funcionário precisa ser especificado.");

        if (typeof req.body["nome_cliente"] !== 'string' || !req.body["nome_cliente"] instanceof String)
            throw new Error("O nome precisa ser especificado.");

        if (isNaN(req.body["valor"]))
            throw new Error("O valor da venda precisa ser especificado.");

        if (typeof req.body["id_produto"] !== 'object' || !req.body["id_produto"] instanceof Object)
            throw new Error("Os ids dos produtos precisam ser especificados.");

        const rows = await conn.query(`INSERT INTO vendas VALUES(null, 
            ${req.body["id_funcionario"]}, 
            "${req.body["nome_cliente"]}", 
            "${req.body["cpf_cliente"]}", 
            ${req.body["valor"]})`);

        console.log(rows);
        const id = String(rows["insertId"]).replace('n', '');

        let sqlCommand = '';
        for (let i = 0; i < req.body["id_produto"].length; i++) {
            let lastChar = i + 1 < req.body["id_produto"].length ? ', ' : ';';

            sqlCommand += `(null, ${id}, ${req.body["id_produto"][i]})${lastChar}`;
        }

        const produtosRows = await conn.query(`INSERT INTO vendas_produtos VALUES ${sqlCommand}`);

        console.log(produtosRows);

        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.end(String(rows["insertId"]).replace('n', ''));
    }
    catch (e) {
        console.error(e.message);
        res.writeHead(400, { 'Content-Type': 'text/plain' })
        res.end(e.message);
    }
})

router.put('/vendas/*', async (req, res) => {
    let conn;
    let errorCode = 400;
    try {
        conn = await pool.getConnection();

        const id = req.url.substring(8);

        if (isNaN(id))
            throw new Error("Id incorreto.");

        if (isNaN(req.body["id_funcionario"]))
            throw new Error("O id do funcionário precisa ser especificado.");

        if (typeof req.body["nome_cliente"] !== 'string' || !req.body["nome_cliente"] instanceof String)
            throw new Error("O nome precisa ser especificado.");

        if (isNaN(req.body["valor"]))
            throw new Error("O valor da venda precisa ser especificado.");

        const rows = await conn.query(`UPDATE vendas SET 
            id_funcionario = ${req.body["id_funcionario"]}, 
            nome_cliente = "${req.body["nome_cliente"]}", 
            cpf_cliente = "${req.body["cpf_cliente"]}", 
            valor = ${req.body["valor"]}, 
            WHERE id = ${id}`);

        if (rows["affectedRows"] == 0) {
            errorCode = 404;
            throw new Error("Id não encontrado.");
        }

        console.log(rows);
        res.writeHead(204, { 'Content-Type': 'text/plain' })
        res.end();
    }
    catch (e) {
        console.error(e.message);
        res.writeHead(errorCode, { 'Content-Type': 'text/plain' })
        res.end(e.message);
    }
})

router.delete('/vendas/*', async (req, res) => {
    let conn;
    let errorCode = 400;
    try {
        conn = await pool.getConnection();

        const id = req.url.substring(8);

        if (isNaN(id))
            throw new Error("Id incorreto.");

        const rows = await conn.query(`DELETE FROM vendas WHERE id = ${id}`);

        if (rows["affectedRows"] == 0) {
            errorCode = 404;
            throw new Error("Id não encontrado.");
        }

        console.log(rows);
        res.writeHead(204, { 'Content-Type': 'text/plain' })
        res.end();
    }
    catch (e) {
        console.error(e.message);
        res.writeHead(errorCode, { 'Content-Type': 'text/plain' })
        res.end(e.message);
    }
})

module.exports = router;