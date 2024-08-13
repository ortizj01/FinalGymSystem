import { Router } from 'express';
import { assignRole } from '../controllers/rolCliente.controller.js';

const router = Router();

router.post('/assign-role', assignRole);

export default router;
