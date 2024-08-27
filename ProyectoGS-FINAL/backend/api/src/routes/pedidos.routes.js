import { Router } from "express";
import { getPedidos,actualizarEstadoPedido, getPedidoById,cancelarPedido, createPedido, updatePedido, deletePedido, getPedidosPorUsuarioCompleto } from "../controllers/pedidos.controller.js";

const router = Router();

router.get('/pedidos', getPedidos);
router.get('/pedidos/:id', getPedidoById);
router.post('/pedidos', createPedido);
router.put('/pedidos/:id', updatePedido);
router.delete('/pedidos/:id', deletePedido);
// Ruta para obtener los pedidos por ID de usuario
router.get('/pedido/usuario/:IdUsuario', getPedidosPorUsuarioCompleto);
router.put('/pedidos/cancelar/:id', cancelarPedido);
router.put('/pedidos/estado/:id', actualizarEstadoPedido);







export default router;
