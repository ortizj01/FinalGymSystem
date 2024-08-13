import { pool } from '../db.js';

// Obtener todas las membresías de una venta
export const getVentasMembresia = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT
                vm.IdVentaMembresia,
                vm.IdVenta,
                vm.IdMembresia,
                m.NombreMembresia,
                vm.Cantidad,
                m.CostoVenta AS PrecioMembresia,
                vm.Cantidad * m.CostoVenta AS TotalMembresia
            FROM VentasMembresia vm
            JOIN Membresias m ON vm.IdMembresia = m.IdMembresia
            WHERE vm.IdVenta = ?
        `, [req.params.id]);
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener las membresías de la venta:', error);
        res.status(500).json({ message: 'Error al obtener las membresías de la venta' });
    }
};

// Obtener una membresía de venta por ID
export const getVentaMembresia = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('SELECT * FROM VentasMembresia WHERE IdVentaMembresia = ?', [id]);

        if (rows.length <= 0) return res.status(404).json({ message: 'Membresía de venta no encontrada' });

        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener la membresía de venta:', error);
        res.status(500).json({ error: 'Error al obtener la membresía de venta' });
    }
};

// Añadir una nueva membresía a una venta
export const postVentasMembresia = async (req, res) => {
    const { IdVenta, IdMembresia, Cantidad } = req.body;

    try {
        const [rows] = await pool.query(`
            INSERT INTO VentasMembresia (IdVenta, IdMembresia, Cantidad)
            VALUES (?, ?, ?)
        `, [IdVenta, IdMembresia, Cantidad]);

        res.send({
            id: rows.insertId,
            IdVenta,
            IdMembresia,
            Cantidad
        });
    } catch (error) {
        console.error('Error al añadir membresía a la venta:', error);
        res.status(500).json({ message: 'Error al añadir membresía a la venta' });
    }
};

// Actualizar una membresía de una venta
export const putVentasMembresia = async (req, res) => {
    const { id } = req.params;
    const { IdVenta, IdMembresia, Cantidad } = req.body;

    try {
        const [result] = await pool.query(`
            UPDATE VentasMembresia
            SET IdVenta = IFNULL(?, IdVenta),
                IdMembresia = IFNULL(?, IdMembresia),
                Cantidad = IFNULL(?, Cantidad)
            WHERE IdVentaMembresia = ?
        `, [IdVenta, IdMembresia, Cantidad, id]);

        if (result.affectedRows === 0) return res.status(404).json({
            message: 'Membresía de la venta no encontrada'
        });

        const [rows] = await pool.query('SELECT * FROM VentasMembresia WHERE IdVentaMembresia = ?', [id]);
        res.json(rows[0]);
    } catch (error) {
        console.error('Error al actualizar membresía de la venta:', error);
        res.status(500).json({ message: 'Error al actualizar membresía de la venta' });
    }
};

// Eliminar una membresía de una venta
export const deleteVentasMembresia = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM VentasMembresia WHERE IdVentaMembresia = ?', [req.params.id]);
        if (result.affectedRows <= 0) return res.status(404).json({
            message: 'Membresía de la venta no encontrada'
        });
        res.send('Membresía de la venta eliminada');
    } catch (error) {
        console.error('Error al eliminar membresía de la venta:', error);
        res.status(500).json({ message: 'Error al eliminar membresía de la venta' });
    }
};
