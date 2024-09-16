// Función para obtener el ID del usuario autenticado
async function obtenerIdUsuario() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://finalgymsystem.onrender.com/api/auth/usuario-autenticado', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-token': token 
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener el ID del usuario');
        }

        const data = await response.json();
        return data.IdUsuario; // Asegúrate de que el ID esté en la propiedad correcta
    } catch (error) {
        console.error(error.message);
        return null;
    }
}

// Función para obtener las ventas asociadas al cliente
async function obtenerVentasCliente(idUsuario) {
    try {
        const response = await fetch(`https://finalgymsystem.onrender.com/api/venta/usuario/${idUsuario}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener las ventas del cliente');
        }

        const ventas = await response.json();
        console.log('Ventas obtenidas:', ventas); // Para depuración
        return ventas;
    } catch (error) {
        console.error(error.message);
        return [];
    }
}

// Función para listar ventas
async function listarVentas() {
    const idUsuario = await obtenerIdUsuario();
    if (idUsuario) {
        console.log('ID Usuario:', idUsuario); // Para depuración
        const ventas = await obtenerVentasCliente(idUsuario);
        mostrarVentasEnTabla(ventas);
    } else {
        console.error('No se pudo obtener el ID del usuario');
    }
}

function verDetalleVenta(idVenta) {
    window.location.href = `visualizarVentasClientes?id=${idVenta}`;
}

// Función para mostrar las ventas en la tabla
function mostrarVentasEnTabla(ventas) {
    const contenido = document.getElementById('contenido');
    
    // Limpiar el contenido previo del tbody para evitar duplicación
    contenido.innerHTML = '';

    if (ventas.length > 0) {
        ventas.forEach(venta => {
            const row = `
                <tr>
                    <td>${venta.Documento}</td>
                    <td>${new Date(venta.FechaVenta).toLocaleDateString()}</td>
                    <td>$${venta.Total.toFixed(2)}</td>
                    <td>${venta.EstadoVenta}</td>
                    <td>
                        <i class="fa-regular fa-eye fa-xl me-2" style="color: #f06d00;" onclick="verDetalleVenta(${venta.IdVenta})"></i>
                    </td>
                </tr>
            `;
            contenido.insertAdjacentHTML('beforeend', row);
        });

        // Inicializar DataTable con configuraciones
        $('#dataTable').DataTable().destroy();
        $('#dataTable').DataTable({
            pageLength: 5,
            order: [[1, 'desc']], // Ordenar por fecha de venta descendente
            language: {
                "lengthMenu": "Mostrar _MENU_ entradas",
                "zeroRecords": "No se encontraron resultados",
                "info": "Mostrando _START_ a _END_ de _TOTAL_ entradas",
                "infoEmpty": "Mostrando 0 a 0 de 0 entradas",
                "infoFiltered": "(filtrado de _MAX_ entradas en total)",
                "paginate": {
                    "first": "Primero",
                    "last": "Último",
                    "next": "Siguiente",
                    "previous": "Anterior"
                },
                "search": "Buscar:"
            }
        });
    } else {
        contenido.innerHTML = '<tr><td colspan="5" class="text-center">No tienes ventas registradas</td></tr>';
    }
}

// Función para cargar los detalles de una venta
async function cargarDatosVenta() {
    const urlParams = new URLSearchParams(window.location.search);
    const idVenta = urlParams.get('id');

    if (!idVenta) {
        console.error('ID de venta no especificado en la URL');
        return;
    }

    try {
        const response = await fetch(`https://finalgymsystem.onrender.com/api/venta/detalle/${idVenta}`);
        const data = await response.json();

        // Precargar los datos en el formulario
        document.getElementById('FechaVenta').innerText = new Date(data.venta.FechaVenta).toLocaleDateString();
        document.getElementById('ValorVenta').innerText = `$${data.venta.Total.toFixed(2)}`;
        document.getElementById('NombreCliente').innerText = `${data.venta.NombreCompleto}`;

        // Precargar los productos y membresías en la tabla
        let tableBody = '';
        
        data.productos.forEach(producto => {
            tableBody += `
                <tr>
                    <td>${producto.NombreProducto}</td>
                    <td>$${producto.PrecioProducto.toFixed(2)}</td>
                    <td>${producto.CantidadProducto}</td>
                    <td>$${producto.TotalProducto.toFixed(2)}</td>
                </tr>
            `;
        });

        data.membresias.forEach(membresia => {
            tableBody += `
                <tr>
                    <td>${membresia.NombreMembresia}</td>
                    <td>$${membresia.PrecioMembresia.toFixed(2)}</td>
                    <td>${membresia.Cantidad}</td>
                    <td>$${membresia.TotalMembresia.toFixed(2)}</td>
                </tr>
            `;
        });

        document.getElementById('ventaProductoMembresiaTable').innerHTML = tableBody;
    } catch (error) {
        console.error('Error al cargar los detalles de la venta:', error);
    }
}

// Inicializar la función de listar ventas cuando el documento esté listo
document.addEventListener('DOMContentLoaded', listarVentas);
