import mysql from 'mysql2/promise';

const db = await mysql.createConnection({
    host: 'mysql',
    user: 'root',
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: 'music',
})
export default db;
