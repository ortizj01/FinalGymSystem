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
    const { NombreClase, Estado } = req.body;

    try {
        // Validar que el nombre del servicio contenga al menos 5 caracteres
        if (NombreClase.length < 5) {
            return res.status(400).json({ message: 'El nombre del servicio debe tener al menos 5 caracteres.' });
        }

        // Verificar si el nombre del servicio ya existe
        const [existingService] = await pool.query(
            'SELECT * FROM Servicios WHERE NombreClase = ?',
            [NombreClase]
        );

        if (existingService.length > 0) {
            return res.status(400).json({ message: 'El servicio con ese nombre ya existe.' });
        }

        // Insertar el nuevo servicio
        const [rows] = await pool.query(
            'INSERT INTO Servicios (NombreClase, Estado) VALUES (?, ?)',
            [NombreClase, Estado]
        );

        res.json({
            IdServicio: rows.insertId,
            NombreClase,
            Estado
        });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({
            message: 'Hubo un problema al procesar la solicitud. Inténtalo de nuevo más tarde.'
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
    const { NombreClase, Estado } = req.body;
    const { id } = req.params;

    try {
        // Check if the service name already exists, excluding the current service
        const [existingService] = await pool.query(
            'SELECT * FROM Servicios WHERE NombreClase = ? AND IdServicio != ?',
            [NombreClase, id]
        );

        if (existingService.length > 0) {
            return res.status(400).json({ message: 'El servicio con ese nombre ya existe.' });
        }

        // Update the service
        const [result] = await pool.query(
            'UPDATE Servicios SET NombreClase = ?, Estado = ? WHERE IdServicio = ?',
            [NombreClase, Estado, id]
        );

        if (result.affectedRows === 0) return res.status(404).json({
            message: 'Servicio not found'
        });

        res.json('Servicio actualizado');
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({
            message: 'Something went wrong'
        });
    }
};


export const changeState = async (req, res) => {
    const { id } = req.params;

    try {
        // Primero, obtén el estado actual del servicio
        const [rows] = await pool.query('SELECT Estado FROM Servicios WHERE IdServicio = ?', [id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Servicio no encontrado' });

        // Cambia el estado (si es 1 -> 0 o 0 -> 1)
        const nuevoEstado = rows[0].Estado === 1 ? 0 : 1;

        // Actualiza el estado en la base de datos
        await pool.query('UPDATE Servicios SET Estado = ? WHERE IdServicio = ?', [nuevoEstado, id]);

        res.json({ message: 'Estado actualizado', nuevoEstado });
    } catch (error) {
        console.error('Error al cambiar el estado del servicio:', error);
        return res.status(500).json({ message: 'Algo salió mal' });
    }
};