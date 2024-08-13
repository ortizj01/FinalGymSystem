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
export const getPedidosByUsuarioId = async (req, res) => {
    try {
        const { IdUsuario } = req.query;
        const [rows] = await pool.query('SELECT * FROM Pedidos WHERE IdUsuario = ?', [IdUsuario]);
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener pedidos:', error);
        res.status(500).json({ message: 'Error al obtener pedidos' });
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

// En tu archivo de controladores
export const getPedidosPorCliente = async (req, res) => {
    const { clienteId } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM Pedidos WHERE IdUsuario = ?', [clienteId]);
        res.json(rows);
    } catch (error) {
        return res.status(500).json({
            message: 'something goes wrong'
        });
    }
};

export const getVentasPorCliente = async (req, res) => {
    const { clienteId } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM Ventas WHERE IdUsuario = ?', [clienteId]);
        res.json(rows);
    } catch (error) {
        return res.status(500).json({
            message: 'something goes wrong'
        });
    }
};
