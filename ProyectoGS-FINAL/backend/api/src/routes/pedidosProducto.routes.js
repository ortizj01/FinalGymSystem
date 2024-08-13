import { Router } from "express";
import { getPedidosProducto, getPedidoProductoById, createPedidoProducto, updatePedidoProducto, deletePedidoProducto, getProductosByPedidoId } from "../controllers/pedidosProducto.controller.js";

const router = Router();

router.get('/pedidosProducto', getPedidosProducto);
router.get('/pedidosProducto/:id', getPedidoProductoById);
router.post('/pedidosProducto', createPedidoProducto);
router.put('/pedidosProducto/:id', updatePedidoProducto);
router.delete('/pedidosProducto/:id', deletePedidoProducto);
router.get('/pedidos/:IdPedido/productos', getProductosByPedidoId); // Ruta para obtener productos por IdPedido

export default router;
