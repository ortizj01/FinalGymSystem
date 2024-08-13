// Obtener el formulario y los inputs
const formularioRegistro = document.getElementById('formularioRegistro');
const inputs = document.querySelectorAll('#formularioRegistro input');

// Expresiones regulares para la validación
const expresiones = {
    nombreEjercicio: /^[a-zA-Z0-9.,\s\-]+$/,
    descripcionEjercicio: /^[a-zA-Z0-9.,\s\-]+$/,
    repeticiones: /^(?:[1-9]|10)$/,
};

// Estado de los campos
const campos = {
    nombreEjercicio: false,
    descripcionEjercicio: false,
    repeticiones: false,
};

// Validar formulario
const validarFormulario = (e) => {
    const { name, value } = e.target;
    const expresion = expresiones[name];

    if (!expresion) return;

    if (expresion.test(value) || value.trim() === '') {
        document.getElementById(`grupo__${name}`).classList.remove('formularioRegistro__grupo-incorrecto');
        document.getElementById(`grupo__${name}`).classList.add('formularioRegistro__grupo-correcto');
        document.querySelector(`#grupo__${name} i`).classList.add('fa-check-circle');
        document.querySelector(`#grupo__${name} i`).classList.remove('fa-times-circle');
        document.querySelector(`#grupo__${name} .formularioRegistro__input-error`).classList.remove('formularioRegistro__input-error-activo');
        campos[name] = true;
    } else {
        document.getElementById(`grupo__${name}`).classList.add('formularioRegistro__grupo-incorrecto');
        document.getElementById(`grupo__${name}`).classList.remove('formularioRegistro__grupo-correcto');
        document.querySelector(`#grupo__${name} i`).classList.remove('fa-check-circle');
        document.querySelector(`#grupo__${name} i`).classList.add('fa-times-circle');
        document.querySelector(`#grupo__${name} .formularioRegistro__input-error`).classList.add('formularioRegistro__input-error-activo');
        campos[name] = false;
    }
};

// Agregar eventos a los inputs para validar en tiempo real
inputs.forEach((input) => {
    input.addEventListener('keyup', validarFormulario);
    input.addEventListener('blur', validarFormulario);
});

// Validar el formulario antes de enviarlo
formularioRegistro.addEventListener('submit', (e) => {
    e.preventDefault();

    const camposValidos = Object.values(campos).every((campo) => campo);

    if (camposValidos) {
        formularioRegistro.reset();

        Swal.fire({
            title: 'Excelente!',
            text: 'El ejercicio se guardó con éxito!',
            icon: 'success',
        });

        document.querySelectorAll('.formularioRegistro__grupo-correcto').forEach((icono) => {
            icono.classList.remove('formularioRegistro__grupo-correcto');
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ingresa los datos correctamente',
        });
    }
});
