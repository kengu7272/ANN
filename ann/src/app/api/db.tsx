import mysql from 'mysql2';

const db = mysql.createConnection({
    host: 'mysql',
    user: 'root',
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: 'music',
}).promise();

db.connect()
    .then(() => {
        console.log('Database connected');
    })
    .catch((err) => {
        console.error('Database connection error: ', err);
    });

process.on('beforeExit', () => {
    db.end()
        .then(() => {
            console.log('Database connection closed.');
        })
        .catch((err) => {
            console.error('Error closing the database connection:', err);
        });
});

export default db;
