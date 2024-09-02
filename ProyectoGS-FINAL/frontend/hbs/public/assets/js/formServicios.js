document.addEventListener('DOMContentLoaded', () => {
    const inputsCrear = document.querySelectorAll('#FormularioServicios input');
    const inputsEditar = document.querySelectorAll('#editarServicioForm input');
    
    const inputs = [...inputsCrear, ...inputsEditar];

    const expresiones = {
        NombreClase: /^.{5,}$/  // Al menos 5 caracteres
    };

    const campos = {
        NombreClase: false
    };

    const validarFormulario = (e) => {
        switch (e.target.name) {
            case "NombreClase":
                validarCampo(expresiones.NombreClase, e.target, 'NombreClase');
                break;
        }
    };

    const validarCampo = (expresion, input, campo) => {
        if (expresion.test(input.value)) {
            document.getElementById(`grupo__${campo}`).classList.remove('formulario__grupo-incorrecto');
            document.getElementById(`grupo__${campo}`).classList.add('formulario__grupo-correcto');
            document.querySelector(`#grupo__${campo} i`).classList.add('fa-check-circle');
            document.querySelector(`#grupo__${campo} i`).classList.remove('fa-times-circle');
            document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.remove('formulario__input-error-activo');
            campos[campo] = true;
        } else {
            document.getElementById(`grupo__${campo}`).classList.add('formulario__grupo-incorrecto');
            document.getElementById(`grupo__${campo}`).classList.remove('formulario__grupo-correcto');
            document.querySelector(`#grupo__${campo} i`).classList.remove('fa-check-circle');
            document.querySelector(`#grupo__${campo} i`).classList.add('fa-times-circle');
            document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.add('formulario__input-error-activo');
            campos[campo] = false;
        }
    };

    inputs.forEach((input) => {
        input.addEventListener('keyup', validarFormulario);
        input.addEventListener('blur', validarFormulario);
    });

    const formularioServicios = document.getElementById('FormularioServicios');
    if (formularioServicios) {
        formularioServicios.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (campos.NombreClase) {
                // Check if service already exists before sending success alert
                const nombreClase = document.getElementById('NombreClase').value;
                const servicioExiste = await verificarServicioExistente(nombreClase);

                if (servicioExiste) {
                    // Mostrar mensaje de error en lugar de usar SweetAlert
                    document.getElementById('error-message').textContent = 'El servicio con ese nombre ya existe.';
                } else {
                    formularioServicios.reset();
                    // Mostrar mensaje de éxito en lugar de usar SweetAlert
                    document.getElementById('success-message').textContent = 'El servicio se guardó con éxito.';
                }
            } else {
                // Mostrar mensaje de error en lugar de usar SweetAlert
                document.getElementById('error-message').textContent = 'Por favor, complete los campos correctamente';
            }
        });
    }

    const editarServicioForm = document.getElementById('editarServicioForm');
    if (editarServicioForm) {
        editarServicioForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (campos.NombreClase) {
                // Here you could add any specific logic for updating a service if needed

                editarServicioForm.reset();
                // Mostrar mensaje de éxito en lugar de usar SweetAlert
                document.getElementById('success-message').textContent = 'El servicio se actualizó con éxito.';
            } else {
                // Mostrar mensaje de error en lugar de usar SweetAlert
                document.getElementById('error-message').textContent = 'Por favor, complete los campos correctamente';
            }
        });
    }
});
