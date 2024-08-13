import { pool } from '../db.js';

export const getDevolucionVentas = async (req, res) => {
    const [rows] = await pool.query(`
        SELECT
            DV.*,
            v.FechaVenta,
            v.Total,
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
    `);
    res.json(rows);
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
        `);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener las devoluciones' });
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
            await connection.query(`
                INSERT INTO DevolucionesVentasProducto (IdDevolucionesVenta, IdProducto, CantidadProducto, PrecioProducto) 
                VALUES (?, ?, ?, ?)
            `, [devolucionId, producto.IdProducto, producto.CantidadProducto, producto.PrecioProducto]);
            await connection.query(`
                UPDATE Productos SET Stock = Stock + ? WHERE IdProducto = ?
            `, [producto.CantidadProducto, producto.IdProducto]);
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
        console.error(error);
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
