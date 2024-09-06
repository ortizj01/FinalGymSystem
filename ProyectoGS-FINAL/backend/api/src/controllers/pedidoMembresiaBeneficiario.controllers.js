import { pool } from '../db.js';

// Crear un nuevo registro en PedidoMembresiaBeneficiario
export const createPedidoMembresiaBeneficiario = async (req, res) => {
    const { IdPedido, IdMembresia, IdUsuario } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO PedidoMembresiaBeneficiario (IdPedido, IdMembresia, IdUsuario) VALUES (?, ?, ?)',
            [IdPedido, IdMembresia, IdUsuario]
        );
        res.status(201).json({ id: result.insertId });
    } catch (error) {
        console.error('Error al crear PedidoMembresiaBeneficiario:', error);
        res.status(500).json({ message: 'Error al crear PedidoMembresiaBeneficiario' });
    }
};
