import { pool } from "../db.js";

// Obtener todos los pedidosMembresia
export const getPedidosMembresia = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM PedidosMembresia');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener pedidosMembresia:', error);
        res.status(500).json({ message: 'Error al obtener pedidosMembresia' });
    }
};

// Obtener un pedidoMembresia por su ID
export const getPedidoMembresiaById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('SELECT * FROM PedidosMembresia WHERE IdPedidoMembresia = ?', [id]);
        if (rows.length <= 0) return res.status(404).json({ message: 'PedidoMembresia no encontrado' });
        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener pedidoMembresia:', error);
        res.status(500).json({ message: 'Error al obtener pedidoMembresia' });
    }
};

// Crear un nuevo pedidoMembresia
export const createPedidoMembresia = async (req, res) => {
    const { IdPedido, IdMembresia, Total, IdUsuario } = req.body;
    try {
        const [membresiaRows] = await pool.query('SELECT Frecuencia FROM Membresias WHERE IdMembresia = ?', [IdMembresia]);
        if (membresiaRows.length <= 0) return res.status(404).json({ message: 'Membresía no encontrada' });

        const frecuencia = membresiaRows[0].Frecuencia;
        const fechaInicio = new Date();
        const fechaFin = new Date(fechaInicio);
        fechaFin.setDate(fechaFin.getDate() + frecuencia);

        const [result] = await pool.query(
            'INSERT INTO PedidosMembresia (IdPedido, IdMembresia, FechaInicio, FechaFin, Total, IdUsuario) VALUES (?, ?, ?, ?, ?, ?)',
            [IdPedido, IdMembresia, fechaInicio, fechaFin, Total, IdUsuario]
        );
        res.status(201).json({ id: result.insertId });
    } catch (error) {
        console.error('Error al crear pedidoMembresia:', error);
        res.status(500).json({ message: 'Error al crear pedidoMembresia' });
    }
};

// Actualizar un pedidoMembresia existente
export const updatePedidoMembresia = async (req, res) => {
    const { id } = req.params;
    const { IdPedido, IdMembresia, Total, IdUsuario } = req.body;
    try {
        const [membresiaRows] = await pool.query('SELECT Frecuencia FROM Membresias WHERE IdMembresia = ?', [IdMembresia]);
        if (membresiaRows.length <= 0) return res.status(404).json({ message: 'Membresía no encontrada' });

        const frecuencia = membresiaRows[0].Frecuencia;
        const fechaInicio = new Date();
        const fechaFin = new Date(fechaInicio);
        fechaFin.setDate(fechaFin.getDate() + frecuencia);

        const [result] = await pool.query(
            'UPDATE PedidosMembresia SET IdPedido = ?, IdMembresia = ?, FechaInicio = ?, FechaFin = ?, Total = ?, IdUsuario = ? WHERE IdPedidoMembresia = ?',
            [IdPedido, IdMembresia, fechaInicio, fechaFin, Total, IdUsuario, id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ message: 'PedidoMembresia no encontrado' });
        res.json({ message: 'PedidoMembresia actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar pedidoMembresia:', error);
        res.status(500).json({ message: 'Error al actualizar pedidoMembresia' });
    }
};

// Eliminar un pedidoMembresia
export const deletePedidoMembresia = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM PedidosMembresia WHERE IdPedidoMembresia = ?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'PedidoMembresia no encontrado' });
        res.json({ message: 'PedidoMembresia eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar pedidoMembresia:', error);
        res.status(500).json({ message: 'Error al eliminar pedidoMembresia' });
    }
};