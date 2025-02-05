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

router.get('/produtos', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(`SELECT * FROM produtos`);
        console.log(rows);
        const jsonS = JSON.stringify(rows);
        res.writeHead(200, { 'Content-Type': 'text/json' })
        res.end(jsonS);
    }
    catch (e) { }
})

router.post('/produtos', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();

        console.log(req.body)

        if (typeof req.body["nome"] !== 'string' || !req.body["nome"] instanceof String)
            throw "O nome precisa ser especificado."

        if (isNaN(req.body["valor"]))
            throw "O valor precisa ser especificado."

        if (isNaN(req.body["estoque"]))
            throw "O estoque precisa ser especificado."

        if (typeof req.body["id_categoria"] !== 'object' || !req.body["id_categoria"] instanceof Object)
            throw "O nome precisa ser especificado."

        const rows = await conn.query(`INSERT INTO produtos VALUES(null,
            "${req.body["nome"]}", 
            ${req.body["valor"]}, 
            ${req.body["estoque"]})`);

        console.log(rows);
        const id = String(rows["insertId"]).replace('n', '');

        let sqlCommand = '';
        for (let i = 0; i < req.body["id_categoria"].length; i++) {
            let lastChar = i + 1 < req.body["id_categoria"].length ? ', ' : ';';

            sqlCommand += `(null, ${id}, ${req.body["id_categoria"][i]})${lastChar}`;
        }

        const categoriasRows = await conn.query(`INSERT INTO produtos_categorias VALUES ${sqlCommand}`);

        console.log(categoriasRows);

        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.end(id);
    }
    catch (e) {
        res.writeHead(400, { 'Content-Type': 'text/plain' })
        res.end(e);
    }
})

router.put('/produtos/*', async (req, res) => {
    let conn;
    let errorCode = 400;
    try {
        conn = await pool.getConnection();

        const id = req.url.substring(10);

        if (isNaN(id))
            throw "Id incorreto."

        if (typeof req.body["nome"] !== 'string' || !req.body["nome"] instanceof String)
            throw "O nome precisa ser especificado."

        if (isNaN(req.body["valor"]))
            throw "O valor precisa ser especificado."

        if (isNaN(req.body["estoque"]))
            throw "O estoque precisa ser especificado."

        const rows = await conn.query(`UPDATE produtos SET 
            nome = "${req.body["nome"]}", 
            valor = ${req.body["valor"]}, 
            estoque = ${req.body["estoque"]} 
            WHERE id = ${id}`);

        console.log(rows);

        if (rows["affectedRows"] == 0) {
            errorCode = 404;
            throw "Id não encontrado."
        }

        res.writeHead(204, { 'Content-Type': 'text/plain' })
        res.end();
    }
    catch (e) {
        res.writeHead(errorCode, { 'Content-Type': 'text/plain' })
        res.end(e);
    }
})

router.delete('/produtos/*', async (req, res) => {
    let conn;
    let errorCode = 400;
    try {
        conn = await pool.getConnection();

        const id = req.url.substring(10);

        if (isNaN(id))
            throw "Id incorreto."

        const rows = await conn.query(`DELETE FROM produtos WHERE id = ${id}`);

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