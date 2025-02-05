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

router.get('/categorias', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(`SELECT * FROM categorias`);
        console.log(rows);
        const jsonS = JSON.stringify(rows);
        res.writeHead(200, { 'Content-Type': 'text/json' })
        res.end(jsonS);
    }
    catch (e) { }
})

router.post('/categorias', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();

        if (typeof req.body["nome"] !== 'string' || !req.body["nome"] instanceof String)
            throw "O nome precisa ser especificado."

        console.log(req.body)

        const rows = await conn.query(`INSERT INTO categorias VALUES(null, "${req.body["nome"]}")`);

        console.log(rows);
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.end(String(rows["insertId"]).replace('n', ''));
    }
    catch (e) {
        res.writeHead(400, { 'Content-Type': 'text/plain' })
        res.end(e);
    }
})

router.put('/categorias/*', async (req, res) => {
    let conn;
    let errorCode = 400;
    try {
        conn = await pool.getConnection();

        const id = req.url.substring(12);

        if (isNaN(id))
            throw "Id incorreto."

        if (typeof req.body["nome"] !== 'string' || !req.body["nome"] instanceof String)
            throw "O nome precisa ser especificado."

        const rows = await conn.query(`UPDATE categorias SET nome = "${req.body["nome"]}" WHERE id = ${id}`);

        if (rows["affectedRows"] == 0) {
            errorCode = 404;
            throw "Id não encontrado."
        }

        console.log(rows);
        res.writeHead(204, { 'Content-Type': 'text/plain' })
        res.end();
    }
    catch (e) {
        res.writeHead(400, { 'Content-Type': 'text/plain' })
        res.end(e);
    }
})

router.delete('/categorias/*', async (req, res) => {
    let conn;
    let errorCode = 400;
    try {
        conn = await pool.getConnection();

        const id = req.url.substring(12);

        if (isNaN(id))
            throw "Id incorreto."

        const rows = await conn.query(`DELETE FROM categorias WHERE id = ${id}`);

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