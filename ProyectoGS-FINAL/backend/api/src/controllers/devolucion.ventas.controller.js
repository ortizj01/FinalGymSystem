import { pool } from '../db.js';

export const getDevolucionVentas = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT
                DV.*,
                v.FechaVenta,
                v.Total,
                CONCAT(u.Nombres, ' ', u.Apellidos) AS NombreCliente,  -- Incluir el nombre completo del cliente
                DATE_FORMAT(DV.FechaDevolucion, '%Y-%m-%d') AS FechaDevolucionFormatted,
                CASE 
                    WHEN DV.EstadoDevolucion = 1 THEN 'Activo'
                    WHEN DV.EstadoDevolucion = 0 THEN 'Inactivo'
                    ELSE 'estado no definido'
                END AS estado_descripcion
            FROM 
                DevolucionVenta DV
            LEFT JOIN 
                Ventas v ON DV.IdVenta = v.IdVenta
            LEFT JOIN 
                Usuarios u ON v.IdUsuario = u.IdUsuario  -- Unir con la tabla Usuarios para obtener los datos del cliente
        `);
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener las devoluciones:', error);
        res.status(500).json({ message: 'Error al obtener las devoluciones' });
    }
};

export const getDevolucionVenta = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT
                DV.*,
                v.FechaVenta,
                v.Total,
                u.Nombres AS NombreCliente,
                u.Apellidos AS ApellidosCliente,
                u.Documento AS DocumentoCliente,
                DATE_FORMAT(DV.FechaDevolucion, '%Y-%m-%d') AS FechaDevolucionFormatted,
                CASE 
                    WHEN DV.EstadoDevolucion = 1 THEN 'Activo'
                    WHEN DV.EstadoDevolucion = 0 THEN 'Inactivo'
                    ELSE 'estado no definido'
                END AS estado_descripcion
            FROM 
                DevolucionVenta DV
            LEFT JOIN 
                Ventas v ON DV.IdVenta = v.IdVenta
            LEFT JOIN 
                Usuarios u ON v.IdUsuario = u.IdUsuario
            WHERE 
                DV.IdDevolucionVenta = ?
        `, [req.params.id]);

        if (rows.length === 0) return res.status(404).json({ message: 'Devolución no encontrada' });

        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener la devolución:', error);
        res.status(500).json({ message: 'Error al obtener la devolución' });
    }
};

export const postDevolucionVentas = async (req, res) => {
    const { Motivo, ValorDevolucionVenta, EstadoDevolucion, IdVenta, FechaDevolucion, productos } = req.body;
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [result] = await connection.query(`
            INSERT INTO DevolucionVenta (Motivo, ValorDevolucionVenta, EstadoDevolucion, IdVenta, FechaDevolucion) 
            VALUES (?, ?, ?, ?, ?)
        `, [Motivo, ValorDevolucionVenta, EstadoDevolucion, IdVenta, FechaDevolucion]);

        const devolucionId = result.insertId;

        for (const producto of productos) {
            const [ventaProducto] = await connection.query(`
                SELECT CantidadProducto FROM VentasProducto WHERE IdProducto = ? AND IdVenta = ?
            `, [producto.IdProducto, IdVenta]);

            if (ventaProducto.length === 0 || ventaProducto[0].CantidadProducto < producto.CantidadProducto) {
                throw new Error('La cantidad a devolver excede la cantidad en la venta original');
            }

            await connection.query(`
                INSERT INTO DevolucionesVentasProducto (IdDevolucionesVenta, IdProducto, CantidadProducto, PrecioProducto) 
                VALUES (?, ?, ?, ?)
            `, [devolucionId, producto.IdProducto, producto.CantidadProducto, producto.PrecioProducto]);

            await connection.query(`
                UPDATE Productos SET Stock = Stock + ? WHERE IdProducto = ?
            `, [producto.CantidadProducto, producto.IdProducto]);

            await connection.query(`
                UPDATE VentasProducto SET CantidadProducto = CantidadProducto - ? WHERE IdProducto = ? AND IdVenta = ?
            `, [producto.CantidadProducto, producto.IdProducto, IdVenta]);

            // Elimina el producto de la tabla VentasProducto si la cantidad llega a cero
            await connection.query(`
                DELETE FROM VentasProducto WHERE IdProducto = ? AND IdVenta = ? AND CantidadProducto <= 0
            `, [producto.IdProducto, IdVenta]);
        }

        // Recalcular el total de la venta después de la devolución
        const [ventaActualizada] = await connection.query(`
            SELECT SUM(vp.CantidadProducto * p.PrecioProducto) AS nuevoTotal
            FROM VentasProducto vp
            JOIN Productos p ON vp.IdProducto = p.IdProducto
            WHERE vp.IdVenta = ?
        `, [IdVenta]);

        const nuevoTotal = ventaActualizada[0].nuevoTotal || 0;

        // Actualizar el total de la venta
        await connection.query(`
            UPDATE Ventas SET Total = ? WHERE IdVenta = ?
        `, [nuevoTotal, IdVenta]);

        // Verificar si la venta queda sin productos ni membresías
        const [productosRestantes] = await connection.query(`
            SELECT COUNT(*) AS totalProductos FROM VentasProducto WHERE IdVenta = ?
        `, [IdVenta]);

        const [membresiasRestantes] = await connection.query(`
            SELECT COUNT(*) AS totalMembresias FROM VentasMembresia WHERE IdVenta = ?
        `, [IdVenta]);

        if (productosRestantes[0].totalProductos === 0 && membresiasRestantes[0].totalMembresias === 0) {
            // Si no quedan productos ni membresías, actualizar el estado de la venta
            await connection.query(`
                UPDATE Ventas SET EstadoVenta = 5 WHERE IdVenta = ?
            `, [IdVenta]); // Estado 3 puede representar "Devolución completa" o similar
        }

        await connection.commit();
        res.send({
            id: devolucionId,
            Motivo,
            ValorDevolucionVenta,
            EstadoDevolucion,
            IdVenta,
            FechaDevolucion,
        });
    } catch (error) {
        await connection.rollback();
        console.error('Error en la transacción de devolución:', error);
        res.status(500).json({ message: 'Error al realizar la devolución' });
    } finally {
        connection.release();
    }
};


export const deleteDevolucionVentas = async (req, res) => {
    const [result] = await pool.query('DELETE FROM DevolucionVenta WHERE IdDevolucionVenta = ?', [req.params.id]);
    if (result.affectedRows <= 0) return res.status(404).json({
        message: 'Devolución de Venta no encontrada'
    });
    res.send('Devolución de Venta eliminada');
};

export const putDevolucionVentas = async (req, res) => {
    const { id } = req.params;
    const { Motivo, ValorDevolucionVenta, EstadoDevolucion, IdVenta } = req.body;
    const [result] = await pool.query(`
        UPDATE DevolucionVenta 
        SET Motivo = IFNULL(?, Motivo), ValorDevolucionVenta = IFNULL(?, ValorDevolucionVenta), EstadoDevolucion = IFNULL(?, EstadoDevolucion), IdVenta = IFNULL(?, IdVenta) 
        WHERE IdDevolucionVenta = ?
    `, [Motivo, ValorDevolucionVenta, EstadoDevolucion, IdVenta, id]);

    if (result.affectedRows === 0) return res.status(404).json({
        message: 'Devolución de Venta no encontrada'
    });

    const [rows] = await pool.query('SELECT * FROM DevolucionVenta WHERE IdDevolucionVenta = ?', [id]);
    res.json(rows[0]);
};
