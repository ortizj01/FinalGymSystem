import { pool } from "../db.js";
import { response } from "express";

export const rolAdmin = async (req, res = response, next) => {
    if (!req.user) {
        return res.status(500).json({
            msg: 'Se requiere verificar el token primero'
        });
    }

    const { IdUsuario } = req.user;

    try {
        // Consulta para obtener el rol del usuario
        const [rows] = await pool.query('SELECT IdRol FROM RolUsuario WHERE IdUsuario = ?', [IdUsuario]);

        if (rows.length <= 0) {
            return res.status(403).json({
                msg: 'No tiene permisos para realizar esta acción'
            });
        }

        const { IdRol } = rows[0];

        // Verificar si el rol es de administrador
        if (IdRol !== 2) {
            return res.status(403).json({
                msg: 'No tiene permisos para realizar esta acción'
            });
        }

        next();

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
};

export const tieneRol = (...roles) => {
    return (req, res = response, next) => {
        if (!req.user) {
            return res.status(500).json({
                msg: 'Se requiere verificar el token primero'
            });
        }

        if (!req.user.IdRol) {
            return res.status(403).json({
                msg: 'El usuario no tiene roles asignados'
            });
        }

        // Verificar si el usuario tiene uno de los roles permitidos
        const tieneRol = req.user.IdRol.some(rol => roles.includes(rol));

        if (!tieneRol) {
            return res.status(403).json({
                msg: 'No tiene permisos para realizar esta acción'
            });
        }

        next();
    }
};