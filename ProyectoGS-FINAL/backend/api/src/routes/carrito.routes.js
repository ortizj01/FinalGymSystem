import { Router } from "express";
import { getItemCatalogo, updateItemCatalogo, getItemsCatalogo } from '../controllers/carrito.controllers.js';

const router = Router();

// Ruta para obtener el estado de un producto en el catálogo
router.get('/carrito/catalogo/producto/:IdProducto', (req, res) => getItemCatalogo(req, res, 'producto'));

// Ruta para obtener el estado de una membresía en el catálogo
router.get('/carrito/catalogo/membresia/:IdMembresia', (req, res) => getItemCatalogo(req, res, 'membresia'));

// Ruta para actualizar el estado de un producto en el catálogo
router.patch('/carrito/catalogo/producto/:IdProducto', (req, res) => updateItemCatalogo(req, res, 'producto'));

// Ruta para actualizar el estado de una membresía en el catálogo
router.patch('/carrito/catalogo/membresia/:IdMembresia', (req, res) => updateItemCatalogo(req, res, 'membresia'));

// Ruta opcional para obtener todos los productos y membresías en el catálogo (si la función existe)
router.get('/carrito/catalogo', getItemsCatalogo);

export default router;
