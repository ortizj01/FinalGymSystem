import { Router } from 'express'; //para crear y agrupar todas la rutas
import { getPermiso, crearPermiso, editarPermiso, eliminarPermiso } from '../controllers/permisos.controller.js';

const router = Router();

router.get('/permisos', getPermiso);
router.post('/permisos', crearPermiso);
router.put('/permisos/:IdPermiso', editarPermiso);
router.delete('/permisos/:IdPermiso', eliminarPermiso);

export default router;
