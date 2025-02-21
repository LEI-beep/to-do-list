import pkg from 'pg';
const { Client } = pkg;

export const db = new Client ({
    host: "localhost",
    database: "to_do_list",
    user: "postgres",
    password: "12345",
    port: "5432",
});

db.connect()
    .then(() => console.log('Connected to PostgeSQl'))
    .catch(err => console.log('Connection Error', err.stack));