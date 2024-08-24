import { pool } from "../db.js";

// Obtener todos los pedidos
export const getPedidos = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Pedidos');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener pedidos:', error);
        res.status(500).json({ message: 'Error al obtener pedidos' });
    }
};

// Obtener un pedido por su ID
export const getPedidoById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('SELECT * FROM Pedidos WHERE IdPedido = ?', [id]);
        if (rows.length <= 0) return res.status(404).json({ message: 'Pedido no encontrado' });
        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener pedido:', error);
        res.status(500).json({ message: 'Error al obtener pedido' });
    }
};

// Crear un nuevo pedido
export const createPedido = async (req, res) => {
    const { IdUsuario, FechaPedido, PagoNeto, Iva, Total, EstadoPedido } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO Pedidos (IdUsuario, FechaPedido, PagoNeto, Iva, Total, EstadoPedido) VALUES (?, ?, ?, ?, ?, ?)',
            [IdUsuario, FechaPedido, PagoNeto, Iva, Total, EstadoPedido]
        );
        res.status(201).json({ id: result.insertId });
    } catch (error) {
        console.error('Error al crear pedido:', error);
        res.status(500).json({ message: 'Error al crear pedido' });
    }
};

// Actualizar un pedido existente
export const updatePedido = async (req, res) => {
    const { id } = req.params;
    const { IdUsuario, FechaPedido, PagoNeto, Iva, Total, EstadoPedido } = req.body;
    try {
        const [result] = await pool.query(
            'UPDATE Pedidos SET IdUsuario = ?, FechaPedido = ?, PagoNeto = ?, Iva = ?, Total = ?, EstadoPedido = ? WHERE IdPedido = ?',
            [IdUsuario, FechaPedido, PagoNeto, Iva, Total, EstadoPedido, id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Pedido no encontrado' });
        res.json({ message: 'Pedido actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar pedido:', error);
        res.status(500).json({ message: 'Error al actualizar pedido' });
    }
};

// Eliminar un pedido
export const deletePedido = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM Pedidos WHERE IdPedido = ?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Pedido no encontrado' });
        res.json({ message: 'Pedido eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar pedido:', error);
        res.status(500).json({ message: 'Error al eliminar pedido' });
    }
};

// Actualizar estado, fecha y total del pedido
export const updatePedidoEstadoFecha = async (req, res) => {
    const { id } = req.params;
    const { FechaPedido, EstadoPedido, Total } = req.body;

    try {
        const [result] = await pool.query(
            'UPDATE Pedidos SET FechaPedido = ?, EstadoPedido = ?, Total = ? WHERE IdPedido = ?',
            [FechaPedido, EstadoPedido, Total, id]
        );

        if (result.affectedRows === 0) return res.status(404).json({ message: 'Pedido no encontrado' });

        res.json({ message: 'Pedido actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar pedido:', error);
        res.status(500).json({ message: 'Error al actualizar pedido' });
    }
};


// Obtener todos los pedidos por IdUsuario
export const getPedidosPorUsuarioCompleto = async (req, res) => {
    const { IdUsuario } = req.params;

    const query = `
        SELECT 
            p.IdPedido,
            p.FechaPedido,
            p.Total,
            p.EstadoPedido,
            u.Documento
        FROM 
            Pedidos p
        JOIN 
            Usuarios u ON p.IdUsuario = u.IdUsuario
        WHERE 
            p.IdUsuario = ?
    `;

    try {
        const [rows] = await pool.query(query, [IdUsuario]);

        if (rows.length <= 0) {
            return res.status(404).json({ message: 'No se encontraron pedidos para este usuario' });
        }

        res.json(rows);
    } catch (error) {
        console.error('Error al obtener los pedidos:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
