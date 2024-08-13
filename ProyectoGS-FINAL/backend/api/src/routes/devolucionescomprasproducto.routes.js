import { Router } from "express";
import {getDevolucioncomprasproducto, postDevolucioncomprasproducto, putDevolucioncomprasproducto, deleteDevolucioncomprasproducto,getDevolucioncompraproducto} from '../controllers/devolucionescomprasproducto.controllers.js'


const router = Router()

router.get('/devolucioncomprasproducto',getDevolucioncomprasproducto)

router.get('/devolucioncomprasproducto/:id',getDevolucioncompraproducto)

router.post('/devolucioncomprasproducto',postDevolucioncomprasproducto)

router.patch('/devolucioncomprasproducto/:id',putDevolucioncomprasproducto)

router.delete('/devolucioncomprasproducto/:id',deleteDevolucioncomprasproducto)

export default router