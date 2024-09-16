
//VER DETALLE BENEFICIARIOS
async function cargarDatosBeneficiario() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (id) {
        try {
            const response = await fetch(`https://finalgymsystem.onrender.com/api/usuarios/${id}`, {
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

            const estadoTexto = cliente.Estado === 0 ? 'Activo' : 'Inactivo';
            const fechaNacimiento = new Date(cliente.FechaDeNacimiento);
            const formattedFechaNacimiento = `${fechaNacimiento.getDate().toString().padStart(2, '0')}/${(fechaNacimiento.getMonth() + 1).toString().padStart(2, '0')}/${fechaNacimiento.getFullYear()}`;

            document.getElementById('documentoCliente').value = cliente.Documento;
            document.getElementById('nombreCliente').value = cliente.Nombres;
            document.getElementById('emailCliente').value = cliente.Correo;
            document.getElementById('TelefonoCliente').value = cliente.Telefono;
            document.getElementById('direccionCliente').value = cliente.Direccion;
            document.getElementById('apellidosCliente').value = cliente.Apellidos;
            document.getElementById('tipoDocumentoCliente').value = cliente.TipoDocumento;
            document.getElementById('fechaNacimientoCliente').value = formattedFechaNacimiento;
            document.getElementById('estadoCliente').value = estadoTexto;
            document.getElementById('generoCliente').value = cliente.Genero;

            // Obtener los datos de la valoración médica por ID de usuario
            const valoracionResponse = await fetch(`https://finalgymsystem.onrender.com/api/valoracionesMedicas/usuario/${id}`, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!valoracionResponse.ok) {
                throw new Error('Error al obtener los detalles de la valoración médica');
            }

            const valoraciones = await valoracionResponse.json();

            if (valoraciones.length > 0) {
                const valoracion = valoraciones[0]; // Suponiendo que solo hay una valoración por usuario
                document.getElementById('TieneCondicionCronica').value = valoracion.TieneCondicionCronica;
                document.getElementById('CirugiaPrevia').value = valoracion.CirugiaPrevia;
                document.getElementById('AlergiasConocidas').value = valoracion.AlergiasConocidas;
                document.getElementById('MedicamentosActuales').value = valoracion.MedicamentosActuales;
                document.getElementById('LesionesMusculoesqueleticas').value = valoracion.LesionesMusculoesqueleticas;
                document.getElementById('EnfermedadCardiacaVascular').value = valoracion.EnfermedadCardiacaVascular;
                document.getElementById('AntecedentesFamiliares').value = valoracion.AntecedentesFamiliares;
                document.getElementById('TipoAfiliacion').value = valoracion.TipoAfiliacion;
                document.getElementById('Peso').value = valoracion.Peso;
                document.getElementById('Altura').value = valoracion.Altura;
                document.getElementById('IMC').value = valoracion.IMC;
            } else {
                console.error('No se encontró una valoración médica para el usuario con ID:', id);
            }

            // Verificar si el usuario tiene un beneficiario asociado
            if (cliente.Beneficiario) {
                const beneficiarioResponse = await fetch(`https://finalgymsystem.onrender.com/api/usuarios/${cliente.Beneficiario}`, {
                    method: 'GET',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!beneficiarioResponse.ok) {
                    throw new Error('Error al obtener los detalles del cliente asociado');
                }

                const beneficiario = await beneficiarioResponse.json();

                const estadoAsociadoTexto = beneficiario.Estado === 0 ? 'Activo' : 'Inactivo';
                const fechaNacimientoAsociado = new Date(beneficiario.FechaDeNacimiento);
                const formattedFechaNacimientoAsociado = `${fechaNacimientoAsociado.getDate().toString().padStart(2, '0')}/${(fechaNacimientoAsociado.getMonth() + 1).toString().padStart(2, '0')}/${fechaNacimientoAsociado.getFullYear()}`;

                document.getElementById('acordeonCliente').style.display = 'block';
                document.getElementById('documentoAsociado').value = beneficiario.Documento;
                document.getElementById('nombreAsociado').value = beneficiario.Nombres;
                document.getElementById('emailAsociado').value = beneficiario.Correo;
                document.getElementById('TelefonoAsociado').value = beneficiario.Telefono;
                document.getElementById('direccionAsociado').value = beneficiario.Direccion;
                document.getElementById('apellidosAsociado').value = beneficiario.Apellidos;
                document.getElementById('tipoDocumentoAsociado').value = beneficiario.TipoDocumento;
                document.getElementById('fechaNacimientoAsociado').value = formattedFechaNacimientoAsociado;
                document.getElementById('estadoAsociado').value = estadoAsociadoTexto;
                document.getElementById('generoAsociado').value = beneficiario.Genero;
            }
        } catch (error) {
            console.error('Error:', error.message);
            // Manejar el error en caso necesario
        }
    }
}

document.addEventListener('DOMContentLoaded', cargarDatosBeneficiario);
