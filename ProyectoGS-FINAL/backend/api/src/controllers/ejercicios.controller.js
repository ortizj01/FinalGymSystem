import { pool } from '../db.js';

export const getEjercicios = async (req, res) => {
    const [rows] = await pool.query ('SELECT * FROM Ejercicios') 
    res.json(rows)
}

export const getEjercicioRutina = async (req, res) => {
    const [rows] = await pool.query ('SELECT * FROM RutinasEjercicios') 
    res.json(rows)
}

export const getEjercicio = async (req, res) => {
    const [rows] = await pool.query ('SELECT * FROM Ejercicios WHERE IdEjercicio = ?', [req.params.IdEjercicio])
    
    if(rows.length <= 0) return res.status(400).json({
        message: 'Ejercicio no encontrado'
    })   

    res.json({
        ejercicio: rows[0],
        usuario: req.user // Aquí adjuntamos el usuario a la respuesta
    });
    
}

export const createEjercicios = async (req, res) => {
    const {NombreEjercicio, DescripcionEjercicio, RepeticionesEjercicio, EstadoEjercicio} = req.body
    const [rows] = await pool.query('INSERT INTO Ejercicios (NombreEjercicio, DescripcionEjercicio, RepeticionesEjercicio, EstadoEjercicio) VALUES (?,?,?,?)',
    [NombreEjercicio, DescripcionEjercicio,RepeticionesEjercicio,EstadoEjercicio])
    res.send({
        id: rows.insertId,
        NombreEjercicio,
        DescripcionEjercicio,
        RepeticionesEjercicio,
        EstadoEjercicio
    })

}

export const deleteEjercicio = async (req, res) => {
    const [result] = await pool.query('DELETE FROM Ejercicios WHERE IdEjercicio = ?', [req.params.IdEjercicio])

    if (result.affectedRows <= 0) return res.status(404).json({
        message: 'Ejercicio no encontrado'
    })
    
    res.sendStatus(204)
}


export const updateEjercicios = async (req, res) => {
    const { IdEjercicio } = req.params;
    const { NombreEjercicio, DescripcionEjercicio, RepeticionesEjercicio, EstadoEjercicio } = req.body;

    const [result] = await pool.query('UPDATE Ejercicios SET NombreEjercicio = IFNULL(?, NombreEjercicio), DescripcionEjercicio = IFNULL(?, DescripcionEjercicio), RepeticionesEjercicio = IFNULL(?, RepeticionesEjercicio), EstadoEjercicio = IFNULL(?, EstadoEjercicio) WHERE IdEjercicio = ?',
        [NombreEjercicio, DescripcionEjercicio, RepeticionesEjercicio, EstadoEjercicio, IdEjercicio]
    );

    if (result.affectedRows === 0) return res.status(404).json({
        message: 'Ejercicio no encontrado'
    });

    const [rows] = await pool.query('SELECT * FROM Ejercicios WHERE IdEjercicio = ?', [IdEjercicio]);

    res.json(rows[0]);
};
