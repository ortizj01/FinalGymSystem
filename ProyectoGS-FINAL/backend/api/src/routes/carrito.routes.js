// routes/carrito.routes.js

import { Router } from "express";
import { getProductoCatalogo, updateProductoCatalogo, getProductosCatalogo  } from '../controllers/carrito.controllers.js';

const router = Router();

// Ruta para obtener el estado de un producto específico en el catálogo
router.get('/carrito/catalogo/:IdProducto', getProductoCatalogo);
router.get('/carrito/catalogo', getProductosCatalogo);

// Ruta para actualizar el estado de un producto en el catálogo
router.patch('/carrito/catalogo/:IdProducto', updateProductoCatalogo);

export default router;
