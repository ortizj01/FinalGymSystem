import { Router } from 'express';
import { login, obtenerUsuarioAutenticado, logout, requestPasswordReset, resetPassword } from '../controllers/auth.controllers.js';

const router = Router();

router.post('/login', login);
router.get('/usuario-autenticado', obtenerUsuarioAutenticado);
router.post('/logout', logout);
router.post('/requestPasswordReset', requestPasswordReset); // Ruta para solicitar la recuperación de contraseña
router.post('/resetPassword/:token', resetPassword); // Ruta para restablecer la contraseña

export default router;
