import mysql from 'mysql2';

const db = mysql.createConnection({
    host: 'mysql',
    user: 'root',
    password: 'password',
    database: 'music',
}).promise();

db.connect()
    .then(() => {
        console.log('Database connected');
    })
    .catch((err) => {
        console.error('Database connection error: ', err);
    });

export default db;
