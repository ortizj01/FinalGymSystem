import {pool} from '../db.js'
import { cloudinary } from '../config/cloudinary.js';
import { Readable } from 'stream';


export const getProductos = async (req,res)=> {
const [rows] =await pool.query(
    `SELECT
    p.*,
    cp.NombreCategoriaProductos AS Nombre_categoria,
    CASE 
        WHEN p.EstadoProducto = 1 THEN 'Activo'
        WHEN p.EstadoProducto = 0 THEN 'Inactivo'
        ELSE 'estado no definido'
    END AS estado_descripcion
FROM 
    Productos p
LEFT JOIN 
    CategoriaProductos cp ON p.IdCategoriaProductos = cp.IdCategoriaProductos`)
res.json(rows)
}

export const getProducto = async (req,res)=> {
    const [rows] =await pool.query('SELECT*FROM Productos WHERE IdProducto=?',[req.params.id])
    
    if(rows.length<=0)return res.status(404).json({
        message: 'producto no encontrado'
    })
    res.json(rows[0])
    }




    export const postProductos = async (req, res) => {
        try {
          console.log('req.file:', req.file); // Verifica qué hay en req.file
          console.log('req.body:', req.body); // Verifica qué hay en req.body
      
          if (!req.file) {
            return res.status(400).json({ message: 'No se ha proporcionado ningún archivo' });
          }
      
          // Subir imagen a Cloudinary usando el buffer
          const uploadFromBuffer = (buffer) => {
            return new Promise((resolve, reject) => {
              const stream = cloudinary.uploader.upload_stream((error, result) => {
                if (error) reject(error);
                resolve(result);
              });
              const readable = new Readable();
              readable._read = () => {}; // _read is required but you can noop it
              readable.push(buffer);
              readable.push(null);
              readable.pipe(stream);
            });
          };
      
          const uploadResult = await uploadFromBuffer(req.file.buffer);
      
          const { NombreProducto, PrecioProducto, IvaProducto, Stock, EstadoProducto, IdCategoriaProductos } = req.body;
          const Imagen = uploadResult.secure_url;
      
          // Insertar datos en la base de datos
          const [rows] = await pool.query('INSERT INTO Productos(NombreProducto, PrecioProducto, IvaProducto, Stock, Imagen, EstadoProducto, IdCategoriaProductos) VALUES (?, ?, ?, ?, ?, ?, ?)', [NombreProducto, PrecioProducto, IvaProducto, Stock, Imagen, EstadoProducto, IdCategoriaProductos]);
      
          // Enviar respuesta con el ID del producto creado y otros datos
          res.status(201).json({
            id: rows.insertId,
            NombreProducto,
            PrecioProducto,
            IvaProducto,
            Stock,
            Imagen,
            EstadoProducto,
            IdCategoriaProductos,
          });
        } catch (error) {
          console.error('Error al insertar producto:', error);
          res.status(500).json({ message: 'Error al insertar producto' });
        }
      };


    
// export const postProductos = async (req,res)=> {
//     const {NombreProducto,PrecioProducto,IvaProducto,Stock,Imagen,EstadoProducto,IdCategoriaProductos} = req.body
//     const [rows] = await pool.query('INSERT INTO Productos(NombreProducto,PrecioProducto,IvaProducto,Stock,Imagen,EstadoProducto,IdCategoriaProductos)VALUES(?,?,?,?,?,?,?)',[NombreProducto,PrecioProducto,IvaProducto,Stock,Imagen,EstadoProducto,IdCategoriaProductos])
//     res.send({
//         id:rows.insertId,
//         NombreProducto,
//         PrecioProducto,
//         IvaProducto,
//         Stock,
//         Imagen,
//         EstadoProducto,
//         IdCategoriaProductos,
//     })
// }

export const deleteProductos = async (req,res)=> {
    const [result]=await pool.query('DELETE FROM Productos WHERE IdProducto=?',[req.params.id])
    if(result.affectedRows<=0) return res.status(404).json({
        message: 'Categoria no encontrado'
    })
    res.send('producto eliminada')
}

// export const putProductos = async (req,res)=>{
//     const{id}=req.params
//     const{NombreProducto,PrecioProducto,IvaProducto,Stock,Imagen,EstadoProducto,IdCategoriaProductos}=req.body
//     const [result]= await pool.query('UPDATE Productos SET NombreProducto = IFNULL(?,NombreProducto), PrecioProducto = IFNULL(?,PrecioProducto),IvaProducto = IFNULL(?,IvaProducto),Stock = IFNULL(?,Stock),Imagen = IFNULL(?,Imagen),EstadoProducto = IFNULL(?,EstadoProducto),IdCategoriaProductos = IFNULL(?,IdCategoriaProductos) WHERE IdProducto=?',[NombreProducto,PrecioProducto,IvaProducto,Stock,Imagen,EstadoProducto,IdCategoriaProductos,id])

//     if(result.affectedRows===0)return res.status(404).json({
//         message:'producto no encontrado'
//     })

//     const [rows] = await pool.query('SELECT*FROM Productos WHERE IdProducto=?',[id])
//     res.json(rows[0])
// }


export const putProductos = async (req, res) => {
  const { id } = req.params;
  const { NombreProducto, PrecioProducto, IvaProducto, Stock, EstadoProducto, IdCategoriaProductos } = req.body;
  let Imagen = req.body.Imagen; // Mantener la imagen actual si no se actualiza

  try {
      console.log('req.file:', req.file); // Verifica si se ha enviado un nuevo archivo
      console.log('req.body:', req.body);

      if (req.file) {
          // Subir nueva imagen a Cloudinary usando el buffer
          const uploadFromBuffer = (buffer) => {
              return new Promise((resolve, reject) => {
                  const stream = cloudinary.uploader.upload_stream((error, result) => {
                      if (error) reject(error);
                      resolve(result);
                  });
                  const readable = new Readable();
                  readable._read = () => {}; // _read is required but you can noop it
                  readable.push(buffer);
                  readable.push(null);
                  readable.pipe(stream);
              });
          };

          const uploadResult = await uploadFromBuffer(req.file.buffer);
          Imagen = uploadResult.secure_url; // Actualiza la URL de la imagen con la nueva subida
      }

      // Actualizar datos en la base de datos
      const [result] = await pool.query(
          'UPDATE Productos SET NombreProducto = IFNULL(?, NombreProducto), PrecioProducto = IFNULL(?, PrecioProducto), IvaProducto = IFNULL(?, IvaProducto), Stock = IFNULL(?, Stock), Imagen = IFNULL(?, Imagen), EstadoProducto = IFNULL(?, EstadoProducto), IdCategoriaProductos = IFNULL(?, IdCategoriaProductos) WHERE IdProducto = ?',
          [NombreProducto, PrecioProducto, IvaProducto, Stock, Imagen, EstadoProducto, IdCategoriaProductos, id]
      );

      if (result.affectedRows === 0) return res.status(404).json({ message: 'Producto no encontrado' });

      // Obtener el producto actualizado
      const [rows] = await pool.query('SELECT * FROM Productos WHERE IdProducto = ?', [id]);
      res.json(rows[0]);
  } catch (error) {
      console.error('Error al actualizar producto:', error);
      res.status(500).json({ message: 'Error al actualizar producto' });
  }
};

