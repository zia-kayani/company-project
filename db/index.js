const { Pool } = require("pg")
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'mini-project',
    password: 'zia123',
    port: 5432,
});

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

module.exports = pool;