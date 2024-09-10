const urlDevoluciones = 'http://localhost:3000/api/devolucionventas';
const urlVentas = 'http://localhost:3000/api/ventas';
const urlUsuarios = 'http://localhost:3000/api/usuarios';  // Asumiendo que tienes una API para obtener los usuarios


// Función para formatear la fecha en formato dd/mm/yyyy
function formatearFecha(fecha) {
    const date = new Date(fecha);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Los meses son base 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

const listarDevVentas = async () => {
    let ObjectId = document.getElementById('contenidoDevVentas');
    let contenido = '';

    try {
        const response = await fetch(urlDevoluciones, { // Asegúrate que este endpoint devuelva todas las devoluciones
            method: 'GET',
            mode: 'cors',
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }

        const devoluciones = await response.json();

        for (const devolucion of devoluciones) {
            const nombreCliente = `${devolucion.NombreCliente || 'Nombre desconocido'} ${devolucion.ApellidosCliente || ''}`;

            contenido += `
                <tr>
        <td>${nombreCliente}</td>
        <td>${devolucion.Motivo}</td>
        <td>$${devolucion.ValorDevolucionVenta.toFixed(2)}</td>
        <td>${devolucion.FechaDevolucionFormatted}</td>
        <td>${devolucion.estado_descripcion}</td>
        <td style="text-align: center;">
            <div class="centered-container">
                <a href="#" onclick="verDetalleDevolucion(${devolucion.IdDevolucionVenta})">
                    <i class="fa-regular fa-eye fa-xl me-2"></i>
                </a>
            </div>
        </td>
    </tr>
`;
        }

        ObjectId.innerHTML = contenido;

        // Re-inicializar DataTable después de agregar el contenido
        $('#dataTable').DataTable().destroy();
        $('#dataTable').DataTable({
            language: {
                "decimal": "",
                "emptyTable": "No hay información",
                "info": "Mostrando _START_ a _END_ de _TOTAL_ Entradas",
                "infoEmpty": "Mostrando 0 a 0 de 0 Entradas",
                "infoFiltered": "(Filtrado de _MAX_ total entradas)",
                "thousands": ",",
                "lengthMenu": "Mostrar _MENU_ Entradas",
                "loadingRecords": "Cargando...",
                "processing": "Procesando...",
                "search": "Buscar:",
                "zeroRecords": "Sin resultados encontrados",
                "paginate": {
                    "first": "Primero",
                    "last": "Ultimo",
                    "next": "Siguiente",
                    "previous": "Anterior"
                }
            },
            lengthMenu: [5, 10, 25, 50],
            pageLength: 5
        });

    } catch (error) {
        console.error('Error al listar devoluciones:', error);
    }
};

// Función para ver detalles de una devolución en el modal
const verDetalleDevolucion = async (idDevolucion) => {
    try {
        const response = await fetch(`${urlDevoluciones}/${idDevolucion}`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }

        const devolucion = await response.json();
        
        // Formatear la fecha
        const fechaFormateada = formatearFecha(devolucion.FechaDevolucionFormatted);

        // Llenar los campos del modal con los datos obtenidos
        document.getElementById('detalleDevolucionContenido').innerHTML = `
            <p><strong>Cliente:</strong> ${devolucion.NombreCliente} ${devolucion.ApellidosCliente}</p>
            <p><strong>Motivo:</strong> ${devolucion.Motivo}</p>
            <p><strong>Valor Devolución:</strong> $${devolucion.ValorDevolucionVenta.toFixed(2)}</p>
            <p><strong>Fecha Devolución:</strong> ${fechaFormateada}</p>
            <p><strong>Estado:</strong> ${devolucion.estado_descripcion}</p>
        `;

        // Abrir el modal
        $('#detalleDevolucionModal').modal('show');

    } catch (error) {
        console.error('Error al obtener detalles de la devolución:', error);
    }
};


document.addEventListener('DOMContentLoaded', listarDevVentas);
