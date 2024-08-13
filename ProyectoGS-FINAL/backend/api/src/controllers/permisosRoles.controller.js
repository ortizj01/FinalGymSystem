import { pool } from '../db.js';

export const getPermisosDeRol = async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM PermisoRoles WHERE IdRol = ?', [req.params.IdRol]);
    res.json(rows);
};

export const agregarPermisoARol = async (req, res) => {
    const { IdPermiso } = req.body;
    const { IdRol } = req.params;
    const [rows] = await pool.query('INSERT INTO PermisoRoles (IdRol, IdPermiso) VALUES (?, ?)', [IdRol, IdPermiso]);
    res.json(rows);
};

export const eliminarPermisoDeRol = async (req, res) => {
    const { IdRol, IdPermiso } = req.params;
    const [rows] = await pool.query('DELETE FROM PermisoRoles WHERE IdRol = ? AND IdPermiso = ?', [IdRol, IdPermiso]);
    res.json(rows);
};
