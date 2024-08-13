import { Router } from "express";
import {getDevolucioncompras, postDevolucioncompras, putDevolucioncompras, deleteDevolucioncompras,getDevolucioncompra} from '../controllers/devolucioncompras.controllers.js'


const router = Router()

router.get('/devolucioncompras',getDevolucioncompras)

router.get('/devolucioncompras/:id',getDevolucioncompra)

router.post('/devolucioncompras',postDevolucioncompras)

router.patch('/devolucioncompras/:id',putDevolucioncompras)

router.delete('/devolucioncompras/:id',deleteDevolucioncompras)

export default router