import { Router } from "express";
import { getPedidosMembresia, getPedidoMembresiaById, createPedidoMembresia, updatePedidoMembresia, deletePedidoMembresia } from "../controllers/pedidosMembresia.controller.js";

const router = Router();

router.get('/pedidosMembresia', getPedidosMembresia);
router.get('/pedidosMembresia/:id', getPedidoMembresiaById);
router.post('/pedidosMembresia', createPedidoMembresia);
router.put('/pedidosMembresia/:id', updatePedidoMembresia);
router.delete('/pedidosMembresia/:id', deletePedidoMembresia);

export default router;