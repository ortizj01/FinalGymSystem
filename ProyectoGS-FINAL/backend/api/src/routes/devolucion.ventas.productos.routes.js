import { Router } from "express";
import { getDevolucionVentasProducto, postDevolucionVentasProducto, putDevolucionVentasProducto, deleteDevolucionVentasProducto } from '../controllers/devolucion.ventas.productos.comtroller.js';

const router = Router();

router.get('/devolucionventasproducto', getDevolucionVentasProducto);
//router.get('/devolucionventasproducto/:id', getDevolucionVentaProducto);
router.post('/devolucionventasproducto', postDevolucionVentasProducto);
router.patch('/devolucionventasproducto/:id', putDevolucionVentasProducto);
router.delete('/devolucionventasproducto/:id', deleteDevolucionVentasProducto);

export default router;
