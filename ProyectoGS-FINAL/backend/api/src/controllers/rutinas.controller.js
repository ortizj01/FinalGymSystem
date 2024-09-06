import { pool } from '../db.js';

//Traer todas las Rutinas
export const getRutinas = async (req, res) => {
    try {
        const query = `
            SELECT 
                r.IdRutina,
                r.NombreRutina,
                r.EstadoRutina,
                r.IdUsuario,
                u.Nombres, 
                u.Apellidos
            FROM 
                Rutinas r
            LEFT JOIN 
                Usuarios u ON r.IdUsuario = u.IdUsuario
        `;

        const [rows] = await pool.query(query);

        // Procesar los resultados si es necesario
        const rutinas = rows.map(row => ({
            IdRutina: row.IdRutina,
            NombreRutina: row.NombreRutina,
            EstadoRutina: row.EstadoRutina,
            IdUsuario: row.IdUsuario,
            NombreCompletoUsuario: `${row.Nombres} ${row.Apellidos}` // Combinar nombres y apellidos
        }));

        res.json(rutinas);
    } catch (error) {
        console.error('Error al obtener las rutinas:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};


// Traer los detalles de una Rutina con sus ejercicios asociados
export const getRutina = async (req, res) => {
    try {
        const query = `
            SELECT 
                r.*, 
                re.*, 
                reds.DiaSemana, 
                reds.Series, 
                e.NombreEjercicio, 
                u.Nombres, 
                u.Apellidos
            FROM 
                Rutinas r
            LEFT JOIN 
                RutinasEjercicios re ON r.IdRutina = re.IdRutina
            LEFT JOIN 
                RutinasEjerciciosDiaSemana reds ON re.IdRutinaEjercicio = reds.IdRutinaEjercicio
            LEFT JOIN 
                Ejercicios e ON re.IdEjercicio = e.IdEjercicio
            LEFT JOIN 
                Usuarios u ON r.IdUsuario = u.IdUsuario
            WHERE 
                r.IdRutina = ?
        `;
        
        const [rows] = await pool.query(query, [req.params.IdRutina]);

        if (rows.length <= 0) {
            return res.status(400).json({ message: 'Rutina no encontrada' });
        }

        const rutina = {
            IdRutina: rows[0].IdRutina,
            NombreRutina: rows[0].NombreRutina,
            EstadoRutina: rows[0].EstadoRutina,
            IdUsuario: rows[0].IdUsuario,
            NombreCompletoUsuario: `${rows[0].Nombres} ${rows[0].Apellidos}`,
            Ejercicios: rows.map(row => ({
                IdEjercicio: row.IdEjercicio,
                NombreEjercicio: row.NombreEjercicio,
                DiaSemana: row.DiaSemana,
                Series: row.Series
            }))
        };

        res.json(rutina);
    } catch (error) {
        console.error('Error al obtener la rutina:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};




export const createRutinas = async (req, res) =>{
    const {NombreRutina, EstadoRutina, IdUsuario} = req.body
    const [rows] = await pool.query('INSERT INTO Rutinas (NombreRutina, EstadoRutina, IdUsuario) VALUES (?,?,?)',
    [NombreRutina, EstadoRutina, IdUsuario])
    res.send({
        id: rows.insertId,
        NombreRutina,
        EstadoRutina,
        IdUsuario
    })

}

export const updateRutina = async (req, res) => {
    const { IdRutina } = req.params;
    const { NombreRutina, EstadoRutina, IdUsuario } = req.body;

    try {
        await pool.query('UPDATE Rutinas SET NombreRutina = ?, EstadoRutina = ?, IdUsuario = ? WHERE IdRutina = ?', [NombreRutina, EstadoRutina, IdUsuario, IdRutina]);
        res.status(200).json({ message: 'Rutina actualizada con éxito' });
    } catch (error) {
        console.error('Error al actualizar la rutina:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};



export const deleteRutina = async (req, res) => {
    const [result] = await pool.query('DELETE FROM Rutinas WHERE IdRutina = ?', [req.params.IdRutina]);
    if (result.affectedRows <= 0) return res.status(404).json({ message: 'Rutina no encontrada' });
    res.sendStatus(204);
};

// En tu archivo de controlador de rutinas (rutinas.controller.js)

export const getRutinaDetallada = async (req, res) => {
    const { IdRutina } = req.params;

    // Consulta para obtener los detalles de la rutina, los días de la semana y los ejercicios asociados
    const query = `
        SELECT r.NombreRutina, reds.DiaSemana, e.NombreEjercicio
        FROM Rutinas r
        JOIN RutinasEjercicios re ON r.IdRutina = re.IdRutina
        JOIN RutinasEjerciciosDiaSemana reds ON re.IdRutinaEjercicio = reds.IdRutinaEjercicio
        JOIN Ejercicios e ON re.IdEjercicio = e.IdEjercicio
        WHERE r.IdRutina = ?
    `;

    try {
        const [rows] = await pool.query(query, [IdRutina]);
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener los detalles de la rutina:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};


export const getUsuarios = async (req, res) => {
    try {
        // Consulta SQL actualizada para incluir el nombre completo del usuario
        const [rows] = await pool.query(`
            SELECT u.IdUsuario, CONCAT(u.Nombres, ' ', u.Apellidos) AS NombreCompleto
            FROM Usuarios u
            JOIN RolUsuario ru ON u.IdUsuario = ru.IdUsuario
            WHERE ru.IdRol = 3
        `);
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};


// Función para eliminar los ejercicios de una rutina
export const deleteEjerciciosDeRutina = async (req, res) => {
    const { IdRutina } = req.params;

    try {
        const [result] = await pool.query('DELETE FROM RutinasEjercicios WHERE IdRutina = ?', [IdRutina]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'No se encontraron ejercicios para esta rutina' });
        }

        res.sendStatus(204);
    } catch (error) {
        console.error('Error al eliminar los ejercicios de la rutina:', error);
        res.status(500).json({ message: 'Error al eliminar los ejercicios de la rutina', error });
    }
}

export const eliminarEjercicioDeRutina = async (req, res) => {
    const { IdRutina, IdEjercicio, DiaSemana } = req.params;

    // Validar que diaSemana no sea undefined o esté fuera de rango
    if (!DiaSemana || isNaN(DiaSemana) || DiaSemana < 1 || DiaSemana > 7) {
        return res.status(400).json({ error: 'Día de la semana inválido' });
    }

    const query = `
        DELETE FROM RutinasEjerciciosDiaSemana 
        WHERE IdRutinaEjercicio = (
            SELECT IdRutinaEjercicio 
            FROM RutinasEjercicios 
            WHERE IdRutina = ? AND IdEjercicio = ?
            LIMIT 1
        ) 
        AND DiaSemana = ?
    `;

    try {
        const [results] = await pool.query(query, [IdRutina, IdEjercicio, DiaSemana]);

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Ejercicio no encontrado en la rutina para el día especificado' });
        }

        res.json({ success: true, message: 'Ejercicio eliminado de la rutina' });
    } catch (error) {
        console.error('Error al eliminar el ejercicio de la rutina:', error);
        res.status(500).json({ error: 'Error al eliminar el ejercicio de la rutina' });
    }
};


export const getRutinaCompletaPorUsuario = async (req, res) => {
    const { IdUsuario } = req.params;

    // Consulta SQL actualizada para incluir el campo RepeticionesEjercicio
    const query = `
        SELECT 
            r.IdRutina,
            r.NombreRutina,
            r.EstadoRutina,
            reds.DiaSemana,
            e.NombreEjercicio,
            e.DescripcionEjercicio,
            e.RepeticionesEjercicio,  -- Nuevo campo agregado
            reds.Series
        FROM 
            Rutinas r
        JOIN 
            RutinasEjercicios re ON r.IdRutina = re.IdRutina
        JOIN 
            Ejercicios e ON re.IdEjercicio = e.IdEjercicio
        LEFT JOIN 
            RutinasEjerciciosDiaSemana reds ON re.IdRutinaEjercicio = reds.IdRutinaEjercicio
        WHERE 
            r.IdUsuario = ?
    `;

    try {
        const [rows] = await pool.query(query, [IdUsuario]);

        // Verificar si se encontraron resultados
        if (rows.length <= 0) {
            return res.status(404).json({ message: 'No hay rutinas asignadas para este usuario' });
        }

        // Crear un objeto para almacenar la rutina con ejercicios y días de la semana
        const rutinaConDetalles = rows.reduce((acc, row) => {
            // Si la rutina aún no está en el acumulador, inicializarla
            if (!acc[row.IdRutina]) {
                acc[row.IdRutina] = {
                    IdRutina: row.IdRutina,
                    NombreRutina: row.NombreRutina,
                    EstadoRutina: row.EstadoRutina,
                    DiasSemana: {}
                };
            }

            // Si el día de la semana aún no está en el objeto de días de la semana, inicializarlo como un array
            if (!acc[row.IdRutina].DiasSemana[row.DiaSemana]) {
                acc[row.IdRutina].DiasSemana[row.DiaSemana] = [];
            }

            // Agregar el ejercicio, su descripción, las repeticiones y las series al día de la semana correspondiente
            acc[row.IdRutina].DiasSemana[row.DiaSemana].push({
                NombreEjercicio: row.NombreEjercicio,
                DescripcionEjercicio: row.DescripcionEjercicio,
                RepeticionesEjercicio: row.RepeticionesEjercicio,  // Nuevo campo agregado
                Series: row.Series
            });

            return acc;
        }, {});

        // Convertir el objeto acumulador a un array para la respuesta
        const rutinas = Object.values(rutinaConDetalles);

        // Enviar la respuesta
        res.json(rutinas);
    } catch (error) {
        console.error('Error al obtener la rutina completa del usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

