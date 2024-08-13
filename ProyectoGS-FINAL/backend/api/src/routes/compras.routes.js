import { Router } from "express";
import {getCompras, postCompras, putCompras, deleteCompras,getCompra} from '../controllers/compras.controllers.js'


const router = Router()

router.get('/compras',getCompras)

router.get('/compras/:id',getCompra)

router.post('/compras',postCompras)

router.patch('/compras/:id',putCompras)

router.delete('/compras/:id',deleteCompras)

export default router