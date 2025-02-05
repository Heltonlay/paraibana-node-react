const { Router } = require('express')
const router = Router();
const pool = require('../pool');

router.get('/produtos', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        let rows = await conn.query(`SELECT * FROM produtos`);
        const relacaoCategoriasRows = await conn.query(`SELECT * FROM produtos_categorias`);
        const categoriasRows = await conn.query(`SELECT * FROM categorias`);
        console.log(rows);

        rows = rows.map(produto => {
            const categorias = relacaoCategoriasRows
                .filter(categoria => { return categoria["id_produto"] == produto["id"]; })
                .map(categoria => { return categoriasRows.filter(obj => obj["id"] == categoria["id_categoria"])[0] });

            return { ...produto, categorias: categorias };
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

router.post('/produtos', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();

        console.log(req.body)

        if (typeof req.body["nome"] !== 'string' || !req.body["nome"] instanceof String)
            throw new Error("O nome precisa ser especificado.");

        if (isNaN(req.body["valor"]))
            throw new Error("O valor precisa ser especificado.");

        if (isNaN(req.body["estoque"]))
            throw new Error("O estoque precisa ser especificado.");

        if (typeof req.body["id_categoria"] !== 'object' || !req.body["id_categoria"] instanceof Object)
            throw new Error("O nome precisa ser especificado.");

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
        console.error(e.message);
        res.writeHead(400, { 'Content-Type': 'text/plain' })
        res.end(e.message);
    }
})

router.put('/produtos/*', async (req, res) => {
    let conn;
    let errorCode = 400;
    try {
        conn = await pool.getConnection();

        const id = req.url.substring(10);

        if (isNaN(id))
            throw new Error("Id incorreto.");

        if (typeof req.body["nome"] !== 'string' || !req.body["nome"] instanceof String)
            throw new Error("O nome precisa ser especificado.");

        if (isNaN(req.body["valor"]))
            throw new Error("O valor precisa ser especificado.");

        if (isNaN(req.body["estoque"]))
            throw new Error("O estoque precisa ser especificado.");

        const rows = await conn.query(`UPDATE produtos SET 
            nome = "${req.body["nome"]}", 
            valor = ${req.body["valor"]}, 
            estoque = ${req.body["estoque"]} 
            WHERE id = ${id}`);

        console.log(rows);

        if (rows["affectedRows"] == 0) {
            errorCode = 404;
            throw new Error("Id não encontrado.");
        }

        res.writeHead(204, { 'Content-Type': 'text/plain' })
        res.end();
    }
    catch (e) {
        console.error(e.message);
        res.writeHead(errorCode, { 'Content-Type': 'text/plain' })
        res.end(e.message);
    }
})

router.delete('/produtos/*', async (req, res) => {
    let conn;
    let errorCode = 400;
    try {
        conn = await pool.getConnection();

        const id = req.url.substring(10);

        if (isNaN(id))
            throw new Error("Id incorreto.");

        const rows = await conn.query(`DELETE FROM produtos WHERE id = ${id}`);

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