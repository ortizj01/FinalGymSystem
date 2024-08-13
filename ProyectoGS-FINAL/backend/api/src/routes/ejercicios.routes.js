import { Router } from 'express'; //para crear y agrupar todas la rutas
import { getEjercicios, createEjercicios, updateEjercicios, 
deleteEjercicio, getEjercicio, } from '../controllers/ejercicios.controller.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { rolAdmin, tieneRol } from '../middlewares/validar-roles.js';

const router = Router()

router.get('/ejercicios',
    getEjercicios)
router.get('/ejercicios/:IdEjercicio', 
    getEjercicio
)
router.post('/ejercicios', createEjercicios)
router.put('/ejercicios/:IdEjercicio', updateEjercicios)
router.delete('/ejercicios/:IdEjercicio', deleteEjercicio)

export default router