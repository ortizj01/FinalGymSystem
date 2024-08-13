import { pool } from '../db.js';

export const getEventos = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT E.*, S.NombreClase AS NombreServicio, U.Nombres AS NombreUsuario
            FROM Eventos E
            LEFT JOIN Servicios S ON E.IdServicio = S.IdServicio
            LEFT JOIN Usuarios U ON E.IdUsuario = U.IdUsuario
        `);

        const eventos = rows.map(evento => {
            // Verificar si FechaInicio y FechaFin son objetos Date válidos
            if (!(evento.FechaInicio instanceof Date) || !(evento.FechaFin instanceof Date)) {
                console.error('Fecha de inicio o fin no válida:', evento);
                return null; // O manejar el error adecuadamente
            }

            // Obtener las cadenas de fecha y hora en formato ISO 8601 combinado con HoraInicio y HoraFin
            const start = new Date(`${evento.FechaInicio.toISOString().slice(0, 10)}T${evento.HoraInicio}`).toISOString();
            const end = new Date(`${evento.FechaFin.toISOString().slice(0, 10)}T${evento.HoraFin}`).toISOString();

            return {
                id: evento.IdEvento,
                title: evento.NombreServicio, // Alias definido en la consulta SQL
                start: start,
                end: end,
                description: evento.DescripcionEvento,
                isActive: evento.EstadoAgenda === 1 ? true : false, // Convertir a booleano
                serviceId: evento.IdServicio,
                employeeId: evento.IdUsuario,
                serviceName: evento.NombreServicio,
                employeeName: evento.NombreUsuario
            };
        }).filter(evento => evento !== null); // Filtrar eventos inválidos

        res.json(eventos);
    } catch (error) {
        console.error('Error al obtener eventos:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};



export const getEvento = async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM Eventos WHERE IdEvento = ?', [req.params.IdEvento])
    
    if (rows.length <= 0) {
        return res.status(400).json({
            message: 'Evento no encontrado'
        });
    }

    res.json(rows[0]);
};


export const createEventos = async (req, res) => {
    const { FechaInicio, FechaFin, HoraInicio, HoraFin, DescripcionEvento, EstadoAgenda, IdServicio, IdUsuario } = req.body;
    
    // Asegurarse de que FechaInicio y FechaFin sean objetos Date válidos
    const startDateTime = new Date(FechaInicio);
    const endDateTime = new Date(FechaFin);

    const [rows] = await pool.query('INSERT INTO Eventos (FechaInicio, FechaFin, HoraInicio, HoraFin, DescripcionEvento, EstadoAgenda, IdServicio, IdUsuario) VALUES (?,?,?,?,?,?,?,?)',
    [startDateTime, endDateTime, HoraInicio, HoraFin, DescripcionEvento, EstadoAgenda, IdServicio, IdUsuario]);

    res.send({
        id: rows.insertId,
        FechaInicio: startDateTime.toISOString(),  // Enviar de vuelta en formato ISO 8601
        FechaFin: endDateTime.toISOString(),      // Enviar de vuelta en formato ISO 8601
        HoraInicio,
        HoraFin,
        DescripcionEvento,
        EstadoAgenda,
        IdServicio,
        IdUsuario
    });
}


export const deleteEvento = async (req, res) => {
    const [result] = await pool.query('DELETE FROM Eventos WHERE IdEvento = ?', [req.params.IdEvento])

    if (result.affectedRows <= 0) return res.status(404).json({
        message: 'Evento no encontrado'
    })
    
    res.sendStatus(204)
}


export const updateEventos = async (req, res) => {
    const {IdEvento} = req.params
    const {FechaInicio, FechaFin, HoraInicio, HoraFin, DescripcionEvento, EstadoAgenda, IdServicio, IdUsuario} = req.body

    const startDateTime = new Date(FechaInicio);
    const endDateTime = new Date(FechaFin);

    const [result] = await pool.query(
        'UPDATE Eventos SET FechaInicio = ?, FechaFin = ?, HoraInicio = ?, HoraFin = ?, DescripcionEvento = ?, IdServicio = ?, IdUsuario = ? WHERE IdEvento = ?',
        [startDateTime, endDateTime, HoraInicio, HoraFin, DescripcionEvento, IdServicio, IdUsuario, IdEvento]
    );
    
    if(result.affectedRows === 0 )return res.status(404).json({
        message: 'Evento no encontrado'
    })

    const [rows] = await pool.query('SELECT * FROM Eventos WHERE IdEvento = ?', [IdEvento])

    res.json(rows[0])
}

// Nuevo: Obtener servicios
export const getServicios = async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM Servicios');
    res.json(rows);
};

// Nuevo: Obtener entrenadores (usuarios con rol de id 2)
export const getEntrenadores = async (req, res) => {
    const [rows] = await pool.query(
        `SELECT U.* 
         FROM Usuarios U
         JOIN RolUsuario RU ON U.IdUsuario = RU.IdUsuario
         WHERE RU.IdRol = 2`
    );
    res.json(rows);
};