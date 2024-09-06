import { pool } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer"; 
import crypto from "crypto";

const blacklist = new Set();

// Configurar el transportador de nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'gymsysteminfo@gmail.com',
        pass: 'wsttaiewitprvxni'
    }
});

const tokenStore = new Map(); 

// Función para generar un token de recuperación
function generatePasswordResetToken() {
    return crypto.randomBytes(20).toString('hex');
}

export const requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    try {
        const [rows] = await pool.query('SELECT * FROM Usuarios WHERE Correo = ?', [email]);
        if (rows.length <= 0) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        const user = rows[0];
        const token = generatePasswordResetToken();
        const expiration = Date.now() + 3600000; // Token válido por 1 hora

        // Almacenar el token en memoria
        tokenStore.set(token, { userId: user.IdUsuario, expiration });

        const resetLink = `http://localhost:8086/restablecer?token=${token}`;

        const mailOptions = {
            from: 'gymsysteminfo@gmail.com',
            to: email,
            subject: 'Restablecer Contraseña',
            html: `
                <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #000; font-size: 24px; text-align: center;">Restablecer tu contraseña</h2>
                    <p style="font-size: 16px; color: #555; text-align: center;">Hola ${user.Nombres},</p>
                    <p style="font-size: 16px; color: #555;">Recibimos una solicitud para restablecer tu contraseña. Haz clic en el botón de abajo para proceder:</p>
                    <div style="text-align: center; margin: 20px 0;">
                        <a href="${resetLink}" style="background-color: #FF5733; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-size: 18px;">Restablecer Contraseña</a>
                    </div>
                    <p style="font-size: 14px; color: #555;">Este enlace es válido por 1 hora. Si no solicitaste un cambio de contraseña, por favor ignora este correo.</p>
                    <div style="text-align: center; margin-top: 30px;">
                        <p style="font-size: 12px; color: #999;">© 2024 GymSystem. Todos los derechos reservados.</p>
                        <a href="http://localhost:8086/indexCarrito" style="font-size: 12px; color: #FF5733;">Visita nuestro sitio web</a>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        res.json({ msg: 'Correo electrónico de recuperación enviado' });
    } catch (error) {
        console.error("Error al solicitar restablecimiento de contraseña:", error);
        res.status(500).json({ msg: 'Error al enviar el correo electrónico' });
    }
};



export const resetPassword = async (req, res) => {
    const { token } = req.params; // Obtener el token de los parámetros de ruta
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ msg: 'Por favor ingrese una contraseña' });
    }

    try {
        // Verificar el token
        const tokenData = tokenStore.get(token);
        if (!tokenData || tokenData.expiration < Date.now()) {
            return res.status(400).json({ msg: 'Token no válido o expirado' });
        }

        // Actualizar la contraseña del usuario
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query('UPDATE Usuarios SET Contrasena = ? WHERE IdUsuario = ?', [hashedPassword, tokenData.userId]);

        // Eliminar el token
        tokenStore.delete(token);

        res.json({ msg: 'Contraseña restablecida con éxito' });
    } catch (error) {
        console.error("Error en el controlador de restablecimiento de contraseña:", error);
        res.status(500).json({ msg: 'Error al restablecer la contraseña' });
    }
};



// Controlador para la autenticación de usuarios
export const login = async (req, res) => {
    console.log('Datos recibidos:', req.body);
    const { Correo, Contrasena } = req.body;

    try {
        // Verificar si el email existe
        const [rows] = await pool.query('SELECT * FROM Usuarios WHERE Correo = ?', [Correo]);
        if (rows.length <= 0) {
            return res.status(404).json({
                msg: 'Datos incorrectos, intente nuevamente'
            });
        }

        const user = rows[0];

        // Verificar si el usuario está activo
        if (user.Estado !== 1) {
            return res.status(403).json({
                msg: 'Usuario no está activo'
            });
        }

        // Verificar contraseña
        const validPassword = await bcrypt.compare(Contrasena, user.Contrasena);
        if (!validPassword) {
            return res.status(404).json({
                msg: 'Datos incorrectos, intente nuevamente'
            });
        }

        // Generar el JWT
        const token = jwt.sign({
            id: user.IdUsuario,
            email: user.Correo
        }, process.env.SECRET0RPRIVATEKEY, { expiresIn: '1h' });

        console.log('Token:', token);

        // Devolver el usuario y el token en la respuesta
        res.json({
            user,
            token
        });

        

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
}


export const obtenerUsuarioAutenticado = async (req, res) => {
    const token = req.header('x-token');
    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {
        const { id } = jwt.verify(token, process.env.SECRET0RPRIVATEKEY);

        // Consulta para obtener todos los datos necesarios del usuario
        const [rows] = await pool.query(`
            SELECT Usuarios.IdUsuario, Usuarios.Nombres, Usuarios.Apellidos, Usuarios.Correo, Usuarios.Telefono, Usuarios.Documento, Usuarios.TipoDocumento,
                   Usuarios.FechaDeNacimiento, Usuarios.Direccion, Usuarios.Genero, Usuarios.Estado, Roles.NombreRol AS Rol,Roles.IdRol
            FROM Usuarios
            INNER JOIN RolUsuario ON Usuarios.IdUsuario = RolUsuario.IdUsuario
            INNER JOIN Roles ON RolUsuario.IdRol = Roles.IdRol
            WHERE Usuarios.IdUsuario = ?
        `, [id]);

        if (rows.length <= 0) {
            return res.status(404).json({
                msg: 'Usuario no encontrado'
            });
        }

        const user = rows[0];
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(401).json({
            msg: 'Token no válido'
        });
    }
}


export const logout = (req, res) => {
    const authHeader = req.headers.authorization;

    // Verificar si el encabezado de autorización existe y tiene el formato correcto
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(400).json({ message: 'No se proporcionó un token válido' });
    }

    const token = authHeader.split(' ')[1];
    blacklist.add(token);
    res.status(200).json({ message: 'Logout successful' });
};



