import { pool } from '../db.js';

// Obtener el estado del elemento (producto o membresía) en el catálogo
export const getItemCatalogo = async (req, res, tipo) => {
    let query = '';
    let id = '';

    if (tipo === 'producto') {
        query = 'SELECT en_catalogo FROM Catalogo WHERE IdProducto = ?';
        id = req.params.IdProducto;
    } else if (tipo === 'membresia') {
        query = 'SELECT en_catalogo FROM Catalogo WHERE IdMembresia = ?';
        id = req.params.IdMembresia;
    }

    try {
        const [rows] = await pool.query(query, [id]);

        if (rows.length === 0) {
            return res.json({ en_catalogo: false });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error(`Error al obtener ${tipo} en el catálogo:`, error);
        res.status(500).json({ message: `Error al obtener ${tipo} en el catálogo` });
    }
};

// Validar existencia en catálogo antes de insertar o actualizar
export const updateItemCatalogo = async (req, res, tipo) => {
    let queryInsert = '';
    let queryDelete = '';
    let queryCheckExistence = '';
    let id = '';

    if (tipo === 'producto') {
        queryInsert = `
            INSERT INTO Catalogo (IdProducto, en_catalogo)
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE en_catalogo = VALUES(en_catalogo)
        `;
        queryDelete = 'DELETE FROM Catalogo WHERE IdProducto = ?';
        queryCheckExistence = 'SELECT COUNT(*) as count FROM Catalogo WHERE IdProducto = ?';
        id = req.params.IdProducto;
    } else if (tipo === 'membresia') {
        queryInsert = `
            INSERT INTO Catalogo (IdMembresia, en_catalogo)
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE en_catalogo = VALUES(en_catalogo)
        `;
        queryDelete = 'DELETE FROM Catalogo WHERE IdMembresia = ?';
        queryCheckExistence = 'SELECT COUNT(*) as count FROM Catalogo WHERE IdMembresia = ?';
        id = req.params.IdMembresia;
    }

    try {
        // Validar si el producto o membresía ya existe en el catálogo
        const [rows] = await pool.query(queryCheckExistence, [id]);

        if (rows[0].count > 0 && req.body.en_catalogo) {
            return res.status(400).json({ message: `El ${tipo} ya está en el catálogo` });
        }

        // Insertar o actualizar el producto o membresía en el catálogo
        if (req.body.en_catalogo) {
            await pool.query(queryInsert, [id, req.body.en_catalogo]);
        } else {
            await pool.query(queryDelete, [id]);
        }

        res.json({ message: `${tipo.charAt(0).toUpperCase() + tipo.slice(1)} actualizado en el catálogo` });
    } catch (error) {
        console.error(`Error al actualizar ${tipo} en el catálogo:`, error);
        res.status(500).json({ message: `Error al actualizar ${tipo} en el catálogo` });
    }
};

// (Opción adicional si tienes esta función)
// Obtener todos los productos y membresías en el catálogo (opcional)
export const getItemsCatalogo = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                p.IdProducto, p.NombreProducto, p.PrecioProducto, p.Stock, p.Imagen, 'producto' as tipo 
            FROM Catalogo c
            INNER JOIN Productos p ON c.IdProducto = p.IdProducto
            WHERE c.en_catalogo = true

            UNION ALL

            SELECT 
                m.IdMembresia, m.NombreMembresia as NombreProducto, m.CostoVenta as PrecioProducto, NULL as Stock, NULL as Imagen, 'membresia' as tipo 
            FROM Catalogo c
            INNER JOIN Membresias m ON c.IdMembresia = m.IdMembresia
            WHERE c.en_catalogo = true
        `);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron elementos en el catálogo' });
        }

        res.json(rows);
    } catch (error) {
        console.error('Error al obtener elementos del catálogo:', error);
        res.status(500).json({ message: 'Error al obtener elementos del catálogo' });
    }
};
