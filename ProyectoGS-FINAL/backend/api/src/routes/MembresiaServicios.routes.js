import { Router } from "express";
import {
    getMembresiaServicio,
    postServicioDeMembresia,
    deleteDetalleDeMembresia,
    putMembresiaServicio
} from "../controllers/DetalleMembresiaServicio.js";

const router = Router();

// Ruta de prueba para verificar el estado del servidor
router.get('/ping', (req, res) => res.send('pong'));


// Ruta para obtener un detalle específico de membresía y servicio por su ID
router.get('/membresias-servicios/:IdMembresia', getMembresiaServicio);

// Ruta para crear un nuevo detalle de membresía y servicio
router.post('/membresias-servicios/:IdMembresia', postServicioDeMembresia);

// Ruta para actualizar un detalle de membresía y servicio por su ID
router.put('/membresias-servicios/:IdMembresia/:id', putMembresiaServicio);

// Ruta para eliminar un detalle de membresía y servicio por su ID
router.delete('/membresias-servicios/:id', deleteDetalleDeMembresia);

// Exportar el router configurado
export default router;
