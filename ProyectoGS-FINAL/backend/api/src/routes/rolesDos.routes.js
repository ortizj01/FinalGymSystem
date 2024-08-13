import { Router } from 'express';
import {
    getRoles,
    getRol,
    createRol,
    updateRol,
    changeRolState,
    deleteRol
} from '../controllers/rolesDos.controllers.js';

const router = Router();

router.get('/rolesDos', getRoles);
router.get('/rolesDos/:IdRol', getRol);
router.post('/rolesDos', createRol);
router.put('/rolesDos/:IdRol', updateRol);
// router.patch('/rolesDos/:IdRol/state', changeRolState);
// router.delete('/rolesDos/:IdRol', deleteRol);

export default router;
