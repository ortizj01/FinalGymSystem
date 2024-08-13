import { Router } from 'express';
import { getValoracionesMedicas, getValoracionMedicaById, getValoracionMedicaByUsuarioId, createValoracionMedica, updateValoracionMedica, deleteValoracionMedica } from '../controllers/valoracionMedica.controller.js';

const router = Router();

router.get('/valoracionesMedicas', getValoracionesMedicas);
router.get('/valoracionesMedicas/:id', getValoracionMedicaById);
router.get('/valoracionesMedicas/usuario/:id', getValoracionMedicaByUsuarioId); // Nueva ruta
router.post('/valoracionesMedicas', createValoracionMedica);
router.put('/valoracionesMedicas/:id', updateValoracionMedica);
router.delete('/valoracionesMedicas/:id', deleteValoracionMedica);

export default router;
