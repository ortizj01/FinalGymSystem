// funcionesCliente.js

// LISTAR CLIENTES
const listarClientes = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/clientes', {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener los clientes');
        }

        const listarClientes = await response.json();

        let contenido = '';

        listarClientes.forEach(cliente => {
            const estadoTexto = cliente.Estado === 1 ? 'Activo' : 'Inactivo';

            contenido += `<tr>` +
                `<td>${cliente.Documento}</td>` +
                `<td>${cliente.Nombres}</td>` +
                `<td>${cliente.Telefono}</td>` +
                `<td>${cliente.Correo}</td>` +
                `<td>${estadoTexto}</td>` +
                `<td style="text-align: center;">
                    <div class="centered-container">
                        <a href="editarCliente?id=${cliente.IdUsuario}"><i class="fa-regular fa-pen-to-square fa-xl me-2"></i></a>
                        <a href="detalleCliente?id=${cliente.IdUsuario}"><i class="fa-regular fa-eye fa-xl me-2"></i></a>`;
            
            // Mostrar el icono si tiene beneficiarios
            if (cliente.TieneBeneficiarios > 0) {
                contenido += `<a href="detalleClienteBeneficiario?id=${cliente.IdUsuario}"><i class="fa-regular fa-user fa-xl me-2"></i></a>`;
            }

            contenido += `</div>
                </td>` +
                `</tr>`;
        });

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
                paginate: {
                    previous: "Anterior",
                    next: "Siguiente"
                },
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
        // Manejar el error en caso necesario
    }
};

document.addEventListener('DOMContentLoaded', listarClientes);
