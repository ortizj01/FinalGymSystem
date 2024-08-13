import { Router } from 'express';
import { getVentasMembresia, getVentaMembresia, postVentasMembresia, deleteVentasMembresia, putVentasMembresia } from '../controllers/ventas.membresia.controller.js';

const router = Router();

router.get('/ventas/:id/membresias', getVentasMembresia);
router.get('/ventasMembresia/:id', getVentaMembresia);
router.post('/ventas/membresias', postVentasMembresia);
router.patch('/ventas/membresias/:id', putVentasMembresia);
router.delete('/ventas/membresias/:id', deleteVentasMembresia);

export default router;
