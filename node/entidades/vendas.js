const { Router } = require('express')
const router = Router();
const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: 'localhost',
    database: 'paraibana',
    user: 'root',
    password: 'admin',
    connectionLimit: 5
});

router.get('/vendas', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(`SELECT * FROM vendas`);
        console.log(rows);
        const jsonS = JSON.stringify(rows);
        res.writeHead(200, { 'Content-Type': 'text/json' })
        res.end(jsonS);
    }
    catch (e) { }
})

router.post('/vendas', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();

        console.log(req.body)

        if (isNaN(req.body["id_funcionario"]))
            throw "O id do funcionário precisa ser especificado."

        if (typeof req.body["nome_cliente"] !== 'string' || !req.body["nome_cliente"] instanceof String)
            throw "O nome precisa ser especificado."

        if (isNaN(req.body["valor"]))
            throw "O valor da venda precisa ser especificado."

        if (typeof req.body["id_produto"] !== 'object' || !req.body["id_produto"] instanceof Object)
            throw "Os ids dos produtos precisam ser especificados."

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
        res.writeHead(400, { 'Content-Type': 'text/plain' })
        res.end(e);
    }
})

router.put('/vendas/*', async (req, res) => {
    let conn;
    let errorCode = 400;
    try {
        conn = await pool.getConnection();

        const id = req.url.substring(8);

        if (isNaN(id))
            throw "Id incorreto."

        if (isNaN(req.body["id_funcionario"]))
            throw "O id do funcionário precisa ser especificado."

        if (typeof req.body["nome_cliente"] !== 'string' || !req.body["nome_cliente"] instanceof String)
            throw "O nome precisa ser especificado."

        if (isNaN(req.body["valor"]))
            throw "O valor da venda precisa ser especificado."

        const rows = await conn.query(`UPDATE vendas SET 
            id_funcionario = ${req.body["id_funcionario"]}, 
            nome_cliente = "${req.body["nome_cliente"]}", 
            cpf_cliente = "${req.body["cpf_cliente"]}", 
            valor = ${req.body["valor"]}, 
            WHERE id = ${id}`);

        if (rows["affectedRows"] == 0) {
            errorCode = 404;
            throw "Id não encontrado."
        }

        console.log(rows);
        res.writeHead(204, { 'Content-Type': 'text/plain' })
        res.end();
    }
    catch (e) {
        res.writeHead(errorCode, { 'Content-Type': 'text/plain' })
        res.end(e);
    }
})

router.delete('/vendas/*', async (req, res) => {
    let conn;
    let errorCode = 400;
    try {
        conn = await pool.getConnection();

        const id = req.url.substring(8);

        if (isNaN(id))
            throw "Id incorreto."

        const rows = await conn.query(`DELETE FROM vendas WHERE id = ${id}`);

        if (rows["affectedRows"] == 0) {
            errorCode = 404;
            throw "Id não encontrado."
        }

        console.log(rows);
        res.writeHead(204, { 'Content-Type': 'text/plain' })
        res.end();
    }
    catch (e) {
        res.writeHead(errorCode, { 'Content-Type': 'text/plain' })
        res.end(e);
    }
})

module.exports = router;