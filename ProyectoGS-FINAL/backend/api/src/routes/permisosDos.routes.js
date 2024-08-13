import { Router } from 'express';
import {
    getPermisos,
    getPermiso,
    createPermiso,
    updatePermiso,
    deletePermiso
} from '../controllers/permisosDos.controller.js';

const router = Router();

router.get('/permisosDos', getPermisos);
router.get('/permisosDos/:IdPermiso', getPermiso);
router.post('/permisosDos', createPermiso);
router.put('/permisosDos/:IdPermiso', updatePermiso);
router.delete('/permisosDos/:IdPermiso', deletePermiso);

export default router;
