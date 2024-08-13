import { Router } from 'express';
import { getVentasProducto, getVentaProducto, postVentasProducto, deleteVentasProducto, putVentasProducto } from '../controllers/ventas.productos.controller.js';

const router = Router();

router.get('/ventas/:id/productos', getVentasProducto);
router.get('/ventasProducto/:id', getVentaProducto);
router.post('/ventas/productos', postVentasProducto);
router.patch('/ventas/productos/:id', putVentasProducto);
router.delete('/ventas/productos/:id', deleteVentasProducto);

export default router;
