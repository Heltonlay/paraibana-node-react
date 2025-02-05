const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: 'localhost',
    database: 'paraibana',
    user: 'root',
    password: 'admin'
});

module.exports = pool;