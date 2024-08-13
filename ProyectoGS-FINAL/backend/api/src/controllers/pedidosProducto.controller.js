import { pool } from "../db.js";

// Obtener todos los pedidosProducto
export const getPedidosProducto = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM PedidosProducto');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener pedidosProducto:', error);
        res.status(500).json({ message: 'Error al obtener pedidosProducto' });
    }
};

// Obtener un pedidoProducto por su ID
export const getPedidoProductoById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('SELECT * FROM PedidosProducto WHERE IdPedidoProducto = ?', [id]);
        if (rows.length <= 0) return res.status(404).json({ message: 'PedidoProducto no encontrado' });
        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener pedidoProducto:', error);
        res.status(500).json({ message: 'Error al obtener pedidoProducto' });
    }
};

// Crear un nuevo pedidoProducto
export const createPedidoProducto = async (req, res) => {
    const { IdPedido, IdProducto, Cantidad, Total } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO PedidosProducto (IdPedido, IdProducto, Cantidad, Total) VALUES (?, ?, ?, ?)',
            [IdPedido, IdProducto, Cantidad, Total]
        );
        res.status(201).json({ id: result.insertId });
    } catch (error) {
        console.error('Error al crear pedidoProducto:', error);
        res.status(500).json({ message: 'Error al crear pedidoProducto' });
    }
};

// Actualizar un pedidoProducto existente
export const updatePedidoProducto = async (req, res) => {
    const { id } = req.params;
    const { IdPedido, IdProducto, Cantidad, Total } = req.body;
    try {
        const [result] = await pool.query(
            'UPDATE PedidosProducto SET IdPedido = ?, IdProducto = ?, Cantidad = ?, Total = ? WHERE IdPedidoProducto = ?',
            [IdPedido, IdProducto, Cantidad, Total, id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ message: 'PedidoProducto no encontrado' });
        res.json({ message: 'PedidoProducto actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar pedidoProducto:', error);
        res.status(500).json({ message: 'Error al actualizar pedidoProducto' });
    }
};

// Eliminar un pedidoProducto
export const deletePedidoProducto = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM PedidosProducto WHERE IdPedidoProducto = ?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'PedidoProducto no encontrado' });
        res.json({ message: 'PedidoProducto eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar pedidoProducto:', error);
        res.status(500).json({ message: 'Error al eliminar pedidoProducto' });
    }
};

// Obtener productos por IdPedido
export const getProductosByPedidoId = async (req, res) => {
    try {
        const { IdPedido } = req.params;
        const query = `
            SELECT pp.*, p.NombreProducto, p.PrecioProducto AS PrecioUnitario, p.IvaProducto AS Iva 
            FROM PedidosProducto pp 
            JOIN Productos p ON pp.IdProducto = p.IdProducto 
            WHERE pp.IdPedido = ?
        `;
        const [rows] = await pool.query(query, [IdPedido]);
        rows.forEach(row => {
            row.SubTotal = (row.PrecioUnitario * row.Cantidad * (1 + row.Iva / 100)).toFixed(2);
        });
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener los productos del pedido:', error);
        res.status(500).json({ message: 'Error al obtener los productos del pedido' });
    }
};
