import { pool } from '../db.js';

export const getPermiso = async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM Permisos');
    res.json(rows);
};

export const crearPermiso = async (req, res) => {
    const { NombrePermiso, EstadoPermiso } = req.body;
    const [rows] = await pool.query('INSERT INTO Permisos (NombrePermiso, EstadoPermiso) VALUES (?,?)',
    [NombrePermiso, EstadoPermiso]);
    res.send({
        id: rows.insertId,
        NombrePermiso,
        EstadoPermiso
    });
};

export const eliminarPermiso = async (req, res) => {
    const [result] = await pool.query('DELETE FROM Permisos WHERE IdPermiso = ?', [req.params.id]);

    if (result.affectedRows <= 0) return res.status(404).json({ message: 'Permiso no encontrado' });

    res.sendStatus(204);
};

export const editarPermiso = async (req, res) => {
    const { IdPermiso } = req.params;
    const { NombrePermiso, EstadoPermiso } = req.body;

    const [result] = await pool.query('UPDATE Permisos SET NombrePermiso =?, EstadoPermiso =?  WHERE IdPermiso = ?' ,
        [NombrePermiso, EstadoPermiso, IdPermiso]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: 'Permiso no encontrado' });

    const [rows] = await pool.query('SELECT * FROM Permisos WHERE IdPermiso= ?', [IdPermiso]);

    res.json(rows[0]);
};
