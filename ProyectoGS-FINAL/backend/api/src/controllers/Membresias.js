import { pool } from "../db.js";

export const getMembresias = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Membresias');
        res.json(rows);
    } catch (error) {
        return res.status(500).json({
            message: 'Something went wrong'
        });
    }
};

export const getMembresia = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Membresias WHERE IdMembresia = ?', [req.params.id]);
        if (rows.length <= 0) return res.status(400).json({
            message: 'Membresia not found'
        });
        res.json(rows[0]);
    } catch (error) {
        return res.status(500).json({
            message: 'Something went wrong'
        });
    }
};

export const postMembresia = async (req, res) => {
    const { NombreMembresia, Frecuencia, CostoVenta,Descripcion, Estado } = req.body;

    try {
        const [rows] = await pool.query('INSERT INTO Membresias (NombreMembresia, Frecuencia,  CostoVenta, Descripcion , Estado) VALUES (?, ?, ?, ?, ?)', [NombreMembresia, Frecuencia, CostoVenta, Descripcion, Estado]);
        res.json({
            IdMembresia: rows.insertId,
            NombreMembresia,
            Frecuencia,
            CostoVenta,
            Descripcion,
            Estado
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Something went wrong'
        });
    }
};

export const deleteMembresia = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM Membresias WHERE IdMembresia = ?', [req.params.id]);
        if (result.affectedRows <= 0) return res.status(400).json({
            message: 'Membresia not found'
        });
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({
            message: 'Something went wrong'
        });
    }
};

export const putMembresia = async (req, res) => {
    const {  NombreMembresia, Frecuencia, CostoVenta, Descripcion,Estado } = req.body;
    try {
        const [result] = await pool.query('UPDATE Membresias SET NombreMembresia = ?, Frecuencia = ?, CostoVenta = ?,  Descripcion = ?,  Estado = ? WHERE IdMembresia = ?', [ NombreMembresia, Frecuencia, CostoVenta, Descripcion , Estado, req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({
            message: 'Membresia not found'
        });
        res.json('Received');
    } catch (error) {
        return res.status(500).json({
            message: 'Something went wrong'
        });
    }
};
