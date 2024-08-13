import {pool} from '../db.js'

export const getProveedores = async (req,res)=> {
const [rows] =await pool.query(
    `SELECT
        *,
        CASE 
            WHEN EstadoProveedores = 1 THEN 'Activo'
            WHEN EstadoProveedores = 0 THEN 'Inactivo'
            ELSE 'estado no definido' -- Opcional: Manejar otros valores de estado
        END AS estado_descripcion
    FROM 
        Proveedores`)
res.json(rows)
}

export const getProveedor = async (req,res)=> {
    const [rows] =await pool.query('SELECT*FROM Proveedores WHERE IdProveedores=?',[req.params.id])
    
    if(rows.length<=0)return res.status(404).json({
        message: 'proveedor no encontrado'
    })
    res.json(rows[0])
    }

export const postProveedores = async (req,res)=> {
    const {NombreProveedor, NombreContactoProveedor, Telefono, Direccion, NIT, EstadoProveedores} = req.body
    const [rows] = await pool.query('INSERT INTO Proveedores(NombreProveedor, NombreContactoProveedor, Telefono, Direccion, NIT, EstadoProveedores)VALUES(?,?,?,?,?,?)',[NombreProveedor, NombreContactoProveedor, Telefono, Direccion, NIT, EstadoProveedores])
    res.send({
        id:rows.insertId,
            NombreProveedor, 
            NombreContactoProveedor,
            Telefono,
            Direccion,  
            NIT,
            EstadoProveedores,
    })  
}

export const deleteProveedores = async (req,res)=> {
    const [result]=await pool.query('DELETE FROM Proveedores WHERE IdProveedores=?',[req.params.id])
    if(result.affectedRows<=0) return res.status(404).json({
        message: 'proveedor no encontrado'
    })
    res.send('proveedor eliminado')
}

export const putProveedores = async (req,res)=>{
    const{id}=req.params
    const{NombreProveedor, NombreContactoProveedor, Telefono, Direccion, NIT, EstadoProveedores}=req.body
    const [result]= await pool.query('UPDATE Proveedores SET NombreProveedor = IFNULL(?,NombreProveedor), NombreContactoProveedor = IFNULL(?,NombreContactoProveedor), Telefono = IFNULL(?,Telefono), Direccion = IFNULL(?,Direccion), NIT = IFNULL(?,NIT), EstadoProveedores = IFNULL(?,EstadoProveedores) WHERE IdProveedores=?',[NombreProveedor, NombreContactoProveedor, Telefono, Direccion, NIT, EstadoProveedores,id])

    if(result.affectedRows===0)return res.status(404).json({
        message:'proveedor no encontrado'
    })

    const [rows] = await pool.query('SELECT*FROM Proveedores WHERE IdProveedores=?',[id])
    res.json(rows[0])
}

