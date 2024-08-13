const urlVentas = 'http://localhost:3000/api/ventas';
const urlEstadosVentas = 'http://localhost:3000/api/estadosVentas'; // URL para obtener los estados

document.addEventListener('DOMContentLoaded', () => {
    cargarVentas();
    cargarEstados(); // Cargar los estados disponibles
});



async function cargarVentas() {
    try {
        const response = await fetch(urlVentas);
        if (!response.ok) throw new Error('Error al obtener las ventas');
        
        const ventas = await response.json();
        const listaVentas = document.getElementById('listaVentas');
        listaVentas.innerHTML = '';

        for (const venta of ventas) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${venta.NombreCompleto}</td>
                <td>${venta.Documento}</td>
                <td>${new Date(venta.FechaVenta).toLocaleDateString()}</td>
                <td>${venta.Total.toFixed(2)}</td>
                <td>${venta.EstadoVenta || 'Estado desconocido'}</td>
                <td>
                    <i class="fa-regular fa-eye fa-xl me-2" style="color: #f06d00;" onclick="verDetalleVenta(${venta.IdVenta})"></i>
                    <i class="fa-solid fa-exchange-alt fa-xl me-2" style="color: #f06d00;" onclick="abrirModalCambioEstado(${venta.IdVenta}, '${venta.EstadoVenta}')" title="Cambiar Estado"></i>
                    <i class="fa-solid fa-undo fa-xl me-2" style="color: #f06d00;" onclick="redirigirDevolucion(${venta.IdVenta})" title="Devolver Venta"></i>
                </td>
            `;
            listaVentas.appendChild(row);
        }

        // Inicializar DataTable con 5 filas por página y acciones en color naranjado
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
    } catch (error) {
        console.error('Error al cargar las ventas:', error);
    }
}

async function cargarEstados() {
    try {
        const response = await fetch(urlEstadosVentas);
        if (!response.ok) throw new Error('Error al obtener los estados');

        const estados = await response.json();
        const estadoSelect = document.getElementById('nuevoEstado');
        estadoSelect.innerHTML = ''; // Limpiar opciones previas

        for (const estado of estados) {
            const option = document.createElement('option');
            option.value = estado.IdEstadoVenta;
            option.textContent = estado.NombreEstado;
            estadoSelect.appendChild(option);
        }
    } catch (error) {
        console.error('Error al cargar los estados:', error);
    }
}

function abrirModalCambioEstado(idVenta, estadoActual) {
    document.getElementById('cambiarEstadoForm').setAttribute('data-id', idVenta);
    const estadoSelect = document.getElementById('nuevoEstado');

    // Establecer el estado actual como el seleccionado por defecto
    estadoSelect.value = estadoActual;

    $('#cambiarEstadoModal').modal('show');
}

async function cambiarEstado() {
    const idVenta = document.getElementById('cambiarEstadoForm').getAttribute('data-id');
    const nuevoEstado = document.getElementById('nuevoEstado').value;

    try {
        const response = await fetch(`${urlVentas}/${idVenta}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ EstadoVenta: nuevoEstado }) // Enviar el estado correcto
        });

        const data = await response.json();

        if (response.ok) {
            // Verificar si el nuevo estado es "Anulado" (ID 2)
            if (nuevoEstado === '2') {
                await anularVenta(idVenta);
            }

            Swal.fire(
                '¡Éxito!',
                data.message || 'Estado de la venta cambiado correctamente',
                'success'
            );

            $('#cambiarEstadoModal').modal('hide');
            cargarVentas(); // Recargar las ventas después del cambio de estado
        } else {
            Swal.fire(
                '¡Error!',
                data.message || 'Hubo un problema al cambiar el estado de la venta',
                'error'
            );
        }
    } catch (error) {
        console.error('Error al cambiar el estado de la venta:', error);
        Swal.fire(
            '¡Error!',
            'Error al cambiar el estado de la venta',
            'error'
        );
    }
}

async function anularVenta(idVenta) {
    try {
        const response = await fetch(`${urlVentas}/${idVenta}/cancelar`, {
            method: 'PATCH'
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Error al anular la venta');
        }
    } catch (error) {
        console.error('Error al anular la venta:', error);
        Swal.fire(
            '¡Error!',
            'Error al anular la venta y devolver el stock',
            'error'
        );
    }
}

function redirigirDevolucion(idVenta) {
    window.location.href = `formulDevolucion?id=${idVenta}`;
}

async function verDetalleVenta(idVenta) {
    try {
        const response = await fetch(`${urlVentas}/${idVenta}`);
        if (!response.ok) throw new Error('Error al obtener los detalles de la venta');

        const data = await response.json();
        const { NombreCompleto, Documento, FechaVenta, Total, EstadoVenta } = data;

        // Obtener productos y membresías asociados
        const productosResponse = await fetch(`${urlVentas}/${idVenta}/productos`);
        const productos = await productosResponse.json();

        const membresiasResponse = await fetch(`${urlVentas}/${idVenta}/membresias`);
        const membresias = await membresiasResponse.json();

        const detalleVentaContenido = document.getElementById('detalleVentaContenido');
        detalleVentaContenido.innerHTML = `
            <div class="row mb-3">
                <div class="col">
                    <p><strong>Nombre:</strong> ${NombreCompleto}</p>
                    <p><strong>Documento:</strong> ${Documento}</p>
                </div>
                <div class="col">
                    <p><strong>Fecha de Venta:</strong> ${new Date(FechaVenta).toLocaleDateString()}</p>
                    <p><strong>Total:</strong> ${Total.toFixed(2)}</p>
                    <p><strong>Estado:</strong> ${EstadoVenta || 'Estado desconocido'}</p>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <h5><strong>Productos:</strong></h5>
                    <ul>${productos.map(p => `<li>${p.NombreProducto} - Cantidad: ${p.CantidadProducto}</li>`).join('')}</ul>
                </div>
                <div class="col">
                    <h5><strong>Membresías:</strong></h5>
                    <ul>${membresias.map(m => `<li>${m.NombreMembresia} - Cantidad: ${m.Cantidad}</li>`).join('')}</ul>
                </div>
            </div>
        `;

        $('#detalleVentaModal').modal('show');
    } catch (error) {
        console.error('Error al obtener los detalles de la venta:', error);
        Swal.fire(
            '¡Error!',
            'Error al obtener los detalles de la venta',
            'error'
        );
    }
}
