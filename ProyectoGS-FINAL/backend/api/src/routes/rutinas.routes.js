import { Router } from 'express'; // para crear y agrupar todas las rutas
import { validarJWT } from '../middlewares/validar-jwt.js';
import { getRutinas, createRutinas, 
    getRutina, updateRutina, deleteRutina, 
    getRutinaDetallada, getUsuarios, getRutinaCompletaPorUsuario, eliminarEjercicioDeRutina  } from '../controllers/rutinas.controller.js';

const router = Router();

router.get('/rutinas', validarJWT, getRutinas);
router.get('/rutinas/:IdRutina', validarJWT, getRutina); 
router.post('/rutinas', validarJWT, createRutinas);
router.put('/rutinas/:IdRutina', validarJWT, updateRutina); 
router.delete('/rutinas/:IdRutina', validarJWT, deleteRutina);
router.get('/rutinas/:IdRutina/detallada', validarJWT, getRutinaDetallada);
//router.delete('/rutinas/:IdRutina/ejercicios', validarJWT, deleteEjerciciosDeRutina); 

// Nueva ruta para obtener los usuarios
router.get('/usuariosRutina',getUsuarios)

router.delete('/rutinas/:IdRutina/ejercicios/:IdEjercicio/:DiaSemana', eliminarEjercicioDeRutina);

// Nueva ruta para obtener la rutina completa del usuario
router.get('/rutinas/completa/:IdUsuario', getRutinaCompletaPorUsuario);

export default router;
