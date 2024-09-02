import { Router } from "express";
import { getVentas, getVentaDetalles, getVenta, postVenta, putVenta, cancelarVenta, getVentasProducto, getClientesYBeneficiarios, getVentasByUsuario} from '../controllers/ventas.controller.js';

const router = Router();

router.get('/ventas', getVentas);
router.get('/clientesBeneficiarios', getClientesYBeneficiarios);
router.get('/ventas/:id', getVenta);
router.get('/ventasproducto/:id', getVentasProducto);
router.post('/ventas', postVenta);
router.patch('/ventas/:id', putVenta);
router.get('/venta/detalle/:idVenta', getVentaDetalles); //detalles de la venta
router.get('/venta/usuario/:idUsuario', getVentasByUsuario); //Venta por cliente
router.patch('/ventas/:id/cancelar', cancelarVenta); // Ruta para cancelar venta y devolver stock

export default router;