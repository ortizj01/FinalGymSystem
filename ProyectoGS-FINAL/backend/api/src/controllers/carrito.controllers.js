// controllers/carrito.controllers.js

import { pool } from '../db.js';

// Obtener el estado del producto en el catálogo
export const getProductoCatalogo = async (req, res) => {
    const { IdProducto } = req.params;
    try {
        const [rows] = await pool.query(`
            SELECT en_catalogo
            FROM carrito_gestion
            WHERE IdProducto = ?
        `, [IdProducto]);

        if (rows.length === 0) {
            // Si el producto no está en la tabla carrito_gestion, devolvemos un estado por defecto
            return res.json({ en_catalogo: false });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener producto en el catálogo:', error);
        res.status(500).json({ message: 'Error al obtener producto en el catálogo' });
    }
};

// Actualizar el estado de un producto en el catálogo
export const updateProductoCatalogo = async (req, res) => {
    const { IdProducto } = req.params;
    const { en_catalogo } = req.body;

    try {
        if (en_catalogo) {
            // Insertar o actualizar el estado del producto en la tabla carrito_gestion
            const [result] = await pool.query(`
                INSERT INTO carrito_gestion (IdProducto, en_catalogo)
                VALUES (?, ?)
                ON DUPLICATE KEY UPDATE en_catalogo = VALUES(en_catalogo)
            `, [IdProducto, en_catalogo]);
        } else {
            // Eliminar el producto de la tabla carrito_gestion si no está en catálogo
            const [result] = await pool.query(`
                DELETE FROM carrito_gestion
                WHERE IdProducto = ?
            `, [IdProducto]);
        }

        res.json({ message: 'Producto actualizado en el catálogo' });
    } catch (error) {
        console.error('Error al actualizar producto en el catálogo:', error);
        res.status(500).json({ message: 'Error al actualizar producto en el catálogo' });
    }
};

// Obtener productos que están en el catálogo
export const getProductosCatalogo = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT p.*, cg.en_catalogo
            FROM Productos p
            INNER JOIN carrito_gestion cg ON p.IdProducto = cg.IdProducto
            WHERE cg.en_catalogo = true
        `);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron productos en el catálogo' });
        }

        res.json(rows);
    } catch (error) {
        console.error('Error al obtener productos del catálogo:', error);
        res.status(500).json({ message: 'Error al obtener productos del catálogo' });
    }
};