//VER DETALLE CLIENTE
// Función para cargar los pedidos del cliente
async function cargarPedidosCliente(clienteId) {
    try {
        const response = await fetch(`http://localhost:3000/api/pedidos/cliente/${clienteId}`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener los pedidos del cliente');
        }

        const pedidos = await response.json();
        const tablaPedidos = document.getElementById('tablaPedidos');

        tablaPedidos.innerHTML = ''; // Limpiar contenido previo

        pedidos.forEach(pedido => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <th scope="row">${pedido.IdPedido}</th>
                <td>${new Date(pedido.FechaPedido).toLocaleDateString()}</td>
                <td>${formatearCOP(pedido.Total)}</td>
                <td>${getEstadoTexto(pedido.EstadoPedido)}</td>
            `;
            tablaPedidos.appendChild(fila);
        });
    } catch (error) {
        console.error('Error al cargar los pedidos del cliente:', error);
    }
}

// Función para cargar las ventas del cliente
async function cargarVentasCliente(clienteId) {
    try {
        const response = await fetch(`http://localhost:3000/api/ventas/cliente/${clienteId}`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener las ventas del cliente');
        }

        const ventas = await response.json();
        const tablaVentas = document.getElementById('tablaVentas');

        tablaVentas.innerHTML = ''; // Limpiar contenido previo

        ventas.forEach(venta => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <th scope="row">${venta.IdVenta}</th>
                <td>${new Date(venta.FechaVenta).toLocaleDateString()}</td>
                <td>${formatearCOP(venta.Total)}</td>
                <td>${getEstadoTexto(venta.EstadoVenta)}</td>
            `;
            tablaVentas.appendChild(fila);
        });
    } catch (error) {
        console.error('Error al cargar las ventas del cliente:', error);
    }
}

// Función para formatear valores en pesos colombianos
const formatearCOP = (valor) => {
    return '$' + Math.round(valor).toLocaleString('es-CO');
}

// Función para obtener el texto del estado
const getEstadoTexto = (estado) => {
    const estados = ["PENDIENTE DE PAGO", "PAGADO", "ENTREGADO", "ANULADO"];
    return estados[estado] || 'Desconocido';
}

async function cargarDatosCliente() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (id) {
        try {
            const response = await fetch(`http://localhost:3000/api/usuarios/${id}`, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error al obtener los detalles del cliente');
            }

            const cliente = await response.json();

            // Convertir el estado a texto
            const estadoTexto = cliente.Estado === 0 ? 'Activo' : 'Inactivo';

            // Formatear la fecha de nacimiento
            const fecha = new Date(cliente.FechaDeNacimiento);
            const dia = String(fecha.getDate()).padStart(2, '0');
            const mes = String(fecha.getMonth() + 1).padStart(2, '0');
            const anio = fecha.getFullYear();
            const fechaFormateada = `${dia}/${mes}/${anio}`;

            document.getElementById('documentoCliente').value = cliente.Documento;
            document.getElementById('nombreCliente').value = cliente.Nombres;
            document.getElementById('emailCliente').value = cliente.Correo;
            document.getElementById('TelefonoCliente').value = cliente.Telefono;
            document.getElementById('direccionCliente').value = cliente.Direccion;
            document.getElementById('apellidosCliente').value = cliente.Apellidos;
            document.getElementById('tipoDocumentoCliente').value = cliente.TipoDocumento;
            document.getElementById('fechaNacimientoCliente').value = fechaFormateada;
            document.getElementById('estadoCliente').value = estadoTexto;
            document.getElementById('generoCliente').value = cliente.Genero;

            // Cargar pedidos y ventas del cliente
            await cargarPedidosCliente(cliente.IdUsuario);
            await cargarVentasCliente(cliente.IdUsuario);
        } catch (error) {
            console.error('Error:', error.message);
            // Manejar el error en caso necesario
        }
    }
}

document.addEventListener('DOMContentLoaded', cargarDatosCliente);
