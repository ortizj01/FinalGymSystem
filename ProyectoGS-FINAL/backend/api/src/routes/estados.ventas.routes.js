import { Router } from 'express';
import { getEstadosVentas } from '../controllers/estado.venta.controller.js';

const router = Router();

router.get('/estadosVentas', getEstadosVentas);

export default router;
