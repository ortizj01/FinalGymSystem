document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('#formularioRegistro input, #formularioRegistro select');

    const expresiones = {
        nombreEjercicio: /^.{1,}$/,
        descripcionEjercicio: /^.{1,}$/,
        repeticiones: /^[1-9][0-9]*$/
        // El campo 'estado' se manejará dinámicamente según la presencia en el formulario
    };

    const campos = {
        nombreEjercicio: false,
        descripcionEjercicio: false,
        repeticiones: false,
        estado: true  // Inicializado en true, ya que no se valida si no está presente
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
            case "estado":
                validarCampo(expresiones.estado, e.target, 'estado');
                break;
        }
    };

    const validarCampo = (expresion, input, campo) => {
        if (expresion === null || expresion.test(input.value)) {
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
    formularioRegistro.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validar campos esenciales según el tipo de formulario
        if (campos.nombreEjercicio && campos.descripcionEjercicio && campos.repeticiones) {
            // Validar estado solo si está presente en el formulario
            if (document.getElementById('ejercicioId') && campos.estado) {
                // Aquí puedes realizar acciones adicionales como enviar el formulario usando fetch
                formularioRegistro.reset();

                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: '¡Excelente!',
                    text: 'El ejercicio se guardó con éxito.',
                    showConfirmButton: false,
                    timer: 2000
                });

                // Limpia los estilos de los campos correctos después de enviar el formulario
                document.querySelectorAll('.formularioRegistro__grupo-correcto').forEach((icono) => {
                    icono.classList.remove('formularioRegistro__grupo-correcto');
                });
            } else {
                // Si no se necesita validar 'estado' o no está presente, también procede
                formularioRegistro.reset();

                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: '¡Excelente!',
                    text: 'El ejercicio se guardó con éxito.',
                    showConfirmButton: false,
                    timer: 2000
                });

                // Limpia los estilos de los campos correctos después de enviar el formulario
                document.querySelectorAll('.formularioRegistro__grupo-correcto').forEach((icono) => {
                    icono.classList.remove('formularioRegistro__grupo-correcto');
                });
            }
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
