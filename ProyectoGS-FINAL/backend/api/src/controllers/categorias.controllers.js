import {pool} from '../db.js'

export const getCategorias = async (req,res)=> {
const [rows] =await pool.query(
    `SELECT
        *,
        CASE 
            WHEN EstadoCategoriaProductos = 1 THEN 'Activo'
            WHEN EstadoCategoriaProductos = 0 THEN 'Inactivo'
            ELSE 'estado no definido' -- Opcional: Manejar otros valores de estado
        END AS estado_descripcion
    FROM 
        CategoriaProductos`)
res.json(rows)
}   

export const getCategoria = async (req,res)=> {
    const [rows] =await pool.query('SELECT*FROM CategoriaProductos WHERE IdCategoriaProductos=?',[req.params.id])
    
    if(rows.length<=0)return res.status(404).json({
        message: 'proveedor no encontrado'
    })
    res.json(rows[0])
    }

export const postCategorias = async (req,res)=> {
    const {NombreCategoriaProductos, EstadoCategoriaProductos} = req.body
    const [rows] = await pool.query('INSERT INTO CategoriaProductos(NombreCategoriaProductos, EstadoCategoriaProductos)VALUES(?,?)',[NombreCategoriaProductos,EstadoCategoriaProductos])
    res.send({
        id:rows.insertId,
        NombreCategoriaProductos, 
        EstadoCategoriaProductos,
    })
}

export const deleteCategorias = async (req,res)=> {
    const [result]=await pool.query('DELETE FROM CategoriaProductos WHERE IdCategoriaProductos=?',[req.params.id])
    if(result.affectedRows<=0) return res.status(404).json({
        message: 'Categoria no encontrado'
    })
    res.send('Categoria eliminada')
}

export const putCategorias = async (req,res)=>{
    const{id}=req.params
    const{NombreCategoriaProductos, EstadoCategoriaProductos}=req.body
    const [result]= await pool.query('UPDATE CategoriaProductos SET NombreCategoriaProductos = IFNULL(?,NombreCategoriaProductos), EstadoCategoriaProductos = IFNULL(?,EstadoCategoriaProductos) WHERE IdCategoriaProductos=?',[NombreCategoriaProductos, EstadoCategoriaProductos,id])

    if(result.affectedRows===0)return res.status(404).json({
        message:'Categoria no encontrado'
    })

    const [rows] = await pool.query('SELECT*FROM CategoriaProductos WHERE IdCategoriaProductos=?',[id])
    res.json(rows[0])
}

