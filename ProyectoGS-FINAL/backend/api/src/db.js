import { createPool } from 'mysql2/promise';
import dotenv from 'dotenv';

// Carga las variables de entorno del archivo .env
dotenv.config();

export const pool = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT), 
    database: process.env.DB_DATABASE
});