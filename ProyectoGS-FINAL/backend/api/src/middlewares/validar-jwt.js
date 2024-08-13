import { pool } from "../db.js";
import { request, response } from "express";
import jwt from "jsonwebtoken";

export const validarJWT = async (req = request, res = response, next) => {
    const token = req.header('x-token') || req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {
        const secret = process.env.SECRET0RPRIVATEKEY;
        if (!secret) {
            throw new Error('SECRET0RPRIVATEKEY no está definido en las variables de entorno');
        }

        const { id } = jwt.verify(token, secret);

        // Leer el usuario que corresponde al IdUsuario
        const [rows] = await pool.query('SELECT * FROM Usuarios WHERE IdUsuario = ?', [id]);

        if (rows.length <= 0) {
            return res.status(404).json({
                msg: 'Usuario no encontrado'
            });
        }

        const user = rows[0];

        // Adjuntar el usuario a la solicitud
        req.user = user;

        // Obtener el rol del usuario
        const [rolRows] = await pool.query('SELECT IdRol FROM RolUsuario WHERE IdUsuario = ?', [id]);

        if (rolRows.length <= 0) {
            return res.status(403).json({
                msg: 'El usuario no tiene roles asignados'
            });
        }

        req.user.IdRol = rolRows.map(row => row.IdRol); // Guardar todos los roles en un array

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        });
    }
};
