// Mapa de estados de pedidos
const estadoMap = {
    1: 'PENDIENTE DE PAGO',
    2: 'PAGADO',
    3: 'ANULADO'
};

// Función para obtener el documento del cliente por su ID
const obtenerDocumentoCliente = async (idUsuario) => {
    try {
        const response = await fetch(`http://localhost:3000/api/usuarios/${idUsuario}`, {
            method: 'GET',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            throw new Error('Error al obtener el documento del cliente');
        }

        const cliente = await response.json();
        return cliente.Documento || 'No encontrado';
    } catch (error) {
        console.error('Error:', error.message);
        return 'Error';
    }
};

// Función para formatear la fecha en DD/MM/AAAA
const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
};

// Función para formatear números como cantidades de dinero sin decimales con separadores de miles
const formatearDinero = (cantidad) => {
    return cantidad.toLocaleString('es-ES', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 });
};

// Función para listar los pedidos y mostrarlos en la tabla
const listarPedidos = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/pedidos', {
            method: 'GET',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            throw new Error('Error al obtener los pedidos');
        }

        const pedidos = await response.json();
        let contenido = '';

        for (const pedido of pedidos) {
            try {
                const documentoCliente = await obtenerDocumentoCliente(pedido.IdUsuario);

                const estadoTexto = estadoMap[pedido.EstadoPedido];
                const fechaFormateada = formatearFecha(pedido.FechaPedido);
                const totalFormateado = formatearDinero(pedido.Total);

                contenido += `
                    <tr>
                        <td>${pedido.IdPedido}</td>
                        <td>${documentoCliente}</td>
                        <td>${fechaFormateada}</td>
                        <td>${totalFormateado}</td>
                        <td>${estadoTexto}</td>
                        <td style="text-align: center;">
                            <div class="centered-container">
                                <a href="javascript:void(0);" onclick="abrirModalEditarEstado(${pedido.IdPedido}, ${pedido.EstadoPedido})"><i class="fa-regular fa-pen-to-square fa-xl me-2"></i></a>
                                <a href="detallePedido?id=${pedido.IdPedido}"><i class="fa-regular fa-eye fa-xl me-2"></i></a>
                            </div>
                        </td>
                    </tr>`;
            } catch (error) {
                console.error(`Error al procesar el pedido ${pedido.IdPedido}:`, error.message);
                continue; // Continuar con el siguiente pedido si hay un error
            }
        }

        const objectId = document.getElementById('contenido');
        if (objectId) {
            objectId.innerHTML = contenido;
        } else {
            console.error('No se encontró el elemento con id "contenido"');
        }

        // Inicializar DataTables después de agregar los datos al DOM
        $('#dataTable').DataTable({
            language: {
                url: 'https://cdn.datatables.net/plug-ins/1.10.20/i18n/Spanish.json',
                paginate: { previous: "Anterior", next: "Siguiente" },
                search: "Buscar:",
                lengthMenu: "Mostrar _MENU_ registros",
                info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
                infoEmpty: "No hay registros disponibles",
                infoFiltered: "(filtrado de _MAX_ registros totales)",
                zeroRecords: "No se encontraron coincidencias",
                emptyTable: "No hay datos disponibles en la tabla",
                loadingRecords: "Cargando...",
                processing: "Procesando...",
            },
            pageLength: 5,
            lengthChange: false,
            destroy: true // Destruir cualquier instancia previa de DataTables para evitar conflictos
        });
    } catch (error) {
        console.error('Error:', error.message);
    }
};


// Función para editar el estado del pedido y actualizarlo si es necesario
const editarEstadoPedido = async (pedidoId, nuevoEstado) => {
    if (nuevoEstado == 3) { // Si el estado es "ANULADO"
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
            // Recargar la página después de cerrar el modal para reflejar los cambios
            return;
        } catch (error) {
            console.error('Error al anular el pedido:', error.message);
            return; // Terminar si hay un error
        }
    } else if (nuevoEstado == 2) { // Si el estado es "PAGADO"
        const confirmResult = await Swal.fire({
            title: '¿Confirmar Pago?',
            text: "Esta acción registrará la venta y actualizará el estado del pedido a PAGADO.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, confirmar',
            cancelButtonText: 'Cancelar'
        });

        if (!confirmResult.isConfirmed) {
            return; // Si el usuario cancela, no hacemos nada
        }
    }

    try {
        // Actualizar el estado del pedido
        const response = await fetch(`http://localhost:3000/api/pedidos/estado/${pedidoId}`, {
            method: 'PUT',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ EstadoPedido: nuevoEstado })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al actualizar el estado del pedido');
        }

        Swal.fire({
            icon: 'success',
            title: 'Pagado',
            text: 'El pedido ha sido PAGADO, la venta fue registrada',
        }).then(() => {
            location.reload(); // Recarga la página después de que se cierra el SweetAlert
        });

        listarPedidos(); // Actualizar la lista de pedidos

    } catch (error) {
        console.error('Error:', error.message);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message || 'Hubo un problema al actualizar el estado del pedido.'
        });
    }
}

// Función para anular un pedido y devolver el stock
const anularPedido = async (pedidoId) => {
    try {
        const response = await fetch(`http://localhost:3000/api/pedidos/cancelar/${pedidoId}`, {
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
        
        listarPedidos();
        
    } catch (error) {
        console.error('Error:', error.message);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message || 'Hubo un problema al anular el pedido.'
        });
    }
};

// Función para abrir el modal de edición de estado del pedido
function abrirModalEditarEstado(pedidoId, estadoActual) {
    pedidoIdGlobal = pedidoId;

    const selectEstado = document.getElementById('nuevoEstado');
    const guardarBtn = document.getElementById('guardarBtn');

    selectEstado.innerHTML = `
        <option value="1" ${estadoActual == 1 ? 'selected' : ''}>PENDIENTE DE PAGO</option>
        <option value="2" ${estadoActual == 2 ? 'selected' : ''}>PAGADO</option>
        <option value="3" ${estadoActual == 3 ? 'selected' : ''}>ANULADO</option>
    `;

    // Deshabilitar el selector y ocultar el botón "Guardar" si el estado es ANULADO o PAGADO
    if (estadoActual == 3 || estadoActual == 2) {
        selectEstado.disabled = true;
        guardarBtn.style.display = 'none'; // Ocultar el botón "Guardar"
    } else {
        selectEstado.disabled = false;
        guardarBtn.style.display = 'inline-block'; // Mostrar el botón "Guardar"
    }

    $('#modalEditarEstado').modal('show');
}

// Función para actualizar el estado del pedido desde el modal
function actualizarEstadoPedido() {
    const nuevoEstado = document.getElementById('nuevoEstado').value;
    editarEstadoPedido(pedidoIdGlobal, nuevoEstado);
    $('#modalEditarEstado').modal('hide');
}

// Vincular evento de cierre al botón "Guardar"
document.querySelector('#guardarBtn').addEventListener('click', () => {
    $('#modalEditarEstado').modal('hide');
});

// Vincular evento de cierre al botón "Cancelar"
document.querySelector('.btn-secondary').addEventListener('click', () => {
    $('#modalEditarEstado').modal('hide');
});

// Vincular evento de cierre al botón "X"
document.querySelector('.close').addEventListener('click', () => {
    $('#modalEditarEstado').modal('hide');
});
