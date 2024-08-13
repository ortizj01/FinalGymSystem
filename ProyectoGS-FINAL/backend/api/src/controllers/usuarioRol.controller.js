import { pool } from '../db.js';

// Obtener usuario por su Id junto con los roles asignados
export const getUsuarioRolById = async (req, res) => {
    try {
        const { IdUsuario } = req.params;
        if (!IdUsuario) {
            return res.status(400).json({ error: 'IdUsuario es requerido' });
        }

        // Consulta para obtener el usuario por su Id
        const [usuarioRows] = await pool.query('SELECT * FROM Usuarios WHERE IdUsuario = ?', [IdUsuario]);
        if (usuarioRows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Consulta para obtener los roles asignados al usuario
        const [rolesRows] = await pool.query('SELECT r.*, ru.IdRolUsuario FROM Roles r JOIN RolUsuario ru ON r.IdRol = ru.IdRol WHERE ru.IdUsuario = ?', [IdUsuario]);

        // Agregar los roles al objeto de usuario
        const usuario = usuarioRows[0];
        usuario.roles = rolesRows;

        res.json(usuario);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el usuario y sus roles' });
    }
};

// Obtener roles de un usuario específico
export const getRolesDeUsuario = async (req, res) => {
    try {
        const { IdUsuario } = req.params;
        if (!IdUsuario) {
            return res.status(400).json({ error: 'IdUsuario es requerido' });
        }

        const [rows] = await pool.query('SELECT r.*, ru.IdRolUsuario FROM Roles r JOIN RolUsuario ru ON r.IdRol = ru.IdRol WHERE ru.IdUsuario = ?', [IdUsuario]);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los roles del usuario' });
    }
};

// Asignar un rol a un usuario
export const agregarRolAUsuario = async (req, res) => {
    try {
        const { IdUsuario } = req.params;
        const { IdRol } = req.body;

        if (!IdUsuario || !IdRol) {
            return res.status(400).json({ error: 'IdUsuario e IdRol son requeridos' });
        }

        // Verificar si el usuario ya tiene asignado este rol
        const [existingRole] = await pool.query('SELECT * FROM RolUsuario WHERE IdUsuario = ? AND IdRol = ?', [IdUsuario, IdRol]);
        if (existingRole.length > 0) {
            return res.status(400).json({ error: 'El usuario ya tiene asignado este rol' });
        }

        const [result] = await pool.query('INSERT INTO RolUsuario (IdRol, IdUsuario) VALUES (?, ?)', [IdRol, IdUsuario]);

        res.status(201).send({
            id: result.insertId,
            IdRol,
            IdUsuario
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al asignar el rol al usuario' });
    }
};

// Eliminar un rol de un usuario
export const eliminarRolDeUsuario = async (req, res) => {
    try {
        const { IdRolUsuario } = req.params;

        if (!IdRolUsuario) {
            return res.status(400).json({ error: 'IdRolUsuario es requerido' });
        }

        // Verificar si el rol de usuario existe antes de eliminarlo
        const [existingRole] = await pool.query('SELECT * FROM RolUsuario WHERE IdRolUsuario = ?', [IdRolUsuario]);
        if (existingRole.length === 0) {
            return res.status(404).json({ error: 'El rol de usuario no existe' });
        }

        await pool.query('DELETE FROM RolUsuario WHERE IdRolUsuario = ?', [IdRolUsuario]);

        res.sendStatus(204);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el rol del usuario' });
    }
};
