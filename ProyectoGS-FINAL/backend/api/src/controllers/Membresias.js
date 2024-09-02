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
    const { NombreMembresia, Frecuencia, CostoVenta, Descripcion, Estado } = req.body;

    try {
        // Verificar si ya existe una membresía con el mismo nombre
        const [existingMembresias] = await pool.query('SELECT * FROM Membresias WHERE NombreMembresia = ?', [NombreMembresia]);

        if (existingMembresias.length > 0) {
            return res.status(400).json({
                message: 'Ya existe una membresía con este nombre.'
            });
        }

        // Crear nueva membresía
        const [rows] = await pool.query('INSERT INTO Membresias (NombreMembresia, Frecuencia, CostoVenta, Descripcion, Estado) VALUES (?, ?, ?, ?, ?)', [NombreMembresia, Frecuencia, CostoVenta, Descripcion, Estado]);
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
    const { NombreMembresia, Frecuencia, CostoVenta, Descripcion, Estado } = req.body;
    const { id } = req.params;

    try {
        // Verificar si ya existe una membresía con el mismo nombre, pero no la que se está actualizando
        const [existingMembresias] = await pool.query('SELECT * FROM Membresias WHERE NombreMembresia = ? AND IdMembresia != ?', [NombreMembresia, id]);

        if (existingMembresias.length > 0) {
            return res.status(400).json({
                message: 'Ya existe una membresía con este nombre.'
            });
        }

        // Actualizar la membresía
        const [result] = await pool.query('UPDATE Membresias SET NombreMembresia = ?, Frecuencia = ?, CostoVenta = ?, Descripcion = ?, Estado = ? WHERE IdMembresia = ?', [NombreMembresia, Frecuencia, CostoVenta, Descripcion, Estado, id]);
        if (result.affectedRows === 0) return res.status(404).json({
            message: 'Membresía no encontrada'
        });
        res.json('Received');
    } catch (error) {
        return res.status(500).json({
            message: 'Something went wrong'
        });
    }
};

// Endpoint para cambiar el estado de una membresía
export const changeState = async (req, res) => {
    const { id } = req.params;

    try {
        // Primero, obtén la membresía actual
        const [rows] = await pool.query('SELECT Estado FROM Membresias WHERE IdMembresia = ?', [id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Membresía no encontrada' });

        // Cambia el estado (si es 1 -> 0 o 0 -> 1)
        const nuevoEstado = rows[0].Estado === 1 ? 0 : 1;

        // Actualiza el estado en la base de datos
        await pool.query('UPDATE Membresias SET Estado = ? WHERE IdMembresia = ?', [nuevoEstado, id]);

        res.json({ message: 'Estado actualizado', nuevoEstado });
    } catch (error) {
        return res.status(500).json({ message: 'Algo salió mal' });
    }
};
