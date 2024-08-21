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

// Función para generar un token de recuperación
function generatePasswordResetToken() {
    return crypto.randomBytes(20).toString('hex');
}

export const requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    try {
        const [rows] = await pool.query('SELECT * FROM Usuarios WHERE Correo = ?', [email]);
        if (rows.length <= 0) {
            return res.status(404).json({
                msg: 'Usuario no encontrado'
            });
        }

        const user = rows[0];
        const token = generatePasswordResetToken();
        const expiration = new Date(Date.now() + 3600000); // Token válido por 1 hora
        const resetLink = `http://localhost:8086/restablecer/${token}`;

        await pool.query('INSERT INTO PasswordResetTokens (userId, token, expiration) VALUES (?, ?, ?)', [user.IdUsuario, token, expiration]);

        const mailOptions = {
            from: 'gymsysteminfo@gmail.com',
            to: email,
            subject: 'Restablecer Contraseña',
            html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h2 style="color: #555;">Restablecer tu contraseña</h2>
                    <p>Hola,</p>
                    <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para continuar:</p>
                    <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; margin: 10px 0; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px;">Restablecer Contraseña</a>
                    <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
                    <p style="color: #777;">Este enlace es válido por 1 hora.</p>
                </div>
            `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error al enviar el correo electrónico:", error);
                return res.status(500).json({
                    msg: 'Error al enviar el correo electrónico'
                });
            }
            res.json({ msg: 'Correo electrónico de recuperación enviado' });
        });
    } catch (error) {
        console.error("Error en el controlador de solicitud de restablecimiento de contraseña:", error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
};


// Controlador para restablecer la contraseña
export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
        return res.status(400).json({ msg: 'Por favor ingrese todos los campos' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ msg: 'Las contraseñas no coinciden' });
    }

    try {
        const [rows] = await pool.query('SELECT * FROM PasswordResetTokens WHERE token = ? AND expiration > NOW()', [token]);
        if (rows.length <= 0) {
            return res.status(400).json({
                msg: 'Token no válido o expirado'
            });
        }

        const userId = rows[0].userId;  // Aquí se asume que la columna se llama 'userId'
        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query('UPDATE Usuarios SET Contrasena = ? WHERE IdUsuario = ?', [hashedPassword, userId]);
        await pool.query('DELETE FROM PasswordResetTokens WHERE token = ?', [token]);

        res.json({ msg: 'Contraseña restablecida con éxito' });
    } catch (error) {
        console.error("Error en el controlador de restablecimiento de contraseña:", error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        });
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



