import { pool } from '../db.js';


export const getMembresiaServicio = async (req, res) => {
    const { IdMembresia } = req.params; // Captura IdMembresia desde los parámetros de la URL

    try {
        const query = `
            SELECT 
                ms.IdMembresiasServicios,
                m.IdMembresia, 
                m.NombreMembresia,
                ms.IdServicio,
                s.NombreClase
            FROM
                Membresias m
            INNER JOIN
                MembresiasServicios ms ON m.IdMembresia = ms.IdMembresia
            INNER JOIN
                Servicios s ON ms.IdServicio = s.IdServicio
            WHERE 
                m.IdMembresia = ?
            ORDER BY 
                m.IdMembresia;
        `;
        
        const [rows] = await pool.query(query, [IdMembresia]); // Pasa IdMembresia como parámetro

        if (rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron servicios para esta membresía' });
        }

        res.json(rows);
    } catch (error) {
        console.error('Error al obtener servicios de la membresía:', error.message);
        res.status(500).json({ message: 'Error al obtener servicios de la membresía' });
    }
};


export const postServicioDeMembresia = async (req, res) => {
    const { IdMembresia } = req.params; // Captura IdMembresia desde los parámetros de la URL
    const { IdServicios } = req.body; // Captura arreglo de Ids de servicios desde el cuerpo de la solicitud
    
    // Verifica que IdServicios sea un arreglo y contenga al menos un elemento
    if (!Array.isArray(IdServicios) || IdServicios.length === 0) {
        return res.status(400).json({ message: 'IdServicios debe ser un arreglo no vacío' });
    }
    
    // Obtener una conexión del pool
    const connection = await pool.getConnection();
    
    try {
        // Iniciar la transacción
        await connection.beginTransaction();

        console.log('IdMembresia recibida:', IdMembresia);
        console.log('IdServicios recibidos:', IdServicios);

        // Verificar si la membresía existe
        const [membresiaRows] = await connection.query('SELECT * FROM Membresias WHERE IdMembresia = ?', [IdMembresia]);
        
        if (membresiaRows.length === 0) {
            await connection.rollback(); // Revertir transacción si la membresía no existe
            return res.status(404).json({ message: 'La membresía no existe' });
        }
        
        // Verificar si los servicios existen y no están ya asociados a la membresía
        for (const IdServicio of IdServicios) {
            const [servicioRows] = await connection.query('SELECT * FROM Servicios WHERE IdServicio = ?', [IdServicio]);
            if (servicioRows.length === 0) {
                await connection.rollback(); // Revertir transacción si un servicio no existe
                return res.status(404).json({ message: `El servicio con Id ${IdServicio} no existe` });
            }
            
            const [existingRows] = await connection.query('SELECT * FROM MembresiasServicios WHERE IdMembresia = ? AND IdServicio = ?', [IdMembresia, IdServicio]);
            if (existingRows.length > 0) {
                await connection.rollback(); // Revertir transacción si un servicio ya está asociado a la membresía
                return res.status(400).json({ message: `El servicio con Id ${IdServicio} ya está asociado a esta membresía` });
            }
        }
        
        // Insertar todas las asociaciones en MembresiasServicios
        const insertPromises = IdServicios.map(IdServicio =>
            connection.query('INSERT INTO MembresiasServicios (IdMembresia, IdServicio) VALUES (?, ?)', [IdMembresia, IdServicio])
        );

        await Promise.all(insertPromises); // Esperar a que todas las inserciones se completen correctamente

        // Commit la transacción si todo fue exitoso
        await connection.commit();
        
        res.status(201).json({
            IdMembresia: IdMembresia,
            IdServicios: IdServicios
        });
    } catch (error) {
        console.error('Error al asociar servicio a membresía:', error.message);
        await connection.rollback(); // Revertir transacción en caso de error
        res.status(500).json({ message: 'Error al asociar servicio a membresía' });
    } finally {
        connection.release(); // Liberar conexión al finalizar
    }
};


export const deleteDetalleDeMembresia = async (req, res) => {
    const { id } = req.params; // Captura IdMembresiasServicios desde los parámetros de la URL

    try {
        const [existingRows] = await pool.query('SELECT * FROM MembresiasServicios WHERE IdMembresiasServicios = ?', [id]);

        if (existingRows.length === 0) {
            return res.status(404).json({ message: 'Detalle de membresía no encontrado' });
        }

        await pool.query('DELETE FROM MembresiasServicios WHERE IdMembresiasServicios = ?', [id]);

        res.sendStatus(204);
    } catch (error) {
        console.error('Error al eliminar detalle de membresía:', error.message);
        res.status(500).json({ message: 'Error al eliminar detalle de membresía' });
    }
};


export const putMembresiaServicio = async (req, res) => {
    const { IdMembresia, id } = req.params;
    const { IdServicio } = req.body;

    try {
        // Verificar si el servicio ya está asociado a la membresía
        const [existingRows] = await pool.query('SELECT * FROM MembresiasServicios WHERE IdMembresia = ? AND IdServicio = ?', [IdMembresia, IdServicio]);

        if (existingRows.length > 0) {
            return res.status(400).json({ message: 'El servicio ya está asociado a esta membresía' });
        }

        // Actualizar el detalle de membresía
        await pool.query('UPDATE MembresiasServicios SET IdServicio = ? WHERE IdMembresiasServicios = ?', [IdServicio, id]);

        res.status(200).json({
            IdMembresia: IdMembresia,
            IdMembresiasServicios: id,
            IdServicio: IdServicio
        });
    } catch (error) {
        console.error('Error al actualizar detalle de membresía:', error.message);
        res.status(500).json({ message: 'Error al actualizar detalle de membresía' });
    }
};
