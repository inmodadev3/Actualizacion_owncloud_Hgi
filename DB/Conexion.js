const sql = require('mssql')
require('dotenv').config()

const configuracionSQL = {
    user: process.env.BD_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    server:'192.168.1.127\\SQLEXPRESS',
    options:{
        encrypt : false
    },
    pool:{
        max: 30,
        min: 0,
        idleTimeoutMillis: 30000
    }
}

const pool = new sql.ConnectionPool(configuracionSQL)


module.exports = pool
