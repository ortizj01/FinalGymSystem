import {pool} from '../db.js'

export const getDevolucioncompras = async (req,res)=> {
const [rows] =await pool.query(
    `SELECT
        DC.*,
        c.NumeroReciboCompra,
        DATE_FORMAT(DC.FechaDevolucionCompra, '%Y-%m-%d') AS Fecha_compraf,
        CASE 
            WHEN EstadoCompra = 1 THEN 'Activo'
            WHEN EstadoCompra = 0 THEN 'Inactivo'
            ELSE 'estado no definido' -- Opcional: Manejar otros valores de estado
        END AS estado_descripcion
    FROM 
        DevolucionesCompras DC
	LEFT JOIN 
    Compras c ON DC.IdCompra = c.IdCompra`)
res.json(rows)
}

export const getDevolucioncompra = async (req,res)=> {
    const [rows] =await pool.query(
        `SELECT
        DC.*,
	c.NumeroReciboCompra,
    cp.NombreProveedor,
    c.ValorCompra,
    DATE_FORMAT(c.FechaRegistroCompra, '%Y-%m-%d') AS Fecha_RegistroCompra
FROM 
    Compras c
LEFT JOIN 
    Proveedores cp ON c.IdProveedores = cp.IdProveedores
LEFT JOIN 
    DevolucionesCompras DC ON DC.IdCompra = c.IdCompra
WHERE 
    DC.IdDevolucionesCompra = ?;`
        ,[req.params.id])
    
    if(rows.length<=0)return res.status(404).json({
        message: 'DEvCompra no encontrada'
    })
    res.json(rows[0])
    }

export const postDevolucioncompras = async (req,res)=> {
    const {Motivo, ValorDevolucion,EstadoDevolucion,IdCompra,FechaDevolucionCompra} = req.body
    const [rows] = await pool.query('INSERT INTO DevolucionesCompras(Motivo, ValorDevolucion,EstadoDevolucion,IdCompra,FechaDevolucionCompra)VALUES(?,?,?,?,?)',[Motivo, ValorDevolucion,EstadoDevolucion,IdCompra,FechaDevolucionCompra]);
    await pool.query('UPDATE Compras SET ValorCompra = ValorCompra - ? WHERE IdCompra = ?', [ValorDevolucion, IdCompra]);
    res.send({
        id:rows.insertId,
        Motivo, 
        ValorDevolucion,
        EstadoDevolucion,
        IdCompra,
        FechaDevolucionCompra,
    })
}

export const deleteDevolucioncompras = async (req,res)=> {
    const [result]=await pool.query('DELETE FROM DevolucionesCompras WHERE IdDevolucionesCompra=?',[req.params.id])
    if(result.affectedRows<=0) return res.status(404).json({
        message: 'Devolucion de Compra no encontrada'
    })
    res.send('devolucion de Compra eliminada')
}

export const putDevolucioncompras = async (req,res)=>{
    const{id}=req.params
    const{Motivo, ValorDevolucion,EstadoDevolucion,IdCompra}=req.body
    const [result]= await pool.query('UPDATE DevolucionesCompras SET Motivo = IFNULL(?,Motivo), ValorDevolucion = IFNULL(?,ValorDevolucion, EstadoDevolucion = IFNULL(?,EstadoDevolucion, IdCompra = IFNULL(?,IdCompra,WHERE IdDevolucionesCompra=?',[Motivo, ValorDevolucion,EstadoDevolucion,IdCompra,id])

    if(result.affectedRows===0)return res.status(404).json({
        message:'compra no encontrada'
    })

    const [rows] = await pool.query('SELECT*FROM DevolucionesCompras WHERE IdDevolucionesCompra=?',[id])
    res.json(rows[0])
}

