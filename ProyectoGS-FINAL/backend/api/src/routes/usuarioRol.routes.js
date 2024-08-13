import { Router } from 'express';
import { getUsuarioRolById, agregarRolAUsuario, eliminarRolDeUsuario, getRolesDeUsuario } from '../controllers/usuarioRol.controller.js';

const router = Router();

// Ruta para obtener usuario por su Id junto con los roles asignados
router.get('/usuariosRol/:IdUsuario', getUsuarioRolById);

// Ruta para obtener los roles de un usuario específico
router.get('/usuariosRol/:IdUsuario/roles', getRolesDeUsuario);

// Ruta para asignar un rol a un usuario
router.post('/usuariosRol/:IdUsuario/roles', agregarRolAUsuario);

// Ruta para eliminar un rol de un usuario
router.delete('/usuariosRol/roles/:IdRolUsuario', eliminarRolDeUsuario);

export default router;
