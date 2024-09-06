import { Router } from 'express';
import { getEstadosPedidos } from '../controllers/estadoPedidos.controller.js';

const router = Router();

router.get('/estadosPedidos', getEstadosPedidos);

export default router;
