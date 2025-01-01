import pkg from 'pg';
const { Pool } = pkg;

export const securityPoolDB = new Pool({
    user : 'postgres',
    database : 'localSecurity',
    password : 'root',
    host : 'localhost',
    port : 5432,
})