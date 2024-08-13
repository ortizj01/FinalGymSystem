import { Router } from "express";
import { deleteMembresia, getMembresias, postMembresia, putMembresia, getMembresia } from "../controllers/Membresias.js";

const router = Router();

router.get('/membresias/ping', (req, res) => res.send('pong'));

router.get('/membresias', getMembresias);

router.get('/membresias/:id', getMembresia);

router.post('/membresias', postMembresia);

router.put('/membresias/:id', putMembresia);

router.delete('/membresias/:id', deleteMembresia);

export default router;
