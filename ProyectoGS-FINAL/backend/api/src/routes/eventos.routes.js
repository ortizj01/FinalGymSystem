import { Router } from 'express';
import { validarJWT } from '../middlewares/validar-jwt.js';
import {
  getEventos,
  createEventos,
  updateEventos,
  deleteEvento,
  getEvento,
  getServicios,
  getEntrenadores,
} from '../controllers/eventos.contoller.js';

const router = Router();

// Middleware validarJWT debe estar antes de las rutas protegidas
router.get('/eventos', validarJWT, getEventos);
router.get('/eventos/:IdEvento', validarJWT, getEvento);
router.post('/eventos', validarJWT, createEventos);
router.put('/eventos/:IdEvento', validarJWT, updateEventos);
router.delete('/evento/:IdEvento', validarJWT, deleteEvento);

// Rutas públicas
router.get('/serviciosEventos', getServicios);
router.get('/entrenadores', getEntrenadores);

export default router;
