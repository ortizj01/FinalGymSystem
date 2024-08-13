import { Router } from 'express';
import {
    getPermisoRoles,
    getPermisoRolesPorRol,
    upsertPermisoRoles,
    getPermisoRol,
    updatePermisoRol,
    deletePermisoRol,
    getPermisoRolesPrincipal
} from '../controllers/detallePermisosRoles.controller.js';

const router = Router();

// Obtener todos los permisos asignados a roles
router.get('/permisoRolesDetalle', getPermisoRoles);

// Obtener permisos asignados a un rol específico (a través de un parámetro de consulta)
router.get('/permisoRolesDetalle/rol', getPermisoRolesPorRol);

router.get('/permisoRolesDetallePrincipal/:IdRol', getPermisoRolesPrincipal);

// Crear o actualizar permisos de rol
router.post('/permisoRolesDetalle', upsertPermisoRoles);

// Obtener un permiso rol específico por ID
router.get('/permisoRolesDetalle/:IdPermisoRol', getPermisoRol);

// Actualizar un permiso rol existente
router.put('/permisoRolesDetalle/:IdPermisoRol', updatePermisoRol);

// Eliminar un permiso rol
router.delete('/permisoRolesDetalle/:IdPermisoRol', deletePermisoRol);

export default router;