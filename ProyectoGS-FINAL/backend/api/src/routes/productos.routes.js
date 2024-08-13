import { Router } from "express";
import {getProductos, postProductos, putProductos, deleteProductos,getProducto} from '../controllers/productos.controllers.js'
import { upload } from '../config/cloudinary.js';



const router = Router()

router.get('/productos',getProductos)

router.get('/productos/:id',getProducto)

router.post('/productos', upload.single('Imagen'), postProductos);

router.patch('/productos/:id',upload.single('Imagen'),putProductos)

router.delete('/productos/:id',deleteProductos)

export default router