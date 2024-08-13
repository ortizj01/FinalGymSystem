import {pool} from '../db.js'

export const getDevolucioncomprasproducto = async (req,res)=> {
const [rows] =await pool.query('SELECT*FROM DevolucionesComprasProducto')
res.json(rows)
}

export const getDevolucioncompraproducto = async (req,res)=> {
    const [rows] =await pool.query(
        `SELECT
    DC.*,
    P.NombreProducto,
    P.PrecioProducto,
    DC.CantidadProducto,
    P.PrecioProducto * DC.CantidadProducto AS Valortotal
FROM 
    DevolucionesComprasProducto AS DC
LEFT JOIN 
    Productos AS P ON DC.IdProducto = P.IdProducto
WHERE 
    DC.IdDevolucionesCompra = ?;
`
,[req.params.id])
    
    if(rows.length<=0)return res.status(404).json({
        message: 'DevolucionesComprasProducto no encontrada'
    })
    res.json(rows)
    }

export const postDevolucioncomprasproducto = async (req,res)=> {
    const {IdDevolucionesCompra, IdProducto,CantidadProducto,IdCompra} = req.body
    const [rows] = await pool.query('INSERT INTO DevolucionesComprasProducto(IdDevolucionesCompra, IdProducto,CantidadProducto)VALUES(?,?,?)',[IdDevolucionesCompra, IdProducto,CantidadProducto]);
    await pool.query('UPDATE Productos SET Stock = Stock - ? WHERE IdProducto = ?', [CantidadProducto, IdProducto]);
    await pool.query('UPDATE ComprasProducto SET CantidadProducto = CantidadProducto - ? WHERE IdProducto = ? AND IdCompra = ?',[CantidadProducto, IdProducto,IdCompra]
    );
    res.send({
        id:rows.insertId,
        IdDevolucionesCompra, 
        IdProducto,
        CantidadProducto,
    })
}

export const deleteDevolucioncomprasproducto = async (req,res)=> {
    const [result]=await pool.query('DELETE FROM DevolucionesComprasProducto WHERE IdDevolucionesComprasProducto=?',[req.params.id])
    if(result.affectedRows<=0) return res.status(404).json({
        message: 'DevolucionesComprasProducto no encontrado'
    })
    res.send('DevolucionesComprasProducto eliminada')
}

export const putDevolucioncomprasproducto = async (req,res)=>{
    const{id}=req.params
    const{FechaCompra, ValorCompra,FechaRegistroCompra,NumeroReciboCompra,EstadoCompra,IdProveedores}=req.body
    const [result]= await pool.query('UPDATE Compras SET FechaCompra = IFNULL(?,FechaCompra), ValorCompra = IFNULL(?,ValorCompra, FechaRegistroCompra = IFNULL(?,FechaRegistroCompra, NumeroReciboCompra = IFNULL(?,NumeroReciboCompra, EstadoCompra = IFNULL(?,EstadoCompra, IdProveedores = IFNULL(?,IdProveedores) WHERE IdCompra=?',[FechaCompra, ValorCompra,FechaRegistroCompra,NumeroReciboCompra,EstadoCompra,IdProveedores,id])

    if(result.affectedRows===0)return res.status(404).json({
        message:'compra no encontrada'
    })

    const [rows] = await pool.query('SELECT*FROM Compras WHERE IdCompra=?',[id])
    res.json(rows[0])
}

