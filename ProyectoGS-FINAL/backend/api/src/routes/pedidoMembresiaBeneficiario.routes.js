import { Router } from 'express';
import { createPedidoMembresiaBeneficiario } from '../controllers/pedidoMembresiaBeneficiario.controllers.js';

const router = Router();

router.post('/pedidoMembresiaBeneficiario', createPedidoMembresiaBeneficiario);

export default router;
