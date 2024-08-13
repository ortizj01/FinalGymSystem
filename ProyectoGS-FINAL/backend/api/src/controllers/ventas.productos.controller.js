import { pool } from '../db.js';

// Obtener todos los productos de una venta
export const getVentasProducto = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT
                vp.IdVentaProducto,
                vp.IdVenta,
                vp.IdProducto,
                p.NombreProducto,
                vp.CantidadProducto,
                p.PrecioProducto,
                vp.CantidadProducto * p.PrecioProducto AS TotalProducto
            FROM VentasProducto vp
            JOIN Productos p ON vp.IdProducto = p.IdProducto
            WHERE vp.IdVenta = ?
        `, [req.params.id]);
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener los productos de la venta:', error);
        res.status(500).json({ message: 'Error al obtener los productos de la venta' });
    }
};

// Obtener un producto de venta por ID
export const getVentaProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('SELECT * FROM VentasProducto WHERE IdVentaProducto = ?', [id]);

        if (rows.length <= 0) return res.status(404).json({ message: 'Producto de venta no encontrado' });

        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener el producto de venta:', error);
        res.status(500).json({ error: 'Error al obtener el producto de venta' });
    }
};

// Añadir un nuevo producto a una venta
export const postVentasProducto = async (req, res) => {
    const { IdVenta, IdProducto, CantidadProducto } = req.body;

    try {
        const [rows] = await pool.query(`
            INSERT INTO VentasProducto (IdVenta, IdProducto, CantidadProducto)
            VALUES (?, ?, ?)
        `, [IdVenta, IdProducto, CantidadProducto]);

        // Disminuir el stock del producto
        await pool.query('UPDATE Productos SET Stock = Stock - ? WHERE IdProducto = ?', [CantidadProducto, IdProducto]);

        res.send({
            id: rows.insertId,
            IdVenta,
            IdProducto,
            CantidadProducto
        });
    } catch (error) {
        console.error('Error al añadir producto a la venta:', error);
        res.status(500).json({ message: 'Error al añadir producto a la venta' });
    }
};

// Eliminar un producto de una venta
export const deleteVentasProducto = async (req, res) => {
    try {
        // Obtener la cantidad y el producto antes de eliminar para ajustar el stock
        const [productoActual] = await pool.query('SELECT IdProducto, CantidadProducto FROM VentasProducto WHERE IdVentaProducto = ?', [req.params.id]);

        if (productoActual.length === 0) {
            return res.status(404).json({ message: 'Producto de la venta no encontrado' });
        }

        const [result] = await pool.query('DELETE FROM VentasProducto WHERE IdVentaProducto = ?', [req.params.id]);
        if (result.affectedRows <= 0) return res.status(404).json({
            message: 'Producto de la venta no encontrado'
        });

        // Devolver el stock del producto
        await pool.query('UPDATE Productos SET Stock = Stock + ? WHERE IdProducto = ?', [productoActual[0].CantidadProducto, productoActual[0].IdProducto]);

        res.send('Producto de la venta eliminado');
    } catch (error) {
        console.error('Error al eliminar producto de la venta:', error);
        res.status(500).json({ message: 'Error al eliminar producto de la venta' });
    }
};

// Actualizar un producto de una venta
export const putVentasProducto = async (req, res) => {
    const { id } = req.params;
    const { IdVenta, IdProducto, CantidadProducto } = req.body;

    try {
        // Obtener la cantidad actual para ajustar el stock
        const [productoActual] = await pool.query('SELECT CantidadProducto FROM VentasProducto WHERE IdVentaProducto = ?', [id]);

        if (productoActual.length === 0) {
            return res.status(404).json({ message: 'Producto de la venta no encontrado' });
        }

        const [result] = await pool.query(`
            UPDATE VentasProducto
            SET IdVenta = IFNULL(?, IdVenta),
                IdProducto = IFNULL(?, IdProducto),
                CantidadProducto = IFNULL(?, CantidadProducto)
            WHERE IdVentaProducto = ?
        `, [IdVenta, IdProducto, CantidadProducto, id]);

        if (result.affectedRows === 0) return res.status(404).json({
            message: 'Producto de la venta no encontrado'
        });

        // Ajustar el stock del producto
        const cantidadDiferencia = CantidadProducto - productoActual[0].CantidadProducto;
        await pool.query('UPDATE Productos SET Stock = Stock - ? WHERE IdProducto = ?', [cantidadDiferencia, IdProducto]);

        const [rows] = await pool.query('SELECT * FROM VentasProducto WHERE IdVentaProducto = ?', [id]);
        res.json(rows[0]);
    } catch (error) {
        console.error('Error al actualizar producto de la venta:', error);
        res.status(500).json({ message: 'Error al actualizar producto de la venta' });
    }
};
