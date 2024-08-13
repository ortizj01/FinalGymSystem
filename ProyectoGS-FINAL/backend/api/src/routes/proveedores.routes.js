import { Router } from "express";
import {getProveedores, postProveedores, putProveedores, deleteProveedores,getProveedor} from '../controllers/proveedores.controllers.js'


const router = Router()

router.get('/proveedores',getProveedores)

router.get('/proveedores/:id',getProveedor)

router.post('/proveedores',postProveedores)

router.patch('/proveedores/:id',putProveedores)

router.delete('/proveedores/:id',deleteProveedores)

export default router