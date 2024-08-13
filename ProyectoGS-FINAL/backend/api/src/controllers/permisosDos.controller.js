import { pool } from '../db.js';

// Obtener todos los permisos
export const getPermisos = async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM Permisos');
    res.json(rows);
};

// Obtener un permiso específico por ID
export const getPermiso = async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM Permisos WHERE IdPermiso = ?', [req.params.IdPermiso]);
    
    if (rows.length <= 0) {
        return res.status(404).json({
            message: 'Permiso no encontrado'
        });
    }

    res.json(rows[0]);
};

// Crear un nuevo permiso
export const createPermiso = async (req, res) => {
    const { NombrePermiso, EstadoPermiso, ModuloPadre } = req.body;
    const [rows] = await pool.query(
        'INSERT INTO Permisos (NombrePermiso, EstadoPermiso, ModuloPadre) VALUES (?, ?, ?)',
        [NombrePermiso, EstadoPermiso, ModuloPadre]
    );
    res.json({
        id: rows.insertId,
        NombrePermiso,
        EstadoPermiso,
        ModuloPadre
    });
};

// Actualizar un permiso existente
export const updatePermiso = async (req, res) => {
    const { IdPermiso } = req.params;
    const { NombrePermiso, EstadoPermiso, ModuloPadre } = req.body;

    const [result] = await pool.query(
        'UPDATE Permisos SET NombrePermiso = IFNULL(?, NombrePermiso), EstadoPermiso = IFNULL(?, EstadoPermiso), ModuloPadre = IFNULL(?, ModuloPadre) WHERE IdPermiso = ?',
        [NombrePermiso, EstadoPermiso, ModuloPadre, IdPermiso]
    );

    if (result.affectedRows === 0) {
        return res.status(404).json({
            message: 'Permiso no encontrado'
        });
    }

    const [rows] = await pool.query('SELECT * FROM Permisos WHERE IdPermiso = ?', [IdPermiso]);
    res.json(rows[0]);
};

// Eliminar un permiso
export const deletePermiso = async (req, res) => {
    const [result] = await pool.query('DELETE FROM Permisos WHERE IdPermiso = ?', [req.params.IdPermiso]);

    if (result.affectedRows <= 0) {
        return res.status(404).json({
            message: 'Permiso no encontrado'
        });
    }

    res.sendStatus(204);
};
