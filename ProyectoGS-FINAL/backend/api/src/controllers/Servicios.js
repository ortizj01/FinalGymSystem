import { pool } from "../db.js";

export const getServicios = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Servicios');
        res.json(rows);
    } catch (error) {
        return res.status(500).json({
            message: 'Something went wrong'
        });
    }
};

export const getServicio = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Servicios WHERE IdServicio = ?', [req.params.id]);
        if (rows.length <= 0) return res.status(400).json({
            message: 'Servicio not found'
        });
        res.json(rows[0]);
    } catch (error) {
        return res.status(500).json({
            message: 'Something went wrong'
        });
    }
};

export const postServicio = async (req, res) => {
    const { NombreClase, Instructor, Cantidad, CostoTotal, CostoVenta, Estado } = req.body;

    try {
        const [rows] = await pool.query('INSERT INTO Servicios (NombreClase, Instructor, Cantidad, CostoTotal, CostoVenta, Estado) VALUES (?, ?, ?, ?, ?, ?)', [NombreClase, Instructor, Cantidad, CostoTotal, CostoVenta, Estado]);
        res.json({
            IdServicio: rows.insertId,
            NombreClase,
            Instructor,
            Cantidad,
            CostoTotal,
            CostoVenta,
            Estado
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Something went wrong'
        });
    }
};

export const deleteServicio = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM Servicios WHERE IdServicio = ?', [req.params.id]);
        if (result.affectedRows <= 0) return res.status(400).json({
            message: 'Servicio not found'
        });
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({
            message: 'Something went wrong'
        });
    }
};

export const putServicio = async (req, res) => {
    const { NombreClase, Instructor, Cantidad, CostoTotal, CostoVenta, Estado } = req.body;
    try {
        const [result] = await pool.query('UPDATE Servicios SET NombreClase = ?, Instructor = ?, Cantidad = ?, CostoTotal = ?, CostoVenta = ?, Estado = ? WHERE IdServicio = ?', [NombreClase, Instructor, Cantidad, CostoTotal, CostoVenta, Estado, req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({
            message: 'Servicio not found'
        });
        res.json('Received');
    } catch (error) {
        return res.status(500).json({
            message: 'Something went wrong'
        });
    }
};
