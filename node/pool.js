const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: 'localhost',
    database: 'paraibana',
    user: 'root',
    password: 'admin',
    connectionLimit: 5,
});

module.exports = pool;