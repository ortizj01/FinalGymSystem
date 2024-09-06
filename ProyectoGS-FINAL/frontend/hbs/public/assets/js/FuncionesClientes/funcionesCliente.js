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
                        <a href="#" onclick="verDetalleCliente(${cliente.IdUsuario})" data-bs-toggle="modal" data-bs-target="#modalVerDetalleCliente"><i class="fa-regular fa-eye fa-xl me-2"></i></a>`;
            
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

    } catch (error) {
        console.error('Error:', error.message);
    }
};

document.addEventListener('DOMContentLoaded', listarClientes);

async function verDetalleCliente(clienteId) {
    try {
        const response = await fetch(`http://localhost:3000/api/usuarios/${clienteId}`, {
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

        const estadoTexto = cliente.Estado === 1 ? 'Activo' : 'Inactivo';
        const fecha = new Date(cliente.FechaDeNacimiento);
        const fechaFormateada = `${String(fecha.getDate()).padStart(2, '0')}/${String(fecha.getMonth() + 1).padStart(2, '0')}/${fecha.getFullYear()}`;

        // Conversión del tipo de documento para mostrar en el frontend
        let tipoDocumentoTexto = cliente.TipoDocumento;
        if (tipoDocumentoTexto === "cedula_ciudadania") {
            tipoDocumentoTexto = "Cédula de ciudadanía";
        } else if (tipoDocumentoTexto === "pasaporte") {
            tipoDocumentoTexto = "Pasaporte";
        }

        document.getElementById('documentoCliente').value = cliente.Documento;
        document.getElementById('nombreCliente').value = cliente.Nombres;
        document.getElementById('emailCliente').value = cliente.Correo;
        document.getElementById('TelefonoCliente').value = cliente.Telefono;
        document.getElementById('direccionCliente').value = cliente.Direccion;
        document.getElementById('apellidosCliente').value = cliente.Apellidos;
        document.getElementById('tipoDocumentoCliente').value = tipoDocumentoTexto;
        document.getElementById('fechaNacimientoCliente').value = fechaFormateada;
        document.getElementById('estadoCliente').value = estadoTexto;
        document.getElementById('generoCliente').value = cliente.Genero;
    } catch (error) {
        console.error('Error al cargar los detalles del cliente:', error);
    }
}
