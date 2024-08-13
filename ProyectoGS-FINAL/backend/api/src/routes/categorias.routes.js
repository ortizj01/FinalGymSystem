import { Router } from "express";
import {getCategorias, postCategorias, putCategorias, deleteCategorias,getCategoria} from '../controllers/categorias.controllers.js'


const router = Router()

router.get('/categorias',getCategorias)

router.get('/categorias/:id',getCategoria)

router.post('/categorias',postCategorias)

router.patch('/categorias/:id',putCategorias)

router.delete('/categorias/:id',deleteCategorias)

export default router