document.addEventListener('DOMContentLoaded', () => {
    const inputsCrear = document.querySelectorAll('#FormularioServicios input');
    const inputsEditar = document.querySelectorAll('#editarServicioForm input');
    
    const inputs = [...inputsCrear, ...inputsEditar];

    // Expresiones regulares para validaciones
    const expresiones = {
        NombreClase: /^.{5,}$/  // Al menos 5 caracteres
    };

    // Estado de validación de los campos
    const campos = {
        NombreClase: false
    };

    // Función para validar el formulario
    const validarFormulario = (e) => {
        switch (e.target.name) {
            case "NombreClase":
                validarCampo(expresiones.NombreClase, e.target, 'NombreClase');
                break;
        }
    };

    // Función para validar un campo específico
    const validarCampo = (expresion, input, campo) => {
        const grupo = document.getElementById(`grupo__${campo}`);
        const icono = grupo.querySelector('i');
        const error = grupo.querySelector('.formulario__input-error');

        if (expresion.test(input.value)) {
            grupo.classList.remove('formulario__grupo-incorrecto');
            grupo.classList.add('formulario__grupo-correcto');
            icono.classList.add('fa-check-circle');
            icono.classList.remove('fa-times-circle');
            error.classList.remove('formulario__input-error-activo');
            campos[campo] = true;
        } else {
            grupo.classList.add('formulario__grupo-incorrecto');
            grupo.classList.remove('formulario__grupo-correcto');
            icono.classList.remove('fa-check-circle');
            icono.classList.add('fa-times-circle');
            error.classList.add('formulario__input-error-activo');
            campos[campo] = false;
        }
    };

    // Añadir eventos a los inputs
    inputs.forEach((input) => {
        input.addEventListener('keyup', validarFormulario);
        input.addEventListener('blur', validarFormulario);
    });

    // Validación en el envío del formulario para crear servicios
    const formularioServicios = document.getElementById('FormularioServicios');
    if (formularioServicios) {
        formularioServicios.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (campos.NombreClase) {
                // Aquí puedes verificar si el servicio ya existe, etc.
                const nombreClase = document.getElementById('NombreClase').value;
                const servicioExiste = await verificarServicioExistente(nombreClase);

                if (servicioExiste) {
                    document.getElementById('error-message').textContent = 'El servicio con ese nombre ya existe.';
                } else {
                    formularioServicios.reset();
                    document.getElementById('success-message').textContent = 'El servicio se guardó con éxito.';
                }
            } else {
                document.getElementById('error-message').textContent = 'Por favor, complete los campos correctamente';
            }
        });
    }

    // Validación en el envío del formulario para editar servicios
    const editarServicioForm = document.getElementById('editarServicioForm');
    if (editarServicioForm) {
        editarServicioForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (campos.NombreClase) {
                // Aquí puedes agregar lógica específica para actualizar un servicio si es necesario

                editarServicioForm.reset();
                document.getElementById('success-message').textContent = 'El servicio se actualizó con éxito.';
            } else {
                document.getElementById('error-message').textContent = 'Por favor, complete los campos correctamente';
            }
        });
    }
});
