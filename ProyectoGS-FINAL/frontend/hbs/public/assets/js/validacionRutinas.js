const formularioRegistro = document.getElementById('formularioRegistro');
const inputs = document.querySelectorAll('#formularioRegistro input');

const expresiones = {
    nombreRutina: /^[a-zA-Z0-9\s-_]{3,}$/
};

const campos = {
    nombreRutina: false,
    idUsuario: false,
    ejercicios: [] // Array para almacenar la validez de los ejercicios
};

const validarFormulario = (e) => {
    switch (e.target.name) {
        case "nombreRutina":
            validarCampo(expresiones.nombreRutina, e.target, 'nombreRutina');
            break;
        case "idUsuario":
            validarSeleccionUsuario(e.target.value, 'idUsuario');
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

const validarSeleccionUsuario = (value, campo) => {
    if (value && value !== "0") {
        campos[campo] = true;
    } else {
        campos[campo] = false;
    }
};


const validarEjercicio = (select, input) => {
    const ejercicioValido = select.val() !== "";
    const seriesValida = input.val() > 0;

    const $formGroup = select.closest('.exercise-form');
    if (ejercicioValido && seriesValida) {
        $formGroup.removeClass('formularioRegistro__grupo-incorrecto').addClass('formularioRegistro__grupo-correcto');
        $formGroup.find('.formularioRegistro__input-error').removeClass('formularioRegistro__input-error-activo');
    } else {
        $formGroup.addClass('formularioRegistro__grupo-incorrecto').removeClass('formularioRegistro__grupo-correcto');
        $formGroup.find('.formularioRegistro__input-error').addClass('formularioRegistro__input-error-activo');
    }
    // Actualiza el estado de validación de los ejercicios
    const index = $('.exercise-form').index($formGroup);
    campos.ejercicios[index] = ejercicioValido && seriesValida;
};

inputs.forEach((input) => {
    input.addEventListener('keyup', validarFormulario);
    input.addEventListener('blur', validarFormulario);
});

formularioRegistro.addEventListener('submit', (e) => {
    e.preventDefault();

    let formularioValido = true;

    // Validar campos fijos
    if (!campos.nombreRutina || !campos.idUsuario) {
        formularioValido = false;
    }

    // Validar ejercicios dinámicos
    $('.exercise-form').each(function(index) {
        const select = $(this).find('select');
        const input = $(this).find('input');
        validarEjercicio(select, input);
        if (!campos.ejercicios[index]) {
            formularioValido = false;
        }
    });

    if (formularioValido) {
        // Aquí iría el código para manejar el envío del formulario
        formularioRegistro.reset();

        Swal.fire({
            title: "¡Excelente!",
            text: "¡La rutina se guardó con éxito!",
            icon: "success"
        }).then(() => {
            window.location.href = '/rutinas';
        });

        document.querySelectorAll('.formularioRegistro__grupo-correcto').forEach((icono) => {
            icono.classList.remove('formularioRegistro__grupo-correcto');
        });

    } else {
        Swal.fire({
            icon: "error",
            title: "¡Oops...",
            text: "¡Por favor, completa todos los campos correctamente!",
        });
    }
});
