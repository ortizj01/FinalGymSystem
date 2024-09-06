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

    // Verificar si el ejercicio ya está asociado a la rutina
    const [existingRows] = await pool.query('SELECT * FROM RutinasEjercicios WHERE IdRutina = ? AND IdEjercicio = ?', [IdRutina, IdEjercicio]);

    if (existingRows.length > 0) {
        return res.status(200).json({ message: 'El ejercicio ya está asociado a esta rutina' });
    }

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
    
    // Verificar el valor de IdRutinaEjercicio
    console.log('IdRutinaEjercicio:', IdRutinaEjercicio);
    
    // Validar que IdRutinaEjercicio esté definido y no sea 'undefined'
    if (IdRutinaEjercicio === 'undefined' || IdRutinaEjercicio === undefined) {
        return res.status(400).json({ error: 'IdRutinaEjercicio es requerido' });
    }
    
    // Validar que Series esté definido y sea un número válido
    if (isNaN(Series) || Series <= 0) {
        return res.status(400).json({ error: 'Series debe ser un número válido' });
    }
    
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

    try {
        const [existingRows] = await pool.query('SELECT * FROM RutinasEjerciciosDiaSemana WHERE IdRutinaEjercicio = ? AND DiaSemana = ?', [IdRutinaEjercicio, DiaSemana]);

        if (existingRows.length > 0) {
            await pool.query('UPDATE RutinasEjerciciosDiaSemana SET Series = ? WHERE IdRutinaEjercicio = ? AND DiaSemana = ?', [Series, IdRutinaEjercicio, DiaSemana]);
            return res.status(200).json({ message: 'Ejercicio actualizado con éxito', Series });
        }

        const [rows] = await pool.query('INSERT INTO RutinasEjerciciosDiaSemana (IdRutinaEjercicio, DiaSemana, Series) VALUES (?, ?, ?)', [IdRutinaEjercicio, DiaSemana, Series]);
        res.send({
            id: rows.insertId,
            IdRutinaEjercicio,
            DiaSemana,
            Series
        });
    } catch (error) {
        console.error('Error al actualizar o agregar el ejercicio de la rutina por día de semana:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


export const eliminarEjercicioDeRutinaPorDiaSemana = async (req, res) => {
    const { IdRutinaEjercicioDiaSemana } = req.params;
    await pool.query('DELETE FROM RutinasEjerciciosDiaSemana WHERE IdRutinaEjercicioDiaSemana = ?', [IdRutinaEjercicioDiaSemana]);
    res.sendStatus(204);
};
