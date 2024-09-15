// Mostrar/ocultar formulario de valoración médica según el valor de beneficiario
document.getElementById('beneficiario').addEventListener('change', function() {
    const valoracionMedica = document.getElementById('valoracionMedica');
    if (this.value === '1') {
        valoracionMedica.style.display = 'block';
    } else {
        valoracionMedica.style.display = 'none';
    }
});

function calcularIMC() {
    const peso = parseFloat(document.getElementById('Peso').value);
    const altura = parseFloat(document.getElementById('Altura').value.replace(',', '.'));
    if (peso && altura) {
        const imc = (peso / (altura * altura)).toFixed(2);
        document.getElementById('IMC').value = imc;
    }
}

// Escuchar cambios en los campos de peso y altura
document.getElementById('Peso').addEventListener('input', calcularIMC);
document.getElementById('Altura').addEventListener('input', calcularIMC);

async function registrarCliente() {
    const form = document.getElementById('formularioRegistro');

    // Verificar si se seleccionó "Sí" en el campo beneficiario
    const beneficiario = document.getElementById('beneficiario').value;
    if (beneficiario === '1') {
        // Validar los campos de valoración médica
        const valoracionCampos = document.querySelectorAll('#valoracionMedica input, #valoracionMedica select');
        for (const campo of valoracionCampos) {
            if (!campo.value) {
                Swal.fire({
                    icon: "error",
                    title: "¡Oops...",
                    text: "Todos los campos de valoración médica son obligatorios."
                });
                return;
            }
        }
    }

    // Obtener los valores del formulario
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Estructura de los datos para la API
    const usuario = {
        Documento: data.documento,
        TipoDocumento: data.tipoDocumento,
        Nombres: data.nombres,
        Apellidos: data.apellidos,
        Correo: data.correo,
        Telefono: data.telefono,
        FechaDeNacimiento: data.fechaDeNacimiento,
        Direccion: data.direccion,
        Genero: data.genero,
        Contrasena: data.contrasena,
        Estado: data.estado,
        Beneficiario: null
    };

    try {
        // Registrar usuario
        const response = await fetch('https://finalgymsystem.onrender.com/api/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuario)
        });

        const result = await response.json();

        if (response.ok) {
            const usuarioId = result.IdUsuario;

            // Asignar rol de cliente (rol 3)
            const rolesAsignados = [];
            rolesAsignados.push({ IdRol: 3 }); // Rol de cliente siempre se asigna

            // Verificar si se debe asignar el rol de beneficiario (rol 4)
            if (data.beneficiario === '1') {
                rolesAsignados.push({ IdRol: 4 }); // Rol de beneficiario
            }

            // Asignar roles
            const asignacionRolesPromises = rolesAsignados.map(async (rol) => {
                const rolResponse = await fetch(`https://finalgymsystem.onrender.com/api/usuariosRol/${usuarioId}/roles`, {
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
                // Si es beneficiario, registrar la valoración médica
                if (data.beneficiario === '1') {
                    const valoracionMedica = {
                        IdUsuario: usuarioId,
                        TieneCondicionCronica: data.TieneCondicionCronica,
                        CirugiaPrevia: data.CirugiaPrevia,
                        AlergiasConocidas: data.AlergiasConocidas,
                        MedicamentosActuales: data.MedicamentosActuales,
                        LesionesMusculoesqueleticas: data.LesionesMusculoesqueleticas,
                        EnfermedadCardiacaVascular: data.EnfermedadCardiacaVascular,
                        AntecedentesFamiliares: data.AntecedentesFamiliares,
                        TipoAfiliacion: data.TipoAfiliacion,
                        Peso: data.Peso,
                        Altura: data.Altura,
                        IMC: data.IMC
                    };

                    const valoracionResponse = await fetch('https://finalgymsystem.onrender.com/api/valoracionesMedicas', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(valoracionMedica)
                    });

                    if (!valoracionResponse.ok) {
                        throw new Error('Error al registrar la valoración médica');
                    }
                }

                Swal.fire({
                    title: "¡Excelente!",
                    text: "Cliente Registrado Correctamente!",
                    icon: "success"
                }).then(() => {
                    location.reload();
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "¡Oops...",
                    text: "Error al asignar roles al usuario"
                });
            }
        } else {
            let mensajeError = result.message;
            if (response.status === 500) {
                mensajeError = "Todos los datos son obligatorios.";
            }
            Swal.fire({
                icon: "error",
                title: "¡Oops...",
                text: mensajeError
            });
        }
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "¡Oops...",
            text: "Ocurrió un error al registrar el usuario"
        });
    }
}
