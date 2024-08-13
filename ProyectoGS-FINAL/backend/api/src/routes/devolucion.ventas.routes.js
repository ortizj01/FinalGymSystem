import { Router } from "express";
import { getDevolucionVentas, postDevolucionVentas, putDevolucionVentas, deleteDevolucionVentas, getDevolucionVenta } from '../controllers/devolucion.ventas.controller.js';

const router = Router();

router.get('/devolucionventas', getDevolucionVentas);
router.get('/devolucionventas/:id', getDevolucionVenta);
router.post('/devolucionventas', postDevolucionVentas);
router.patch('/devolucionventas/:id', putDevolucionVentas);
router.delete('/devolucionventas/:id', deleteDevolucionVentas);

export default router;
