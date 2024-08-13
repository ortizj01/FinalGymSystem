// Función para inicializar y precargar los datos en el formulario
 async function inicializarDatosEditarValoracionMedica() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const usuarioId = urlParams.get('id');

        if (!usuarioId) {
            console.error('ID del usuario no encontrado en la URL');
            return;
        }

        // Obtener los datos de la valoración médica por ID de usuario
        const response = await fetch(`http://localhost:3000/api/valoracionesMedicas/usuario/${usuarioId}`);
        if (!response.ok) {
            throw new Error('Error al obtener datos de la valoración: ' + response.statusText);
        }
        const valoraciones = await response.json();

        if (valoraciones.length > 0) {
            const valoracion = valoraciones[0]; // Suponiendo que solo hay una valoración por usuario
            document.getElementById('valoracionId').value = valoracion.IdValoracion;
            document.getElementById('IdUsuario').value = valoracion.IdUsuario;
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
            console.error('No se encontró una valoración médica para el usuario con ID:', usuarioId);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}


function calcularIMC() {
    const peso = parseFloat(document.getElementById('Peso').value);
    const altura = parseFloat(document.getElementById('Altura').value);
    if (peso && altura) {
        const imc = (peso / (altura * altura)).toFixed(2);
        document.getElementById('IMC').value = imc;
    }
}

// Escuchar cambios en los campos de peso y altura
document.getElementById('Peso').addEventListener('input', calcularIMC);
document.getElementById('Altura').addEventListener('input', calcularIMC);

async function editarValoracionMedica() {
    try {
        const form = document.getElementById('formularioValoracionMedica');
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        const id = data.id;

        const getResponse = await fetch(`http://localhost:3000/api/valoracionesMedicas/${id}`);
        if (!getResponse.ok) {
            throw new Error('Error al obtener datos de la valoración: ' + getResponse.statusText);
        }
        const currentData = await getResponse.json();

        const updatedData = {
            IdUsuario: data.IdUsuario || currentData.IdUsuario,
            TieneCondicionCronica: data.TieneCondicionCronica || currentData.TieneCondicionCronica,
            CirugiaPrevia: data.CirugiaPrevia || currentData.CirugiaPrevia,
            AlergiasConocidas: data.AlergiasConocidas || currentData.AlergiasConocidas,
            MedicamentosActuales: data.MedicamentosActuales || currentData.MedicamentosActuales,
            LesionesMusculoesqueleticas: data.LesionesMusculoesqueleticas || currentData.LesionesMusculoesqueleticas,
            EnfermedadCardiacaVascular: data.EnfermedadCardiacaVascular || currentData.EnfermedadCardiacaVascular,
            AntecedentesFamiliares: data.AntecedentesFamiliares || currentData.AntecedentesFamiliares,
            TipoAfiliacion: data.TipoAfiliacion || currentData.TipoAfiliacion,
            Peso: data.Peso || currentData.Peso,
            Altura: data.Altura || currentData.Altura,
            IMC: (data.Peso && data.Altura) ? (parseFloat(data.Peso) / (parseFloat(data.Altura) * parseFloat(data.Altura))).toFixed(2) : currentData.IMC
        };

        const putResponse = await fetch(`http://localhost:3000/api/valoracionesMedicas/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });

        if (!putResponse.ok) {
            throw new Error('Error en la solicitud: ' + putResponse.statusText);
        }

        console.log('Datos de la valoración médica actualizados correctamente');
        Swal.fire({
            title: "¡Excelente!",
            text: "Valoración Médica Actualizada Correctamente!",
            icon: "success",
        }).then(() => {
            window.location.href = '/beneficiarios';
        });

        document.querySelectorAll('.formularioRegistro__grupo-correcto').forEach((icono) => {
            icono.classList.remove('formularioRegistro__grupo-correcto');
        });
        
    } catch (error) {
        console.error('Error:', error);
        console.log('Error al actualizar los datos de la valoración médica');
        Swal.fire({
            icon: "error",
            title: "¡Oops...",
            text: "Ocurrió un error al actualizar la valoración médica"
        });
    }
}

