// Mostrar/ocultar formulario de valoración médica según el valor de beneficiario
document.getElementById('beneficiario').addEventListener('change', function() {
    const valoracionMedica = document.getElementById('valoracionMedica');
    const editarValoracionMedicaBtn = document.getElementById('editarValoracionMedicaBtn');

    if (this.value === '1') {
        valoracionMedica.style.display = 'block';
        editarValoracionMedicaBtn.style.display = 'none'; // Ocultar el botón de editar valoración médica
    } else {
        valoracionMedica.style.display = 'none';
        editarValoracionMedicaBtn.style.display = 'none'; // Ocultar el botón de editar valoración médica
    }
});

// Función para calcular el IMC
function calcularIMC() {
    const peso = parseFloat(document.getElementById('Peso').value);
    const altura = parseFloat(document.getElementById('Altura').value);
    
    if (peso && altura) {
        const imc = peso / (altura * altura);
        document.getElementById('IMC').value = imc.toFixed(2);
    }
}

// Añadir listeners a los campos de Peso y Altura
document.getElementById('Peso').addEventListener('input', calcularIMC);
document.getElementById('Altura').addEventListener('input', calcularIMC);

// Cargar datos del cliente y calcular IMC si ya hay datos
async function cargarDatosEditarCliente() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const usuarioId = urlParams.get('id');

        if (!usuarioId) {
            console.error('ID del usuario no encontrado en la URL');
            return;
        }

        const response = await fetch(`http://localhost:3000/api/usuarios/${usuarioId}`);
        if (!response.ok) {
            throw new Error('Error al obtener datos del cliente: ' + response.statusText);
        }
        const cliente = await response.json();

        const fechaNacimiento = new Date(cliente.FechaDeNacimiento);
        const formattedFechaNacimiento = fechaNacimiento.toISOString().split('T')[0];

        document.getElementById('clienteId').value = cliente.IdUsuario;
        document.getElementById('documento').value = cliente.Documento;
        document.getElementById('tipoDocumento').value = cliente.TipoDocumento;
        document.getElementById('nombres').value = cliente.Nombres;
        document.getElementById('apellidos').value = cliente.Apellidos;
        document.getElementById('correo').value = cliente.Correo;
        document.getElementById('telefono').value = cliente.Telefono;
        document.getElementById('fechaDeNacimiento').value = formattedFechaNacimiento;
        document.getElementById('direccion').value = cliente.Direccion;
        document.getElementById('genero').value = cliente.Genero;
        document.getElementById('estado').value = cliente.Estado;

        // Obtener roles actuales del usuario
        const rolesResponse = await fetch(`http://localhost:3000/api/usuariosRol/${usuarioId}/roles`);
        if (!rolesResponse.ok) {
            throw new Error('Error al obtener roles del cliente: ' + rolesResponse.statusText);
        }
        const roles = await rolesResponse.json();
        const tieneRolBeneficiario = Array.isArray(roles) && roles.some(rol => rol.IdRol === 4);
        document.getElementById('beneficiario').value = tieneRolBeneficiario ? "1" : "0";

        if (tieneRolBeneficiario) {
            document.getElementById('editarValoracionMedicaBtn').style.display = 'block';
        }

        // Asignar valores de peso y altura si existen y calcular el IMC
        if (cliente.Peso) {
            document.getElementById('Peso').value = cliente.Peso;
        }
        if (cliente.Altura) {
            document.getElementById('Altura').value = cliente.Altura;
        }

        // Calcular el IMC al cargar los datos del cliente
        calcularIMC();

    } catch (error) {
        console.error('Error al cargar datos del cliente:', error);
    }
}

// Función para redirigir a la página de edición de valoración médica
function redirigirValoracionMedica() {
    const usuarioId = document.getElementById('clienteId').value;
    window.location.href = `editarValoracionMedica?id=${usuarioId}`;
}

async function actualizarCliente() {
    try {
        const form = document.getElementById('formularioEditar');
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        const id = data.id;

        const getResponse = await fetch(`http://localhost:3000/api/usuarios/${id}`);
        if (!getResponse.ok) {
            throw new Error('Error al obtener datos del cliente: ' + getResponse.statusText);
        }
        const currentData = await getResponse.json();

        const updatedData = {
            Documento: data.documento || currentData.Documento,
            TipoDocumento: data.tipoDocumento || currentData.TipoDocumento,
            Nombres: data.nombres || currentData.Nombres,
            Apellidos: data.apellidos || currentData.Apellidos,
            Correo: data.correo || currentData.Correo,
            Telefono: data.telefono || currentData.Telefono,
            FechaDeNacimiento: data.fechaDeNacimiento || currentData.FechaDeNacimiento,
            Direccion: data.direccion || currentData.Direccion,
            Genero: data.genero || currentData.Genero,
            Contrasena: currentData.Contrasena,
            Estado: data.estado,
            Beneficiario: null // Siempre enviar Beneficiario como null
        };

        const putResponse = await fetch(`http://localhost:3000/api/usuarios/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });

        if (!putResponse.ok) {
            throw new Error('Error en la solicitud: ' + putResponse.statusText);
        }

        // Obtener roles actuales del usuario
        const rolesResponse = await fetch(`http://localhost:3000/api/usuariosRol/${id}/roles`);
        if (!rolesResponse.ok) {
            throw new Error('Error al obtener roles del cliente: ' + rolesResponse.statusText);
        }
        const roles = await rolesResponse.json();

        const beneficiarioSelect = document.getElementById('beneficiario');
        const tieneRolBeneficiario = Array.isArray(roles) && roles.some(rol => rol.IdRol === 4);

        if (beneficiarioSelect.value === "1" && !tieneRolBeneficiario) {
            // Asignar el rol de beneficiario
            const rolResponse = await fetch(`http://localhost:3000/api/usuariosRol/${id}/roles`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ IdRol: 4 }) // IdRol 4 es el rol de beneficiario
            });

            if (!rolResponse.ok) {
                throw new Error('Error al asignar el rol de beneficiario: ' + rolResponse.statusText);
            }

            // Registrar valoración médica si se ha cambiado a beneficiario y los campos están llenos
            if (document.getElementById('valoracionMedica').style.display === 'block') {
                const valoracionMedica = {
                    IdUsuario: id,
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

                const valoracionResponse = await fetch(`http://localhost:3000/api/valoracionesMedicas`, {
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

        } else if (beneficiarioSelect.value === "0" && tieneRolBeneficiario) {
            // Eliminar el rol de beneficiario y la valoración médica
            const rolUsuario = roles.find(rol => rol.IdRol === 4);
            if (rolUsuario) {
                const eliminarRolResponse = await fetch(`http://localhost:3000/api/usuariosRol/roles/${rolUsuario.IdRolUsuario}`, {
                    method: 'DELETE'
                });

                if (!eliminarRolResponse.ok) {
                    throw new Error('Error al eliminar el rol de beneficiario: ' + eliminarRolResponse.statusText);
                }

                // Obtener la valoración médica por IdUsuario
                const getValoracionResponse = await fetch(`http://localhost:3000/api/valoracionesMedicas/usuario/${id}`);
                
                if (!getValoracionResponse.ok) {
                    throw new Error('Error al obtener la valoración médica: ' + getValoracionResponse.statusText);
                }

                const valoracion = await getValoracionResponse.json();

                if (valoracion.length > 0) {
                    const valoracionId = valoracion[0].IdValoracion;

                    // Eliminar valoración médica usando IdValoracion
                    const eliminarValoracionResponse = await fetch(`http://localhost:3000/api/valoracionesMedicas/${valoracionId}`, {
                        method: 'DELETE'
                    });

                    if (!eliminarValoracionResponse.ok) {
                        throw new Error('Error al eliminar la valoración médica: ' + eliminarValoracionResponse.statusText);
                    }
                }
            }
        }

        Swal.fire({
            title: "¡Excelente!",
            text: "Cliente Actualizado Correctamente!",
            icon: "success",
        }).then(() => {
            window.location.href = '/clientes';
        });

        document.querySelectorAll('.formularioEditar__grupo-correcto').forEach((icono) => {
            icono.classList.remove('formularioEditar__grupo-correcto');
        });
        
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "¡Oops...",
            text: "Error al actualizar los datos del cliente: " + error.message
        });
    }
}
