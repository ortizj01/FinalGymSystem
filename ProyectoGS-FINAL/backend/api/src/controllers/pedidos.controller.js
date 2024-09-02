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
    const { IdUsuario, FechaPedido, Total, EstadoPedido } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO Pedidos (IdUsuario, FechaPedido, Total, EstadoPedido) VALUES (?, ?, ?, ?)',
            [IdUsuario, FechaPedido, Total, EstadoPedido]
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
    const { IdUsuario, FechaPedido, Total, EstadoPedido } = req.body;

    try {
        // Convertir FechaPedido al formato correcto 'YYYY-MM-DD'
        const fechaConvertida = new Date(FechaPedido).toISOString().split('T')[0];

        const [result] = await pool.query(
            'UPDATE Pedidos SET IdUsuario = ?, FechaPedido = ?, Total = ?, EstadoPedido = ? WHERE IdPedido = ?',
            [IdUsuario, fechaConvertida, Total, EstadoPedido, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        res.json({ message: 'Pedido actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar pedido:', error);
        res.status(500).json({ message: 'Error al actualizar pedido', error: error.message });
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



// Obtener todos los pedidos por IdUsuario
export const getPedidosPorUsuarioCompleto = async (req, res) => {
    const { IdUsuario } = req.params;

    const query = `
        SELECT 
            p.IdPedido,
            p.FechaPedido,
            p.Total,
            u.Documento,
            p.EstadoPedido
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


// Anular un pedido y devolver stock
export const cancelarPedido = async (req, res) => {
    const { id } = req.params;

    try {
        // Cambiar el estado del pedido a "Anulado" (EstadoPedido = 3)
        const [updateResult] = await pool.query('UPDATE Pedidos SET EstadoPedido = 3 WHERE IdPedido = ?', [id]);

        if (updateResult.affectedRows === 0) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        // Obtener los productos asociados al pedido
        const [productos] = await pool.query('SELECT IdProducto, Cantidad FROM PedidosProducto WHERE IdPedido = ?', [id]);

        if (productos.length === 0) {
            return res.status(404).json({ message: 'No se encontraron productos asociados al pedido' });
        }

        // Devolver el stock de cada producto
        for (let producto of productos) {
            await pool.query('UPDATE Productos SET Stock = Stock + ? WHERE IdProducto = ?', [producto.Cantidad, producto.IdProducto]);
        }

        res.json({ message: 'Pedido anulado y stock devuelto' });
    } catch (error) {
        console.error('Error al anular el pedido:', error);
        res.status(500).json({ message: 'Error al anular el pedido' });
    }
};

// Función para registrar una venta cuando el estado del pedido cambia a PAGADO
const registrarVenta = async (pedidoId) => {
    try {
        const [pedido] = await pool.query('SELECT IdUsuario, Total FROM Pedidos WHERE IdPedido = ?', [pedidoId]);
        if (pedido.length === 0) {
            throw new Error(`Pedido con ID ${pedidoId} no encontrado`);
        }

        const { IdUsuario, Total } = pedido[0];

        const [productos] = await pool.query('SELECT IdProducto, Cantidad FROM PedidosProducto WHERE IdPedido = ?', [pedidoId]);
        const [membresias] = await pool.query('SELECT IdMembresia, COUNT(IdMembresia) AS Cantidad FROM PedidosMembresia WHERE IdPedido = ? GROUP BY IdMembresia', [pedidoId]);

        const [ventaResult] = await pool.query(
            'INSERT INTO Ventas (IdUsuario, Total, EstadoVenta) VALUES (?, ?, ?)',
            [IdUsuario, Total, 1] // EstadoVenta = 1 (Activo)
        );

        const idVenta = ventaResult.insertId;

        // Registrar los productos en la venta
        for (let producto of productos) {
            await pool.query(
                'INSERT INTO VentasProducto (IdVenta, IdProducto, CantidadProducto) VALUES (?, ?, ?)',
                [idVenta, producto.IdProducto, producto.Cantidad]
            );
        }

        // Registrar las membresías en la venta
        for (let membresia of membresias) {
            await pool.query(
                'INSERT INTO VentasMembresia (IdVenta, IdMembresia, Cantidad) VALUES (?, ?, ?)',
                [idVenta, membresia.IdMembresia, membresia.Cantidad]
            );
        }

        return idVenta;
    } catch (error) {
        console.error('Error al registrar la venta:', error);
        throw new Error('Error al registrar la venta');
    }
};

// Función para editar el estado del pedido y manejar el registro de la venta si se cambia a "PAGADO"
export const actualizarEstadoPedido = async (req, res) => {
    const { id } = req.params;
    const { EstadoPedido } = req.body;

    try {
        if (EstadoPedido == 2) {
            await registrarVenta(id);
        }

        const [result] = await pool.query(
            'UPDATE Pedidos SET EstadoPedido = ? WHERE IdPedido = ?',
            [EstadoPedido, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        res.json({ message: 'Estado del pedido actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar estado del pedido:', error);
        res.status(500).json({ message: 'Error al actualizar estado del pedido' });
    }
};
