import { pool } from '../db.js';

// Obtener todos los roles
export const getRoles = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Roles');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los roles' });
    }
};

// Obtener un rol específico por ID
export const getRol = async (req, res) => {
    const { IdRol } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM Roles WHERE IdRol = ?', [IdRol]);

        if (rows.length <= 0) {
            return res.status(404).json({ message: 'Rol no encontrado' });
        }

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el rol' });
    }
};

// Crear un nuevo rol
export const createRol = async (req, res) => {
    const { NombreRol, EstadoRol } = req.body;
    try {
        const [result] = await pool.query('INSERT INTO Roles (NombreRol, EstadoRol) VALUES (?, ?)', [NombreRol, EstadoRol]);
        res.json({
            id: result.insertId,
            NombreRol,
            EstadoRol,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el rol' });
    }
};

// Actualizar un rol existente
export const updateRol = async (req, res) => {
    const { IdRol } = req.params;
    const { NombreRol, EstadoRol } = req.body;

    try {
        const [result] = await pool.query(
            'UPDATE Roles SET NombreRol = IFNULL(?, NombreRol), EstadoRol = IFNULL(?, EstadoRol) WHERE IdRol = ?',
            [NombreRol, EstadoRol, IdRol]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Rol no encontrado' });
        }

        const [rows] = await pool.query('SELECT * FROM Roles WHERE IdRol = ?', [IdRol]);
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el rol' });
    }
};

// Cambiar el estado de un rol
export const changeRolState = async (req, res) => {
    const { IdRol } = req.params;
    const { EstadoRol } = req.body;

    try {
        const [result] = await pool.query(
            'UPDATE Roles SET EstadoRol = ? WHERE IdRol = ?',
            [EstadoRol, IdRol]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Rol no encontrado' });
        }

        const [rows] = await pool.query('SELECT * FROM Roles WHERE IdRol = ?', [IdRol]);
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al cambiar el estado del rol' });
    }
};

// Eliminar un rol
export const deleteRol = async (req, res) => {
    const { IdRol } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM Roles WHERE IdRol = ?', [IdRol]);

        if (result.affectedRows <= 0) {
            return res.status(404).json({ message: 'Rol no encontrado' });
        }

        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el rol' });
    }
};
