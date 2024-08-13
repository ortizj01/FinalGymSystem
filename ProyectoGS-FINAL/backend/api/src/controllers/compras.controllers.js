import {pool} from '../db.js'

export const getCompras = async (req,res)=> {
const [rows] =await pool.query(
    `SELECT
    c.*,
    cp.NombreProveedor,
    DATE_FORMAT(c.FechaCompra, '%Y-%m-%d') AS Fecha_compraf,
    DATE_FORMAT(c.FechaRegistroCompra, '%Y-%m-%d') AS Fecha_RegistroCompra,
    CASE 
        WHEN c.EstadoCompra = 1 THEN 'Activo'
        WHEN c.EstadoCompra = 0 THEN 'Inactivo'
        ELSE 'estado no definido'
    END AS estado_descripcion
FROM 
    Compras c
    LEFT JOIN Proveedores cp ON c.IdProveedores = cp.IdProveedores
WHERE
    c.IdCompra NOT IN (
        SELECT cp.IdCompra
        FROM ComprasProducto cp
        GROUP BY cp.IdCompra
        HAVING SUM(CASE WHEN cp.CantidadProducto = 0 THEN 1 ELSE 0 END) = COUNT(*)
    );`)
res.json(rows)
}

export const getCompra = async (req,res)=> {
    const [rows] =await pool.query(
        `SELECT
        c.*,
        cp.NombreProveedor,
        DATE_FORMAT(c.FechaCompra, '%Y-%m-%d') AS Fecha_compraf,
        DATE_FORMAT(c.FechaRegistroCompra, '%Y-%m-%d') AS Fecha_RegistroCompra,
        CASE 
            WHEN EstadoCompra = 1 THEN 'Activo'
            WHEN EstadoCompra = 0 THEN 'Inactivo'
            ELSE 'estado no definido' -- Opcional: Manejar otros valores de estado
        END AS estado_descripcion
    FROM 
        Compras c
	LEFT JOIN 
    Proveedores cp ON c.IdProveedores = cp.IdProveedores
    WHERE IdCompra=?`
        ,[req.params.id])
    
    if(rows.length<=0)return res.status(404).json({
        message: 'Compra no encontrada'
    })
    res.json(rows[0])
    }

export const postCompras = async (req,res)=> {
    const {FechaCompra, ValorCompra,FechaRegistroCompra,NumeroReciboCompra,EstadoCompra,IdProveedores} = req.body
    const [rows] = await pool.query('INSERT INTO Compras(FechaCompra, ValorCompra,FechaRegistroCompra,NumeroReciboCompra,EstadoCompra,IdProveedores)VALUES(?,?,?,?,?,?)',[FechaCompra, ValorCompra,FechaRegistroCompra,NumeroReciboCompra,EstadoCompra,IdProveedores])
    res.send({
        id:rows.insertId,
        FechaCompra, 
        ValorCompra,
        FechaRegistroCompra,
        NumeroReciboCompra,
        EstadoCompra,
        IdProveedores,
    })
}

export const deleteCompras = async (req,res)=> {
    const [result]=await pool.query('DELETE FROM Compras WHERE IdCompra=?',[req.params.id])
    if(result.affectedRows<=0) return res.status(404).json({
        message: 'Compra no encontrado'
    })
    res.send('Compra eliminada')
}

export const putCompras = async (req,res)=>{
    const{id}=req.params
    const{FechaCompra, ValorCompra,FechaRegistroCompra,NumeroReciboCompra,EstadoCompra,IdProveedores}=req.body
    const [result]= await pool.query('UPDATE Compras SET FechaCompra = IFNULL(?,FechaCompra), ValorCompra = IFNULL(?,ValorCompra, FechaRegistroCompra = IFNULL(?,FechaRegistroCompra, NumeroReciboCompra = IFNULL(?,NumeroReciboCompra, EstadoCompra = IFNULL(?,EstadoCompra, IdProveedores = IFNULL(?,IdProveedores) WHERE IdCompra=?',[FechaCompra, ValorCompra,FechaRegistroCompra,NumeroReciboCompra,EstadoCompra,IdProveedores,id])

    if(result.affectedRows===0)return res.status(404).json({
        message:'compra no encontrada'
    })

    const [rows] = await pool.query('SELECT*FROM Compras WHERE IdCompra=?',[id])
    res.json(rows[0])
}

