import { pool } from '../db.js';

// Obtener detalles de una venta incluyendo productos y membresías
export const getVentaDetalles = async (req, res) => {
    const { idVenta } = req.params;

    try {
        // Obtener los detalles de la venta
        const [venta] = await pool.query(`
            SELECT
                v.IdVenta,
                v.FechaVenta,
                v.Total,
                ev.NombreEstado AS EstadoVenta,
                CONCAT(u.Nombres, ' ', u.Apellidos) AS NombreCompleto,
                u.Documento
            FROM Ventas v
            JOIN EstadosVentas ev ON v.EstadoVenta = ev.IdEstadoVenta
            JOIN Usuarios u ON v.IdUsuario = u.IdUsuario
            WHERE v.IdVenta = ?
        `, [idVenta]);

        if (!venta || venta.length === 0) {
            return res.status(404).json({ message: 'Venta no encontrada' });
        }

        // Obtener los productos asociados a la venta
        const [productos] = await pool.query(`
            SELECT
                p.NombreProducto,
                vp.CantidadProducto,
                p.PrecioProducto,
                (vp.CantidadProducto * p.PrecioProducto) AS TotalProducto
            FROM VentasProducto vp
            JOIN Productos p ON vp.IdProducto = p.IdProducto
            WHERE vp.IdVenta = ?
        `, [idVenta]);

        // Obtener las membresías asociadas a la venta
        const [membresias] = await pool.query(`
            SELECT
                m.NombreMembresia,
                vm.Cantidad,
                m.CostoVenta AS PrecioMembresia,
                (vm.Cantidad * m.CostoVenta) AS TotalMembresia
            FROM VentasMembresia vm
            JOIN Membresias m ON vm.IdMembresia = m.IdMembresia
            WHERE vm.IdVenta = ?
        `, [idVenta]);

        res.json({ venta: venta[0], productos, membresias });
    } catch (error) {
        console.error('Error al obtener los detalles de la venta:', error);
        res.status(500).json({ message: 'Error al obtener los detalles de la venta' });
    }
};


// Obtener ventas asociadas a un cliente por su IdUsuario
export const getVentasByUsuario = async (req, res) => {
    const { idUsuario } = req.params;

    try {
        const [rows] = await pool.query(`
            SELECT
                v.IdVenta,
                v.FechaVenta,
                v.Total,
                ev.NombreEstado AS EstadoVenta,
                u.Documento
            FROM Ventas v
            JOIN EstadosVentas ev ON v.EstadoVenta = ev.IdEstadoVenta
            JOIN Usuarios u ON v.IdUsuario = u.IdUsuario
            WHERE v.IdUsuario = ?
        `, [idUsuario]);

        if (rows.length === 0) {
            return res.status(404).json({
                message: 'No se encontraron ventas para este usuario'
            });
        }

        res.json(rows);
    } catch (error) {
        console.error('Error al obtener las ventas por usuario:', error);
        res.status(500).json({ message: 'Error al obtener las ventas por usuario' });
    }
};

// Obtener usuarios con el rol de "Cliente" y sus beneficiarios
export const getClientesYBeneficiarios = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                u.IdUsuario,
                u.Nombres,
                u.Apellidos,
                u.Documento,
                r.NombreRol,
                GROUP_CONCAT(CONCAT(b.Nombres, ' ', b.Apellidos) SEPARATOR ', ') AS BeneficiarioNombres,
                GROUP_CONCAT(b.IdUsuario SEPARATOR ', ') AS IdBeneficiario
            FROM Usuarios u
            JOIN RolUsuario ru ON u.IdUsuario = ru.IdUsuario
            JOIN Roles r ON ru.IdRol = r.IdRol
            LEFT JOIN Usuarios b ON b.Beneficiario = u.IdUsuario
            LEFT JOIN RolUsuario rbu ON b.IdUsuario = rbu.IdUsuario
            LEFT JOIN Roles rb ON rbu.IdRol = rb.IdRol AND rb.NombreRol = 'Beneficiario'
            WHERE r.NombreRol = 'Cliente'
            GROUP BY u.IdUsuario;
        `);

        console.log('Usuarios y Beneficiarios:', rows);  
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener los usuarios con rol Cliente y Beneficiario:', error);
        res.status(500).json({ message: 'Error al obtener los usuarios con rol Cliente y Beneficiario' });
    }
};

// Obtener todas las ventas
export const getVentas = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT
                v.IdVenta,
                v.FechaVenta,
                v.Total,
                ev.NombreEstado AS EstadoVenta,
                CONCAT(u.Nombres, ' ', u.Apellidos) AS NombreCompleto,
                u.Documento
            FROM Ventas v
            JOIN EstadosVentas ev ON v.EstadoVenta = ev.IdEstadoVenta
            JOIN Usuarios u ON v.IdUsuario = u.IdUsuario
        `);
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener las ventas:', error);
        res.status(500).json({ message: 'Error al obtener las ventas' });
    }
};

// Obtener una venta por ID
export const getVenta = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT
                v.IdVenta,
                v.FechaVenta,
                v.Total,
                ev.NombreEstado AS EstadoVenta,
                CONCAT(u.Nombres, ' ', u.Apellidos) AS NombreCompleto,
                u.Documento
            FROM Ventas v
            JOIN EstadosVentas ev ON v.EstadoVenta = ev.IdEstadoVenta
            JOIN Usuarios u ON v.IdUsuario = u.IdUsuario
            WHERE v.IdVenta = ?
        `, [req.params.id]);

        if (rows.length <= 0) return res.status(404).json({
            message: 'Venta no encontrada'
        });
        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener la venta:', error);
        res.status(500).json({ message: 'Error al obtener la venta' });
    }
};

// Obtener todos los productos de una venta
export const getVentasProducto = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT
                vp.IdVentaProducto,
                vp.IdVenta,
                vp.IdProducto,
                p.NombreProducto,
                vp.CantidadProducto,
                p.PrecioProducto,
                vp.CantidadProducto * p.PrecioProducto AS TotalProducto
            FROM VentasProducto vp
            JOIN Productos p ON vp.IdProducto = p.IdProducto
            WHERE vp.IdVenta = ?
        `, [req.params.id]);
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener los productos de la venta:', error);
        res.status(500).json({ message: 'Error al obtener los productos de la venta' });
    }
};

// Crear una nueva venta
export const postVenta = async (req, res) => {
    const { IdUsuario, productos = [], membresias = [], IdBeneficiario = null } = req.body;
    const estadoActivo = 1;  // Estado activo
    let total = 0;

    try {
        // Verificar y calcular el total de la venta sumando productos y membresías
        for (let producto of productos) {
            const [prodData] = await pool.query('SELECT PrecioProducto, Stock FROM Productos WHERE IdProducto = ?', [producto.IdProducto]);
            if (prodData.length === 0) {
                return res.status(404).json({ message: `Producto con ID ${producto.IdProducto} no encontrado` });
            }
            if (prodData[0].Stock < producto.Cantidad) {
                return res.status(400).json({ message: `Stock insuficiente para el producto ${producto.IdProducto}` });
            }
            total += prodData[0].PrecioProducto * producto.Cantidad;
        }
        
        for (let membresia of membresias) {
            const [membData] = await pool.query('SELECT CostoVenta FROM Membresias WHERE IdMembresia = ?', [membresia.IdMembresia]);
            if (membData.length === 0) {
                return res.status(404).json({ message: `Membresía con ID ${membresia.IdMembresia} no encontrada` });
            }
            total += membData[0].CostoVenta * membresia.Cantidad;
        }

        // Verificar si no hay productos ni membresías
        if (total === 0) {
            return res.status(400).json({ message: 'Debe agregar al menos un producto o una membresía a la venta' });
        }

        // Insertar la venta
        const [ventaResult] = await pool.query(
            'INSERT INTO Ventas (IdUsuario, IdBeneficiario, Total, EstadoVenta) VALUES (?, ?, ?, ?)',
            [IdUsuario, IdBeneficiario, total, estadoActivo]
        );

        const idVenta = ventaResult.insertId;

        // Insertar productos de la venta
        for (let producto of productos) {
            await pool.query(
                'INSERT INTO VentasProducto (IdVenta, IdProducto, CantidadProducto) VALUES (?, ?, ?)',
                [idVenta, producto.IdProducto, producto.Cantidad]
            );
            await pool.query(
                'UPDATE Productos SET Stock = Stock - ? WHERE IdProducto = ?',
                [producto.Cantidad, producto.IdProducto]
            );
        }

        // Insertar membresías de la venta
        for (let membresia of membresias) {
            await pool.query(
                'INSERT INTO VentasMembresia (IdVenta, IdMembresia, Cantidad) VALUES (?, ?, ?)',
                [idVenta, membresia.IdMembresia, membresia.Cantidad]
            );
        }

        res.send({
            id: idVenta,
            IdUsuario,
            Total: total,
            EstadoVenta: estadoActivo
        });
    } catch (error) {
        console.error('Error al crear la venta:', error);
        res.status(500).json({ message: 'Error al crear la venta' });
    }
};
// Actualizar una venta
export const putVenta = async (req, res) => {
    const { id } = req.params;
    const { IdUsuario, Total, EstadoVenta } = req.body;

    try {
        const [result] = await pool.query(`
            UPDATE Ventas
            SET IdUsuario = IFNULL(?, IdUsuario),
                Total = IFNULL(?, Total),
                EstadoVenta = IFNULL(?, EstadoVenta)
            WHERE IdVenta = ?
        `, [IdUsuario, Total, EstadoVenta, id]);

        if (result.affectedRows === 0) return res.status(404).json({
            message: 'Venta no encontrada'
        });

        const [rows] = await pool.query('SELECT * FROM Ventas WHERE IdVenta = ?', [id]);
        res.json(rows[0]);
    } catch (error) {
        console.error('Error al actualizar la venta:', error);
        res.status(500).json({ message: 'Error al actualizar la venta' });
    }
};


// Anular una venta y devolver stock
export const cancelarVenta = async (req, res) => {
    const { id } = req.params;

    try {
        // Cambiar el estado de la venta a "Anulado" (estado ID 2)
        await pool.query('UPDATE Ventas SET EstadoVenta = 2, Total = 0 WHERE IdVenta = ?', [id]);

        // Devolver stock a los productos
        const [productos] = await pool.query('SELECT IdProducto, CantidadProducto FROM VentasProducto WHERE IdVenta = ?', [id]);

        for (let producto of productos) {
            await pool.query('UPDATE Productos SET Stock = Stock + ? WHERE IdProducto = ?', [producto.CantidadProducto, producto.IdProducto]);
        }

        res.send('Venta anulada, stock devuelto y total de venta puesto en 0');
    } catch (error) {
        console.error('Error al anular la venta:', error);
        res.status(500).json({ message: 'Error al anular la venta' });
    }
};