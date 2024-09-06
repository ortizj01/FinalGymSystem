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
            const estadoTexto = beneficiario.Estado === 1 ? 'Activo' : 'Inactivo';

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
            <a href="#" onclick="verDetalleBeneficiario(${beneficiario.IdUsuario})" data-bs-toggle="modal" data-bs-target="#modalVerDetalleBeneficiario"><i class="fa-regular fa-eye fa-xl me-2"></i></a>`;
            
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
        // Manejar el error en caso necesario
    }
};

document.addEventListener('DOMContentLoaded', listarBeneficiarios);

async function verDetalleBeneficiario(beneficiarioId) {
    try {
        const response = await fetch(`http://localhost:3000/api/usuarios/${beneficiarioId}`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener los detalles del beneficiario');
        }

        const beneficiario = await response.json();

        const estadoTexto = beneficiario.Estado === 1 ? 'Activo' : 'Inactivo';
        const fecha = new Date(beneficiario.FechaDeNacimiento);
        const fechaFormateada = `${String(fecha.getDate()).padStart(2, '0')}/${String(fecha.getMonth() + 1).padStart(2, '0')}/${fecha.getFullYear()}`;

        // Conversión del tipo de documento para mostrar en el frontend
        let tipoDocumentoTexto = beneficiario.TipoDocumento;
        if (tipoDocumentoTexto === "cedula_ciudadania") {
            tipoDocumentoTexto = "Cédula de ciudadanía";
        } else if (tipoDocumentoTexto === "pasaporte") {
            tipoDocumentoTexto = "Pasaporte";
        }

        document.getElementById('documentoBeneficiario').value = beneficiario.Documento;
        document.getElementById('nombreBeneficiario').value = beneficiario.Nombres;
        document.getElementById('emailBeneficiario').value = beneficiario.Correo;
        document.getElementById('TelefonoBeneficiario').value = beneficiario.Telefono;
        document.getElementById('direccionBeneficiario').value = beneficiario.Direccion;
        document.getElementById('apellidosBeneficiario').value = beneficiario.Apellidos;
        document.getElementById('tipoDocumentoBeneficiario').value = tipoDocumentoTexto;
        document.getElementById('fechaNacimientoBeneficiario').value = fechaFormateada;
        document.getElementById('estadoBeneficiario').value = estadoTexto;
        document.getElementById('generoBeneficiario').value = beneficiario.Genero;
    } catch (error) {
        console.error('Error al cargar los detalles del beneficiario:', error);
    }
}
