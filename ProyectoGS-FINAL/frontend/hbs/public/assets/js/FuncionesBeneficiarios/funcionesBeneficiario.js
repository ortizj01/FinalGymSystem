//LISTAR BENEFICIARIOS

const listarBeneficiarios = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/beneficiarios', {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener los beneficiarios');
        }

        const listarBeneficiarios = await response.json();

        // Obtener todos los usuarios para verificar beneficiarios
        const responseUsuarios = await fetch('http://localhost:3000/api/usuarios', {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!responseUsuarios.ok) {
            throw new Error('Error al obtener todos los usuarios');
        }

        const usuarios = await responseUsuarios.json();

        let contenido = '';

        listarBeneficiarios.forEach(beneficiario => {
            const estadoTexto = beneficiario.Estado === 0 ? 'Activo' : 'Inactivo';

            // Verificar si el campo Beneficiario tiene un valor que coincide con un IdUsuario existente
            const esBeneficiarioValido = usuarios.some(usuario => usuario.IdUsuario === beneficiario.Beneficiario);

            contenido += `<tr>` +
                `<td>${beneficiario.Documento}</td>` +
                `<td>${beneficiario.Nombres}</td>` +
                `<td>${beneficiario.Telefono}</td>` +
                `<td>${beneficiario.Correo}</td>` +
                `<td>${estadoTexto}</td>` +
                `<td style="text-align: center;">
                    <div class="centered-container">
                        <a href="editarBeneficiario?id=${beneficiario.IdUsuario}"><i class="fa-regular fa-pen-to-square fa-xl me-2"></i></a>
                        <a href="detalleBeneficiario?id=${beneficiario.IdUsuario}"><i class="fa-regular fa-eye fa-xl me-2"></i></a>`;
            
            // Mostrar el icono si el campo Beneficiario tiene un IdUsuario válido
            if (esBeneficiarioValido) {
                contenido += `<a href="detalleBeneficiarioCliente?id=${beneficiario.Beneficiario}"><i class="fa-regular fa-user fa-xl me-2"></i></a>`;
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

document.addEventListener('DOMContentLoaded', listarBeneficiarios);
