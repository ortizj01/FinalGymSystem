import { pool } from '../db.js';

export const getDevolucionVentasProducto = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT
                DVP.DevolucionesVentasProducto,
                P.NombreProducto,
                DVP.CantidadProducto,
                DVP.PrecioProducto,
                P.PrecioProducto * DVP.CantidadProducto AS Valortotal
            FROM 
                DevolucionesVentasProducto AS DVP
            LEFT JOIN 
                Productos AS P ON DVP.IdProducto = P.IdProducto
            WHERE 
                DVP.IdDevolucionVenta = ?
        `, [req.params.id]);

        if (rows.length === 0) return res.status(404).json({ message: 'Devolución de Producto de Venta no encontrada' });

        res.json(rows);
    } catch (error) {
        console.error('Error al obtener los productos de la devolución:', error);
        res.status(500).json({ message: 'Error al obtener los productos de la devolución' });
    }
};

export const postDevolucionVentasProducto = async (req, res) => {
    const { IdDevolucionVenta, IdProducto, CantidadProducto, PrecioProducto, IdVenta } = req.body;
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [productData] = await connection.query('SELECT Stock FROM Productos WHERE IdProducto = ?', [IdProducto]);
        if (productData.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        
        const [result] = await connection.query(`
            INSERT INTO DevolucionesVentasProducto (IdDevolucionVenta, IdProducto, CantidadProducto, PrecioProducto) 
            VALUES (?, ?, ?, ?)
        `, [IdDevolucionVenta, IdProducto, CantidadProducto, PrecioProducto]);

        await connection.query(`
            UPDATE Productos SET Stock = Stock + ? WHERE IdProducto = ?
        `, [CantidadProducto, IdProducto]);

        await connection.query(`
            UPDATE VentasProducto SET CantidadProducto = CantidadProducto - ? WHERE IdProducto = ? AND IdVenta = ?
        `, [CantidadProducto, IdProducto, IdVenta]);

        await connection.commit();

        res.send({
            id: result.insertId,
            IdDevolucionVenta, 
            IdProducto,
            CantidadProducto,
            PrecioProducto
        });
    } catch (error) {
        await connection.rollback();
        console.error('Error al añadir producto a la devolución:', error);
        res.status(500).json({ message: 'Error al añadir producto a la devolución' });
    } finally {
        connection.release();
    }
};

export const deleteDevolucionVentasProducto = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM DevolucionesVentasProducto WHERE IdDevolucionesVentaProducto = ?', [req.params.id]);

        if (result.affectedRows === 0) return res.status(404).json({ message: 'Devolución de Producto de Venta no encontrada' });

        res.json({ message: 'Devolución de Producto de Venta eliminada' });
    } catch (error) {
        console.error('Error al eliminar el producto de la devolución:', error);
        res.status(500).json({ message: 'Error al eliminar el producto de la devolución' });
    }
};

export const putDevolucionVentasProducto = async (req, res) => {
    const { id } = req.params;
    const { IdDevolucionVenta, IdProducto, CantidadProducto, PrecioProducto } = req.body;

    try {
        const [result] = await pool.query(`
            UPDATE DevolucionesVentasProducto 
            SET IdDevolucionVenta = IFNULL(?, IdDevolucionVenta), IdProducto = IFNULL(?, IdProducto), CantidadProducto = IFNULL(?, CantidadProducto), PrecioProducto = IFNULL(?, PrecioProducto) 
            WHERE IdDevolucionesVentaProducto = ?
        `, [IdDevolucionVenta, IdProducto, CantidadProducto, PrecioProducto, id]);

        if (result.affectedRows === 0) return res.status(404).json({ message: 'Devolución de Producto de Venta no encontrada' });

        const [rows] = await pool.query('SELECT * FROM DevolucionesVentasProducto WHERE IdDevolucionesVentaProducto = ?', [id]);
        res.json(rows[0]);
    } catch (error) {
        console.error('Error al actualizar el producto de la devolución:', error);
        res.status(500).json({ message: 'Error al actualizar el producto de la devolución' });
    }
};
