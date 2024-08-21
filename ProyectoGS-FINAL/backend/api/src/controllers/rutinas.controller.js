import { pool } from '../db.js';

//Traer todas las Rutinas
export const getRutinas = async (req, res) => {
    try {
        // Consulta para obtener las rutinas con sus detalles de días de la semana y nombres de ejercicios
        const query = `
            SELECT r.*, e.NombreEjercicio, reds.DiaSemana
            FROM Rutinas r
            LEFT JOIN RutinasEjercicios re ON r.IdRutina = re.IdRutina
            LEFT JOIN Ejercicios e ON re.IdEjercicio = e.IdEjercicio
            LEFT JOIN RutinasEjerciciosDiaSemana reds ON re.IdRutinaEjercicio = reds.IdRutinaEjercicio
        `;
        
        // Ejecutar la consulta
        const [rows] = await pool.query(query);

        // Crear un mapa para almacenar las rutinas y sus ejercicios por día de la semana
        const rutinasConDias = new Map();

        // Procesar los resultados
        rows.forEach(row => {
            // Si la rutina aún no está en el mapa, inicializarla
            if (!rutinasConDias.has(row.IdRutina)) {
                rutinasConDias.set(row.IdRutina, {
                    IdRutina: row.IdRutina,
                    NombreRutina: row.NombreRutina,
                    EstadoRutina: row.EstadoRutina,
                    IdUsuario: row.IdUsuario,
                    DiasSemana: {} // Inicializar un objeto para almacenar los ejercicios por día de la semana
                });
            }

            // Si el día de la semana aún no está asociado con la rutina, inicializarlo como un array vacío
            if (!rutinasConDias.get(row.IdRutina).DiasSemana[row.DiaSemana]) {
                rutinasConDias.get(row.IdRutina).DiasSemana[row.DiaSemana] = [];
            }

            // Agregar el ejercicio al día de la semana correspondiente
            rutinasConDias.get(row.IdRutina).DiasSemana[row.DiaSemana].push({
                IdEjercicio: row.IdEjercicio,
                NombreEjercicio: row.NombreEjercicio
            });
        });

        // Convertir el mapa de rutinas a un array para la respuesta
        const rutinas = Array.from(rutinasConDias.values());

        // Enviar la respuesta
        res.json(rutinas);
    } catch (error) {
        console.error('Error al obtener las rutinas con los días asignados:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Traer los detalles de una Rutina con sus ejercicios asociados
export const getRutina = async (req, res) => {
    try {
        // Consulta para obtener los detalles de la rutina y los ejercicios asociados, incluyendo las series
        const query = `
            SELECT r.*, re.*, reds.DiaSemana, reds.Series, e.NombreEjercicio
            FROM Rutinas r
            LEFT JOIN RutinasEjercicios re ON r.IdRutina = re.IdRutina
            LEFT JOIN RutinasEjerciciosDiaSemana reds ON re.IdRutinaEjercicio = reds.IdRutinaEjercicio
            LEFT JOIN Ejercicios e ON re.IdEjercicio = e.IdEjercicio
            WHERE r.IdRutina = ?
        `;
        
        // Ejecutar la consulta
        const [rows] = await pool.query(query, [req.params.IdRutina]);

        // Verificar si se encontraron resultados
        if (rows.length <= 0) {
            return res.status(400).json({ message: 'Rutina no encontrada' });
        }

        // Construir el objeto de respuesta que incluye los detalles de la rutina, los ejercicios asociados y las series
        const rutina = {
            IdRutina: rows[0].IdRutina,
            NombreRutina: rows[0].NombreRutina,
            EstadoRutina: rows[0].EstadoRutina,
            IdUsuario: rows[0].IdUsuario,
            Ejercicios: rows.map(row => ({
                IdEjercicio: row.IdEjercicio,
                NombreEjercicio: row.NombreEjercicio,
                DiaSemana: row.DiaSemana,
                Series: row.Series // Incluir el campo Series
            }))
        };

        // Enviar la respuesta
        res.json(rutina);
    } catch (error) {
        console.error('Error al obtener la rutina con los detalles de los ejercicios:', error);
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
    const [result] = await pool.query('UPDATE Rutinas SET NombreRutina = IFNULL(?, NombreRutina), EstadoRutina = IFNULL(?, EstadoRutina), IdUsuario = IFNULL(?, IdUsuario) WHERE IdRutina = ?',
        [NombreRutina, EstadoRutina, IdUsuario, IdRutina]);
    if(result.affectedRows === 0 ) return res.status(404).json({ message: 'Rutina no encontrada' });
    const [rows] = await pool.query('SELECT * FROM Rutinas WHERE IdRutina = ?', [IdRutina]);
    res.json(rows[0]);
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


// Nueva función para obtener los usuarios
export const getUsuarios = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT IdUsuario, Nombres FROM Usuarios');
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


export const getRutinaCompletaPorUsuario = async (req, res) => {
    const { IdUsuario } = req.params;

    // Consulta SQL para obtener los detalles de la rutina, incluyendo días de la semana, ejercicios, series y descripción del ejercicio
    const query = `
        SELECT 
            r.IdRutina,
            r.NombreRutina,
            r.EstadoRutina,
            reds.DiaSemana,
            e.NombreEjercicio,
            e.DescripcionEjercicio,
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

            // Agregar el ejercicio, su descripción y las series al día de la semana correspondiente
            acc[row.IdRutina].DiasSemana[row.DiaSemana].push({
                NombreEjercicio: row.NombreEjercicio,
                DescripcionEjercicio: row.DescripcionEjercicio,
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

