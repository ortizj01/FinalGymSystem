import { pool } from '../db.js';

// Obtener todos los estados de pedidos
export const getEstadosPedidos = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM EstadosPedidos');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener los estados de pedidos:', error);
        res.status(500).json({ error: 'Error al obtener los estados de pedidos' });
    }
};
