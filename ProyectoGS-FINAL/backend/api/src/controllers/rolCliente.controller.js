import { pool } from '../db.js';

export const assignRole = async (req, res) => {
    const { idUsuario, idRol } = req.body;

    try {
        const [result] = await pool.query(
            'INSERT INTO RolUsuario (IdUsuario, IdRol) VALUES (?, ?)',
            [idUsuario, idRol]
        );
        res.status(201).json({
            IdRolUsuario: result.insertId,
            IdUsuario: idUsuario,
            IdRol: idRol
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrió un error al asignar el rol' });
    }
};
