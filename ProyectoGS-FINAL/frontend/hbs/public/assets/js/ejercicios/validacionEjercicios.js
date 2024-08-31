document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('#formularioRegistro input, #formularioRegistro select, #formularioRegistro textarea');

    const expresiones = {
        nombreEjercicio: /^.{1,}$/,  // Debe tener al menos un carácter
        descripcionEjercicio: /^.{1,}$/, // Debe tener al menos un carácter
        repeticiones: /^[1-9][0-9]*$/  // Solo números positivos
    };

    const campos = {
        nombreEjercicio: false,
        descripcionEjercicio: false,
        repeticiones: false,
        estado: true  // Asumido como verdadero ya que es un select de dos opciones
    };

    const validarFormulario = (e) => {
        switch (e.target.name) {
            case "nombreEjercicio":
            case "descripcionEjercicio":
                validarCampo(expresiones[e.target.name], e.target, e.target.name);
                break;
            case "repeticiones":
                validarCampo(expresiones.repeticiones, e.target, 'repeticiones');
                break;
        }
    };

    const validarCampo = (expresion, input, campo) => {
        if (expresion.test(input.value)) {
            document.getElementById(`grupo__${campo}`).classList.remove('formularioRegistro__grupo-incorrecto');
            document.getElementById(`grupo__${campo}`).classList.add('formularioRegistro__grupo-correcto');
            document.querySelector(`#grupo__${campo} i`).classList.add('fa-check-circle');
            document.querySelector(`#grupo__${campo} i`).classList.remove('fa-times-circle');
            document.querySelector(`#grupo__${campo} .formularioRegistro__input-error`).classList.remove('formularioRegistro__input-error-activo');
            campos[campo] = true;
        } else {
            document.getElementById(`grupo__${campo}`).classList.add('formularioRegistro__grupo-incorrecto');
            document.getElementById(`grupo__${campo}`).classList.remove('formularioRegistro__grupo-correcto');
            document.querySelector(`#grupo__${campo} i`).classList.remove('fa-check-circle');
            document.querySelector(`#grupo__${campo} i`).classList.add('fa-times-circle');
            document.querySelector(`#grupo__${campo} .formularioRegistro__input-error`).classList.add('formularioRegistro__input-error-activo');
            campos[campo] = false;
        }
    };

    inputs.forEach((input) => {
        input.addEventListener('keyup', validarFormulario);
        input.addEventListener('blur', validarFormulario);
    });

    const formularioRegistro = document.getElementById('formularioRegistro');

    // Función para resetear campos y validaciones
    const limpiarFormulario = () => {
        formularioRegistro.reset(); // Resetea el formulario

        // Limpia los estilos de validación y restablece iconos y mensajes de error
        document.querySelectorAll('.formularioRegistro__grupo').forEach((grupo) => {
            grupo.classList.remove('formularioRegistro__grupo-incorrecto', 'formularioRegistro__grupo-correcto');
            const icono = grupo.querySelector('i');
            if (icono) {
                icono.classList.remove('fa-check-circle', 'fa-times-circle');
            }
            const mensajeError = grupo.querySelector('.formularioRegistro__input-error');
            if (mensajeError) {
                mensajeError.classList.remove('formularioRegistro__input-error-activo');
            }
        });

        // Restablece el estado de los campos de validación
        Object.keys(campos).forEach(campo => campos[campo] = false);
    };

    // Llamar a limpiarFormulario al cancelar y al cerrar el modal
    document.getElementById('btnCancelar').addEventListener('click', limpiarFormulario);
    $('#registroModal').on('hidden.bs.modal', limpiarFormulario);

    formularioRegistro.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validar campos esenciales
        const estadoValue = document.querySelector('select[name="estado"]').value;
        const estadoValido = estadoValue === "1" || estadoValue === "0";
        campos.estado = estadoValido;

        if (campos.nombreEjercicio && campos.descripcionEjercicio && campos.repeticiones && campos.estado) {
            limpiarFormulario();

            Swal.fire({
                position: 'center',
                icon: 'success',
                title: '¡Excelente!',
                text: 'El ejercicio se guardó con éxito.',
                showConfirmButton: false,
                timer: 2000
            });
        } else {
            // Si algún campo no es válido, muestra el mensaje de error
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Por favor, complete los campos correctamente",
            });
        }
    });
});
