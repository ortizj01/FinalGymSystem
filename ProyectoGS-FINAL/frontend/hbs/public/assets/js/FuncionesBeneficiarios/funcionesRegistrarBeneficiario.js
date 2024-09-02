async function inicializarBusquedaCliente() {
    const documentosMostrados = new Set();

    document.getElementById('buscarCliente').addEventListener('input', async function(event) {
        const documento = event.target.value;
        const resultadosBusqueda = document.getElementById('resultadosBusqueda');

        // Validar que solo se ingresen caracteres numéricos
        if (!/^\d*$/.test(documento)) {
            event.target.value = documento.replace(/\D/g, ''); // Remover caracteres no numéricos
            return;
        }

        resultadosBusqueda.innerHTML = ''; // Limpiar resultados previos
        documentosMostrados.clear(); // Reiniciar el conjunto de documentos mostrados

        if (documento.length >= 1) { // Realizar la búsqueda si hay al menos 1 carácter
            const clientes = await buscarClientesPorDocumento(documento);

            if (clientes && clientes.length > 0) {
                clientes.forEach(cliente => {
                    if (!documentosMostrados.has(cliente.Documento)) {
                        documentosMostrados.add(cliente.Documento);
                        const item = document.createElement('a');
                        item.classList.add('list-group-item', 'list-group-item-action');
                        item.textContent = `${cliente.Documento} - ${cliente.Nombres} ${cliente.Apellidos}`;
                        item.addEventListener('click', () => {
                            document.getElementById('cliente').value = cliente.IdUsuario;
                            document.getElementById('buscarCliente').value = cliente.Documento;
                            document.getElementById('nombreClienteSeleccionado').value = `${cliente.Nombres} ${cliente.Apellidos}`;
                            resultadosBusqueda.innerHTML = '';
                            document.getElementById('clienteHelp').textContent = `Cliente seleccionado: ${cliente.Nombres} ${cliente.Apellidos}`;
                        });
                        resultadosBusqueda.appendChild(item);
                    }
                });
            } else {
                resultadosBusqueda.innerHTML = '<div class="list-group-item">No se encontraron coincidencias</div>';
            }
        } else {
            resultadosBusqueda.innerHTML = ''; // Limpiar resultados si no hay caracteres
        }
    });

    // Función de búsqueda de clientes por documento (excluyendo beneficiarios)
    const buscarClientesPorDocumento = async (documento) => {
        try {
            const response = await fetch(`http://localhost:3000/api/clientes/buscar/${documento}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('No se encontraron coincidencias');
            }

            const clientes = await response.json();
            return clientes;

        } catch (error) {
            console.error('Error:', error.message);
        }
    };
}

async function registrar() {
    const formBeneficiario = document.getElementById('formularioRegistro');

    // Obtener los valores del formulario de beneficiario
    const formDataBeneficiario = new FormData(formBeneficiario);
    const dataBeneficiario = Object.fromEntries(formDataBeneficiario.entries());

    // Estructura de los datos para la API
    const usuario = {
        Documento: dataBeneficiario.documento,
        TipoDocumento: dataBeneficiario.tipoDocumento,
        Nombres: dataBeneficiario.nombres,
        Apellidos: dataBeneficiario.apellidos,
        Correo: dataBeneficiario.correo,
        Telefono: dataBeneficiario.telefono,
        FechaDeNacimiento: dataBeneficiario.fechaDeNacimiento,
        Direccion: dataBeneficiario.direccion,
        Genero: dataBeneficiario.genero,
        Contrasena: dataBeneficiario.contrasena,
        Estado: dataBeneficiario.estado,
        Beneficiario: dataBeneficiario.cliente
    };

    console.log(usuario);

    // Estructura de los datos para la API de valoración médica
    const valoracionMedica = {
        TieneCondicionCronica: dataBeneficiario.TieneCondicionCronica,
        CirugiaPrevia: dataBeneficiario.CirugiaPrevia,
        AlergiasConocidas: dataBeneficiario.AlergiasConocidas,
        MedicamentosActuales: dataBeneficiario.MedicamentosActuales,
        LesionesMusculoesqueleticas: dataBeneficiario.LesionesMusculoesqueleticas,
        EnfermedadCardiacaVascular: dataBeneficiario.EnfermedadCardiacaVascular,
        AntecedentesFamiliares: dataBeneficiario.AntecedentesFamiliares,
        TipoAfiliacion: dataBeneficiario.TipoAfiliacion,
        IMC: dataBeneficiario.IMC
    };

    // Verificar que todos los campos obligatorios están llenos
    for (const [key, value] of Object.entries(usuario)) {
        if (!value) {
            console.error(`El campo ${key} está vacío`);
            Swal.fire({
                icon: "error",
                title: "¡Oops...",
                text: `Por favor, complete el campo ${key}`
            });
            return;
        }
    }

    for (const [key, value] of Object.entries(valoracionMedica)) {
        if (!value) {
            console.error(`El campo ${key} está vacío`);
            Swal.fire({
                icon: "error",
                title: "¡Oops...",
                text: `Por favor, complete el campo ${key}`
            });
            return;
        }
    }

    try {
        // Registrar usuario
        const response = await fetch('http://localhost:3000/api/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuario)
        });

        const result = await response.json();

        if (response.ok) {
            const usuarioId = result.IdUsuario;

            // Verificar si se debe asignar el rol de beneficiario (rol 4)
            const rolesAsignados = [{ IdRol: 4 }]; // Rol de beneficiario

            // Asignar roles
            const asignacionRolesPromises = rolesAsignados.map(async (rol) => {
                const rolResponse = await fetch(`http://localhost:3000/api/usuariosRol/${usuarioId}/roles`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(rol)
                });
                return rolResponse.ok;
            });

            // Esperar a que se completen todas las asignaciones de roles
            const asignacionesCompletadas = await Promise.all(asignacionRolesPromises);

            // Verificar el resultado de todas las asignaciones
            if (asignacionesCompletadas.every(ok => ok)) {
                console.log('Usuario registrado y roles asignados exitosamente');

                valoracionMedica.IdUsuario = usuarioId;

                try {
                    // Registrar valoración médica
                    const valoracionResponse = await fetch('http://localhost:3000/api/valoracionesMedicas', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(valoracionMedica)
                    });

                    const valoracionResult = await valoracionResponse.json();

                    if (valoracionResponse.ok) {
                        Swal.fire({
                            title: "¡Excelente!",
                            text: "Beneficiario y Valoración Médica Registrados Correctamente!",
                            icon: "success"
                        }).then(() => {
                            location.reload();
                        });
                    } else {
                        console.log('Error al registrar la valoración médica: ' + valoracionResult.message);
                        Swal.fire({
                            icon: "error",
                            title: "¡Oops...",
                            text: "Ocurrió un error al registrar la valoración médica"
                        });
                    }
                } catch (error) {
                    console.error('Error:', error);
                    Swal.fire({
                        icon: "error",
                        title: "¡Oops...",
                        text: "Ocurrió un error al registrar la valoración médica"
                    });
                }
            } else {
                Swal.fire({
                    icon: "error",
                    title: "¡Oops...",
                    text: "Ingresa los datos correctos"
                });
                console.log('Error al asignar roles al usuario');
            }
        } else {
            console.log('Error al registrar el usuario: ' + result.message);
            Swal.fire({
                icon: "error",
                title: "¡Oops...",
                text: result.message
            });
        }
    } catch (error) {
        console.error('Error:', error);
        console.log('Ocurrió un error al registrar el usuario');
        Swal.fire({
            icon: "error",
            title: "¡Oops...",
            text: "Ocurrió un error al registrar el usuario"
        });
    }
}

// Manejo de la visibilidad de la contraseña
document.getElementById('togglePassword').addEventListener('click', function () {
    togglePasswordVisibility('contrasena');
});

document.getElementById('toggleConfirmPassword').addEventListener('click', function () {
    togglePasswordVisibility('confirmarContrasena');
});

function togglePasswordVisibility(inputId) {
    var passwordInput = document.getElementById(inputId);
    var buttonText = document.getElementById('toggle' + inputId.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase());

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        buttonText.textContent = 'Ocultar';
    } else {
        passwordInput.type = 'password';
        buttonText.textContent = 'Mostrar';
    }
}
