const { Router } = require('express')
const router = Router();
const pool = require('../pool');

router.get('/funcionarios', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(`SELECT * FROM funcionarios`);
        console.log(rows);
        const jsonS = JSON.stringify(rows);
        conn.end();
        res.writeHead(200, { 'Content-Type': 'text/json' })
        res.end(jsonS);
    }
    catch (e) {
        console.error(e.message);
        res.writeHead(500, { 'Content-Type': 'text/plain' })
        res.end(e.message);
    }
})

router.post('/funcionarios', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();

        console.log(req.body)

        if (typeof req.body["nome"] !== 'string' || !req.body["nome"] instanceof String)
            throw new Error("O nome precisa ser especificado.");

        if (isNaN(req.body["salario"]))
            throw new Error("Salário incorreto.");

        const comando = `INSERT INTO funcionarios VALUES(null,
            "${req.body["nome"]}", 
            ${req.body["salario"]}, 
            "${req.body["data_admissao"]}", 
            "${req.body["telefone"]}")`

        const rows = await conn.query(comando);

        console.log(rows);
        conn.end();
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.end(String(rows["insertId"]).replace('n', ''));
    }
    catch (e) {
        console.error(e.message);
        res.writeHead(400, { 'Content-Type': 'text/plain' })
        res.end(e.message);
    }
})

router.put('/funcionarios/*', async (req, res) => {
    let conn;
    let errorCode = 400;
    try {
        conn = await pool.getConnection();

        const id = req.url.substring(14);

        if (isNaN(id))
            throw new Error("Id incorreto.");

        if (typeof req.body["nome"] !== 'string' || !req.body["nome"] instanceof String)
            throw new Error("O nome precisa ser especificado.");

        if (isNaN(req.body["salario"]))
            throw new Error("Salário incorreto.");

        const rows = await conn.query(`UPDATE funcionarios SET 
            nome = "${req.body["nome"]}", 
            salario = ${req.body["salario"]}, 
            data_admissao = "${req.body["data_admissao"]}", 
            telefone = "${req.body["telefone"]}"
            WHERE id = ${id}`);

        if (rows["affectedRows"] == 0) {
            errorCode = 404;
            throw new Error("Id não encontrado.");
        }

        console.log(rows);
        conn.end();
        res.writeHead(204, { 'Content-Type': 'text/plain' })
        res.end();
    }
    catch (e) {
        console.error(e.message);
        res.writeHead(errorCode, { 'Content-Type': 'text/plain' })
        res.end(e.message);
    }
})

router.delete('/funcionarios/*', async (req, res) => {
    let conn;
    let errorCode = 400;
    try {
        conn = await pool.getConnection();

        const id = req.url.substring(14);

        if (isNaN(id))
            throw new Error("Id incorreto.");

        const rows = await conn.query(`DELETE FROM funcionarios WHERE id = ${id}`);

        if (rows["affectedRows"] == 0) {
            errorCode = 404;
            throw new Error("Id não encontrado.");
        }

        console.log(rows);
        conn.end();
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