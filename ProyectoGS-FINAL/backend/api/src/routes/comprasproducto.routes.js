import { Router } from "express";
import {getComprasProducto, postComprasProducto, putComprasProducto, deleteComprasProducto,getCompraProducto} from '../controllers/comprasproducto.controllers.js'


const router = Router()

router.get('/comprasproducto',getComprasProducto)

router.get('/comprasproducto/:id',getCompraProducto)

router.post('/comprasproducto',postComprasProducto)

router.patch('/comprasproducto/:id',putComprasProducto)

router.delete('/comprasproducto/:id',deleteComprasProducto)

export default router