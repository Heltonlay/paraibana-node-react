const { Router } = require('express')
const router = Router();
const pool = require('../pool');

router.get('/categorias', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(`SELECT * FROM categorias`);
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

router.post('/categorias', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();

        if (typeof req.body["nome"] !== 'string' || !req.body["nome"] instanceof String)
            throw new Error("O nome precisa ser especificado.");

        console.log(req.body)

        const rows = await conn.query(`INSERT INTO categorias VALUES(null, "${req.body["nome"]}")`);

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

router.put('/categorias/*', async (req, res) => {
    let conn;
    let errorCode = 400;
    try {
        conn = await pool.getConnection();

        const id = req.url.substring(12);

        if (isNaN(id))
            throw new Error("Id incorreto.");

        if (typeof req.body["nome"] !== 'string' || !req.body["nome"] instanceof String)
            throw new Error("O nome precisa ser especificado.");

        const rows = await conn.query(`UPDATE categorias SET nome = "${req.body["nome"]}" WHERE id = ${id}`);

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
        res.writeHead(400, { 'Content-Type': 'text/plain' })
        res.end(e.message);
    }
})

router.delete('/categorias/*', async (req, res) => {
    let conn;
    let errorCode = 400;
    try {
        conn = await pool.getConnection();

        const id = req.url.substring(12);

        if (isNaN(id))
            throw new Error("Id incorreto.");

        const rows = await conn.query(`DELETE FROM categorias WHERE id = ${id}`);

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