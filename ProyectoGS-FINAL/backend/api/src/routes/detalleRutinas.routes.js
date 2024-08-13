import { Router } from 'express';
import { 
    getEjerciciosDeRutina, agregarEjercicioARutina, eliminarEjercicioDeRutina, 
    getDetallesDeRutinaPorDiaSemana, agregarEjercicioARutinaPorDiaSemana, 
    eliminarEjercicioDeRutinaPorDiaSemana,
    actualizarEjercicioDeRutina,
    actualizarEjercicioDeRutinaPorDiaSemana
} from '../controllers/detalleRutinas.controller.js';

const router = Router();

router.get('/rutinas/:IdRutina/ejercicios', getEjerciciosDeRutina);
router.post('/rutinas/:IdRutina/ejercicios', agregarEjercicioARutina);
router.put('/rutinas/:IdRutina/ejercicios', actualizarEjercicioDeRutina); // Ruta para actualizar el ejercicio de la rutina
router.delete('/rutinas/ejercicios/:IdRutinaEjercicio', eliminarEjercicioDeRutina);
router.get('/rutinas/:IdRutina/detalles', getDetallesDeRutinaPorDiaSemana);
router.post('/rutinas/:IdRutina/ejercicios/:IdRutinaEjercicio/detalles', agregarEjercicioARutinaPorDiaSemana); 
router.put('/rutinas/:IdRutina/ejercicios/:IdRutinaEjercicio/detalles', actualizarEjercicioDeRutinaPorDiaSemana); // Ruta para actualizar el detalle del ejercicio de la rutina por día de la semana
router.delete('/rutinas/detalles/:IdRutinaEjercicioDiaSemana', eliminarEjercicioDeRutinaPorDiaSemana);

export default router;
