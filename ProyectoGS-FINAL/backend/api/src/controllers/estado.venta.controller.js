import { pool } from '../db.js';

// Obtener todos los estados de ventas
export const getEstadosVentas = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM EstadosVentas');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener los estados de ventas:', error);
        res.status(500).json({ error: 'Error al obtener los estados de ventas' });
    }
};
