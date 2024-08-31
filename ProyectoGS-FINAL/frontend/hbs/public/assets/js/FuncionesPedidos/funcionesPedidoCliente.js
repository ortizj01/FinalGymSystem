// Función para obtener el ID del usuario autenticado
async function obtenerIdUsuario() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/auth/usuario-autenticado', {
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

// Función para obtener los pedidos asociados al cliente
async function obtenerPedidosCliente(idUsuario) {
    try {
        const response = await fetch(`http://localhost:3000/api/pedido/usuario/${idUsuario}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener los pedidos del cliente');
        }

        const pedidos = await response.json();
        console.log('Pedidos obtenidos:', pedidos); // Para depuración
        return pedidos;
    } catch (error) {
        console.error(error.message);
        return [];
    }
}

// Función para listar pedidos
async function listarPedidos() {
    const idUsuario = await obtenerIdUsuario();
    if (idUsuario) {
        console.log('ID Usuario:', idUsuario); // Para depuración
        const pedidos = await obtenerPedidosCliente(idUsuario);
        mostrarPedidosEnTabla(pedidos);
    } else {
        console.error('No se pudo obtener el ID del usuario');
    }
}

// Función para mostrar los pedidos en la tabla
function mostrarPedidosEnTabla(pedidos) {
    const contenido = document.getElementById('contenido');
    contenido.innerHTML = '';  // Limpiar contenido previo

    if (pedidos.length > 0) {
        pedidos.forEach(pedido => {
            const row = `
                <tr>
                    <td>${pedido.IdPedido}</td>
                    <td>${pedido.Documento}</td>
                    <td>${new Date(pedido.FechaPedido).toLocaleDateString()}</td>
                    <td>$${pedido.Total.toFixed(2)}</td>
                    <td>${pedido.EstadoPedido}</td>
                    <td>
                        <button class="btn btn-info btn-sm" onclick="verDetallesPedido(${pedido.IdPedido})">Ver Detalles</button>
                    </td>
                </tr>
            `;
            contenido.insertAdjacentHTML('beforeend', row);
        });
    } else {
        contenido.innerHTML = '<tr><td colspan="6" class="text-center">No tienes pedidos registrados</td></tr>';
    }
}

// Inicializar la función de listar pedidos cuando el documento esté listo
document.addEventListener('DOMContentLoaded', listarPedidos);
