import { Router } from "express";
import { deleteServicio, getServicios, postServicio, putServicio, getServicio } from "../controllers/Servicios.js";

const router = Router();

router.get('/servicios/ping', (req, res) => res.send('pong'));

router.get('/servicios', getServicios);

router.get('/servicios/:id', getServicio);

router.post('/servicios', postServicio);

router.put('/servicios/:id', putServicio);

router.delete('/servicios/:id', deleteServicio);

export default router;
