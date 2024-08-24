import { Router } from "express";
import { getPedidos, getPedidoById, createPedido, updatePedido, deletePedido, updatePedidoEstadoFecha, getPedidosPorUsuarioCompleto  } from "../controllers/pedidos.controller.js";

const router = Router();

router.get('/pedidos', getPedidos);
router.get('/pedidos/:id', getPedidoById);
router.post('/pedidos', createPedido);
router.put('/pedidos/:id', updatePedido);
router.put('/pedidos/estado-fecha/:id', updatePedidoEstadoFecha);
router.delete('/pedidos/:id', deletePedido);
// Ruta para obtener los pedidos por ID de usuario
router.get('/pedido/usuario/:IdUsuario', getPedidosPorUsuarioCompleto);




export default router;
