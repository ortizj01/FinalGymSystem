import { pool } from '../db.js';

export const getRoles = async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM Roles');
    res.json(rows);
};

export const getRol = async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM Roles WHERE IdRol = ?', [req.params.IdRol]);

    if (rows.length <= 0) return res.status(400).json({ message: 'Rol no encontrado' });

    res.json(rows[0]);
};

// Crear un nuevo rol con permisos
export const crearRol = async (req, res) => {
    const { NombreRol, EstadoRol, Permisos } = req.body;
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();
        
        const [rows] = await connection.query(
            'INSERT INTO Roles (NombreRol, EstadoRol) VALUES (?,?)',
            [NombreRol, EstadoRol]
        );

        const idRol = rows.insertId;
        
        if (Permisos && Permisos.length > 0) {
            for (const idPermiso of Permisos) {
                await connection.query(
                    'INSERT INTO PermisoRoles (IdRol, IdPermiso) VALUES (?, ?)',
                    [idRol, idPermiso]
                );
            }
        }

        await connection.commit();
        
        res.send({
            id: idRol,
            NombreRol,
            EstadoRol,
            Permisos
        });
    } catch (error) {
        await connection.rollback();
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        connection.release();
    }
};

export const eliminarRol = async (req, res) => {
    const [result] = await pool.query('DELETE FROM Roles WHERE IdRol = ?', [req.params.IdRol]);

    if (result.affectedRows <= 0) return res.status(404).json({ message: 'Rol not found' });

    res.sendStatus(204);
};

export const editarRol = async (req, res) => {
    const { IdRol } = req.params;
    const { NombreRol, EstadoRol } = req.body;

    try {
        const [result] = await pool.query('UPDATE Roles SET NombreRol = IFNULL(?, NombreRol),  EstadoRol = IFNULL (?, EstadoRol) WHERE IdRol = ?', [NombreRol, EstadoRol, IdRol]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Rol not found' });
        }
        
        const [rows] = await pool.query('SELECT * FROM Roles WHERE IdRol = ?', [IdRol]);
        res.json(rows[0]);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
