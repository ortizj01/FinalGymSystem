import { pool } from '../db.js';

// Obtener todos los permisos asignados a roles
export const getPermisoRoles = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM PermisoRoles');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener permisos', error });
    }
};

// Obtener permisos asignados a un rol específico
export const getPermisoRolesPorRol = async (req, res) => {
    const { rolId } = req.query; // Obtener el rolId desde los parámetros de consulta

    try {
        const [rows] = await pool.query('SELECT * FROM PermisoRoles WHERE IdRol = ?', [rolId]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener permisos para el rol', error });
    }
};

export const getPermisoRolesPrincipal = async (req, res) => {
    const { IdRol } = req.params; // Obtener el rolId desde los parámetros de ruta

    try {
        const [rows] = await pool.query(
            `SELECT
                R.IdRol,
                R.NombreRol,
                R.EstadoRol,
                PR.IdPermiso,
                Pe.NombrePermiso,
                PR.Crear,
                PR.Editar,
                PR.Visualizar,
                PR.VistaAdmin
            FROM Roles AS R
            LEFT JOIN PermisoRoles AS PR
                ON R.IdRol = PR.IdRol
            LEFT JOIN Permisos AS Pe
                ON Pe.IdPermiso = PR.IdPermiso
            WHERE R.IdRol = ?`,
            [IdRol]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener permisos para el rol', error });
    }
};



// Crear o actualizar permisos de rol
export const upsertPermisoRoles = async (req, res) => {
    const { rolId, permisos } = req.body;

    try {
        // Eliminar permisos existentes para el rol
        await pool.query('DELETE FROM PermisoRoles WHERE IdRol = ?', [rolId]);

        // Insertar o actualizar permisos para el rol
        for (const permiso of permisos) {
            const { IdPermiso, Crear, Editar, Visualizar, VistaAdmin } = permiso;

            await pool.query(
                'INSERT INTO PermisoRoles (IdRol, IdPermiso, Crear, Editar, Visualizar, VistaAdmin) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE Crear = VALUES(Crear), Editar = VALUES(Editar), Visualizar = VALUES(Visualizar), VistaAdmin = VALUES(VistaAdmin)',
                [rolId, IdPermiso, Crear, Editar, Visualizar, VistaAdmin]
            );
        }

        res.status(200).json({ message: 'Permisos asignados correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al asignar permisos', error });
    }
};

// Obtener un permiso rol específico por ID
export const getPermisoRol = async (req, res) => {
    const { IdPermisoRol } = req.params;

    try {
        const [rows] = await pool.query('SELECT * FROM PermisoRoles WHERE IdPermisoRol = ?', [IdPermisoRol]);
        
        if (rows.length <= 0) {
            return res.status(404).json({ message: 'PermisoRol no encontrado' });
        }

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener permiso rol', error });
    }
};

// Actualizar un permiso rol existente
export const updatePermisoRol = async (req, res) => {
    const { IdPermisoRol } = req.params;
    const { IdRol, IdPermiso, Crear, Editar, Visualizar } = req.body;

    try {
        const [result] = await pool.query(
            'UPDATE PermisoRoles SET IdRol = IFNULL(?, IdRol), IdPermiso = IFNULL(?, IdPermiso), Crear = IFNULL(?, Crear), Editar = IFNULL(?, Editar), Visualizar = IFNULL(?, Visualizar) WHERE IdPermisoRol = ?',
            [IdRol, IdPermiso, Crear, Editar, Visualizar, IdPermisoRol]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'PermisoRol no encontrado' });
        }

        const [rows] = await pool.query('SELECT * FROM PermisoRoles WHERE IdPermisoRol = ?', [IdPermisoRol]);
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar permiso rol', error });
    }
};

// Eliminar un permiso rol
export const deletePermisoRol = async (req, res) => {
    const { IdPermisoRol } = req.params;

    try {
        const [result] = await pool.query('DELETE FROM PermisoRoles WHERE IdPermisoRol = ?', [IdPermisoRol]);

        if (result.affectedRows <= 0) {
            return res.status(404).json({ message: 'PermisoRol no encontrado' });
        }

        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar permiso rol', error });
    }
};