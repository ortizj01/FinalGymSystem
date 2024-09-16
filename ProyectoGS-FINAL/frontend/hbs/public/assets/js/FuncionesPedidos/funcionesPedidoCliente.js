// Mapa de estados de pedidos
const estadoMap = {
    1: 'Pendiente de pago',
    2: 'Pagado',
    3: 'Anulado'
};

// Función para mostrar los pedidos en la tabla
function mostrarPedidosEnTabla(pedidos) {
    const contenido = document.getElementById('contenido');
    contenido.innerHTML = '';  // Limpiar contenido previo

    if (pedidos.length > 0) {
        pedidos.forEach(pedido => {
            const estadoTexto = estadoMap[pedido.EstadoPedido] || 'Desconocido';
            const row = `
                <tr>
                    <td>${pedido.IdPedido}</td>
                    <td>${pedido.Documento}</td>
                    <td>${new Date(pedido.FechaPedido).toLocaleDateString()}</td>
                    <td>$${pedido.Total.toFixed(2)}</td>
                    <td>${estadoTexto}</td>
                    <td style="text-align: center;">
                        <div class="centered-container">
                            <a href="javascript:void(0);" onclick="abrirModalEditarEstado(${pedido.IdPedido}, ${pedido.EstadoPedido})"><i class="fa-regular fa-pen-to-square fa-xl me-2"></i></a>
                            <a href="detallePedido?id=${pedido.IdPedido}"><i class="fa-regular fa-eye fa-xl me-2"></i></a>
                        </div>
                    </td>
                </tr>
            `;
            contenido.insertAdjacentHTML('beforeend', row);
        });
    } else {
        contenido.innerHTML = '<tr><td colspan="6" class="text-center">No tienes pedidos registrados</td></tr>';
    }
    // Inicializar DataTable si no está inicializado
    if (!$.fn.DataTable.isDataTable('#dataTable')) {
        $('#dataTable').DataTable({
            pageLength: 5,
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
    }
}

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

// Función para obtener los pedidos asociados al cliente
async function obtenerPedidosCliente(idUsuario) {
    try {
        const response = await fetch(`https://finalgymsystem.onrender.com/api/pedido/usuario/${idUsuario}`, {
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

// Función para abrir el modal de edición de estado del pedido
function abrirModalEditarEstado(pedidoId, estadoActual) {
    pedidoIdGlobal = pedidoId;

    const selectEstado = document.getElementById('nuevoEstado');
    const guardarBtn = document.getElementById('guardarBtn');

    // Configurar el select de estado según el estado actual
    if (estadoActual == 1) { // Estado "Pendiente de pago"
        selectEstado.innerHTML = `
            <option value="3">Anulado</option>
        `;
        selectEstado.disabled = false;
        guardarBtn.style.display = 'inline-block'; // Mostrar el botón "Guardar"
    } else if (estadoActual == 2) { // Estado "Pagado"
        selectEstado.innerHTML = `<option value="2" selected>Pagado</option>`;
        selectEstado.disabled = true; // No permitir cambios
        guardarBtn.style.display = 'none'; // Ocultar el botón "Guardar"
    } else if (estadoActual == 3) { // Estado "Anulado"
        selectEstado.innerHTML = `<option value="3" selected>Anulado</option>`;
        selectEstado.disabled = true; // No permitir cambios
        guardarBtn.style.display = 'none'; // Ocultar el botón "Guardar"
    }

    $('#modalEditarEstado').modal('show');
}

// Función para editar el estado del pedido y actualizarlo si es necesario
const editarEstadoPedido = async (pedidoId, nuevoEstado) => {
    if (nuevoEstado == 3) { // Si el nuevo estado es "Anulado"
        const confirmResult = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción anulará el pedido y devolverá el stock asociado.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, anular',
            cancelButtonText: 'Cancelar'
        });

        if (!confirmResult.isConfirmed) {
            return; // Si el usuario cancela, no hacemos nada
        }

        try {
            // Anular el pedido y devolver el stock
            await anularPedido(pedidoId);
            $('#modalEditarEstado').modal('hide'); // Cerrar el modal
            listarPedidos(); // Actualizar la lista de pedidos
        } catch (error) {
            console.error('Error al anular el pedido:', error.message);
        }
    }
}

// Función para anular un pedido y devolver el stock
const anularPedido = async (pedidoId) => {
    try {
        const response = await fetch(`https://finalgymsystem.onrender.com/api/pedidos/cancelar/${pedidoId}`, {
            method: 'PUT',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al anular el pedido');
        }

        Swal.fire({
            icon: 'success',
            title: 'Anulado',
            text: 'El pedido ha sido anulado y el stock ha sido devuelto correctamente.',
        }).then(() => {
            location.reload(); // Recarga la página después de que se cierra el SweetAlert
        });
    } catch (error) {
        console.error('Error:', error.message);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message || 'Hubo un problema al anular el pedido.'
        });
    }
};

// Inicializar la función de listar pedidos cuando el documento esté listo
document.addEventListener('DOMContentLoaded', listarPedidos);

// Función para actualizar el estado del pedido desde el modal
function actualizarEstadoPedido() {
    const nuevoEstado = document.getElementById('nuevoEstado').value;
    editarEstadoPedido(pedidoIdGlobal, nuevoEstado);
}

// Asignar eventos a los botones del modal
document.querySelector('.close').addEventListener('click', () => {
    $('#modalEditarEstado').modal('hide');
});

document.querySelector('.btn-secondary').addEventListener('click', () => {
    $('#modalEditarEstado').modal('hide');
});
