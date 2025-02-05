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

router.get('/funcionarios', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(`SELECT * FROM funcionarios`);
        console.log(rows);
        const jsonS = JSON.stringify(rows);
        res.writeHead(200, { 'Content-Type': 'text/json' })
        res.end(jsonS);
    }
    catch (e) { }
})

router.post('/funcionarios', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();

        console.log(req.body)

        if (typeof req.body["nome"] !== 'string' || !req.body["nome"] instanceof String)
            throw "O nome precisa ser especificado."

        if (isNaN(salario))
            throw "Salário incorreto."

        const rows = await conn.query(`INSERT INTO funcionarios VALUES(null,
            "${req.body["nome"]}", 
            ${req.body["salario"]}, 
            "${req.body["data_admissao"]}", 
            "${req.body["telefone"]}")`);

        console.log(rows);
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.end(String(rows["insertId"]).replace('n', ''));
    }
    catch (e) {
        res.writeHead(400, { 'Content-Type': 'text/plain' })
        res.end(e);
    }
})

router.put('/funcionarios/*', async (req, res) => {
    let conn;
    let errorCode = 400;
    try {
        conn = await pool.getConnection();

        const id = req.url.substring(14);

        if (isNaN(id))
            throw "Id incorreto."

        if (typeof req.body["nome"] !== 'string' || !req.body["nome"] instanceof String)
            throw "O nome precisa ser especificado."

        if (isNaN(salario))
            throw "Salário incorreto."

        const rows = await conn.query(`UPDATE funcionarios SET 
            nome = "${req.body["nome"]}", 
            salario = ${req.body["salario"]}, 
            data_admissao = "${req.body["data_admissao"]}", 
            telefone = "${req.body["telefone"]}"
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

router.delete('/funcionarios/*', async (req, res) => {
    let conn;
    let errorCode = 400;
    try {
        conn = await pool.getConnection();

        const id = req.url.substring(14);

        if (isNaN(id))
            throw "Id incorreto."

        const rows = await conn.query(`DELETE FROM funcionarios WHERE id = ${id}`);

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