import { pool } from '../db.js';

export const getEjerciciosDeRutina = async (req, res) => {
    const { IdRutina } = req.params;
    const [rows] = await pool.query(`
        SELECT 
            e.*, 
            reds.Series 
        FROM 
            Ejercicios e 
        JOIN 
            RutinasEjercicios re ON e.IdEjercicio = re.IdEjercicio 
        LEFT JOIN 
            RutinasEjerciciosDiaSemana reds ON re.IdRutinaEjercicio = reds.IdRutinaEjercicio 
        WHERE 
            re.IdRutina = ?
    `, [IdRutina]);
    
    res.json(rows);
};


export const agregarEjercicioARutina = async (req, res) => {
    const { IdRutina } = req.params;
    const { IdEjercicio } = req.body;
    const [rows] = await pool.query('INSERT INTO RutinasEjercicios (IdRutina, IdEjercicio) VALUES (?, ?)', [IdRutina, IdEjercicio]);
    res.send({
        id: rows.insertId,
        IdRutina,
        IdEjercicio
    });
};

export const actualizarEjercicioDeRutina = async (req, res) => {
    const { IdRutina } = req.params;
    const { IdEjercicio } = req.body;

    // Verificar si el ejercicio ya está asociado a la rutina
    const [existingRows] = await pool.query('SELECT * FROM RutinasEjercicios WHERE IdRutina = ? AND IdEjercicio = ?', [IdRutina, IdEjercicio]);

    if (existingRows.length > 0) {
        // Si el ejercicio ya está asociado, simplemente respondemos con éxito
        return res.status(200).json({ message: 'El ejercicio ya está asociado a esta rutina' });
    }

    // Si el ejercicio no está asociado, lo agregamos
    const [rows] = await pool.query('INSERT INTO RutinasEjercicios (IdRutina, IdEjercicio) VALUES (?, ?)', [IdRutina, IdEjercicio]);
    res.send({
        id: rows.insertId,
        IdRutina,
        IdEjercicio
    });
};

export const eliminarEjercicioDeRutina = async (req, res) => {
    const { IdRutinaEjercicio } = req.params;
    await pool.query('DELETE FROM RutinasEjercicios WHERE IdRutinaEjercicio = ?', [IdRutinaEjercicio]);
    res.sendStatus(204);
};

export const getDetallesDeRutinaPorDiaSemana = async (req, res) => {
    const { IdRutina } = req.params;
    const { DiaSemana } = req.query;
    const [rows] = await pool.query('SELECT re.*, reds.Series FROM RutinasEjerciciosDiaSemana reds JOIN RutinasEjercicios re ON reds.IdRutinaEjercicio = re.IdRutinaEjercicio WHERE re.IdRutina = ? AND reds.DiaSemana = ?', [IdRutina, DiaSemana]);
    res.json(rows);
};

export const agregarEjercicioARutinaPorDiaSemana = async (req, res) => {
    const { IdRutinaEjercicio } = req.params;
    const { DiaSemana, Series } = req.body;
    const [rows] = await pool.query('INSERT INTO RutinasEjerciciosDiaSemana (IdRutinaEjercicio, DiaSemana, Series) VALUES (?, ?, ?)', [IdRutinaEjercicio, DiaSemana, Series]);
    res.send({
        id: rows.insertId,
        IdRutinaEjercicio,
        DiaSemana,
        Series
    });
};

export const actualizarEjercicioDeRutinaPorDiaSemana = async (req, res) => {
    const { IdRutinaEjercicio } = req.params;
    const { DiaSemana, Series } = req.body;

    // Verificar si ya existe un registro para este ejercicio y día de la semana
    const [existingRows] = await pool.query('SELECT * FROM RutinasEjerciciosDiaSemana WHERE IdRutinaEjercicio = ? AND DiaSemana = ?', [IdRutinaEjercicio, DiaSemana]);

    if (existingRows.length > 0) {
        // Si existe, actualizar el campo Series
        await pool.query('UPDATE RutinasEjerciciosDiaSemana SET Series = ? WHERE IdRutinaEjercicio = ? AND DiaSemana = ?', [Series, IdRutinaEjercicio, DiaSemana]);
        return res.status(200).json({ message: 'Ejercicio actualizado con éxito', Series });
    }

    // Si no existe, lo agregamos
    const [rows] = await pool.query('INSERT INTO RutinasEjerciciosDiaSemana (IdRutinaEjercicio, DiaSemana, Series) VALUES (?, ?, ?)', [IdRutinaEjercicio, DiaSemana, Series]);
    res.send({
        id: rows.insertId,
        IdRutinaEjercicio,
        DiaSemana,
        Series
    });
};

export const eliminarEjercicioDeRutinaPorDiaSemana = async (req, res) => {
    const { IdRutinaEjercicioDiaSemana } = req.params;
    await pool.query('DELETE FROM RutinasEjerciciosDiaSemana WHERE IdRutinaEjercicioDiaSemana = ?', [IdRutinaEjercicioDiaSemana]);
    res.sendStatus(204);
};
