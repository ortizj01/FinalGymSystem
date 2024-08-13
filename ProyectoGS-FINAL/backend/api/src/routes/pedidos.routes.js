import { Router } from "express";
import { getPedidos, getPedidoById, createPedido, updatePedido, deletePedido, updatePedidoEstadoFecha, getPedidosByUsuarioId, getProductosByPedidoId, getPedidosPorCliente, getVentasPorCliente } from "../controllers/pedidos.controller.js";

const router = Router();

router.get('/pedidos', getPedidos);
router.get('/pedidos/:id', getPedidoById);
router.get('/pedidos/usuario/:IdUsuario', getPedidosByUsuarioId); // Ruta para obtener pedidos por IdUsuario
router.post('/pedidos', createPedido);
router.put('/pedidos/:id', updatePedido);
router.put('/pedidos/estado-fecha/:id', updatePedidoEstadoFecha);
router.delete('/pedidos/:id', deletePedido);
router.get('/pedidos/:IdPedido/productos', getProductosByPedidoId); // Ruta para obtener productos por IdPedido
router.get('/pedidos/cliente/:clienteId', getPedidosPorCliente);
router.get('/ventas/cliente/:clienteId', getVentasPorCliente);

export default router;
