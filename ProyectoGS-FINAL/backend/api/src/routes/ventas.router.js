import { Router } from "express";
import { getVentas, getVenta, postVenta, putVenta, cancelarVenta, getVentasProducto, getClientesYBeneficiarios } from '../controllers/ventas.controller.js';

const router = Router();

router.get('/ventas', getVentas);

router.get('/clientesBeneficiarios', getClientesYBeneficiarios);

router.get('/ventas/:id', getVenta);

router.get('/ventasproducto/:id', getVentasProducto);

router.post('/ventas', postVenta);

router.patch('/ventas/:id', putVenta);

// Ruta para cancelar venta y devolver stock
router.patch('/ventas/:id/cancelar', cancelarVenta);

export default router;