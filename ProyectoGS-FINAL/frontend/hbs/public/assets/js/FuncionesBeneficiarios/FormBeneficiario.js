

document.getElementById('togglePassword').addEventListener('click', function() {
    togglePasswordVisibility('contrasena');
});

document.getElementById('toggleConfirmPassword').addEventListener('click', function() {
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


const formularioRegistro = document.getElementById('formularioRegistro');
const inputs = document.querySelectorAll('#formularioRegistro input, #formularioRegistro select');

const expresiones = {
    documento: /^[a-zA-Z0-9]{7,10}$/,
    tipoDocumento: /^(cedula_ciudadania|cedula_extranjeria|tarjeta_identidad)$/,
    nombres: /^[a-zA-ZÀ-ÿ\s]{1,40}$/,
    apellidos: /^[a-zA-ZÀ-ÿ\s]{1,40}$/,
    correo: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    telefono: /^[0-9]{7,11}$/,
    fechaDeNacimiento: /^(\d{4})-(\d{2})-(\d{2})$/,
    direccion: /^[A-Za-z0-9\s#áéíóúÁÉÍÓÚüÜ.,-]+$/,
    genero: /^(masculino|femenino|otro)$/,
    contrasena: /^(?=.*[A-Z])(?=.*\d).{4,12}$/,
    beneficiario: /^(1|0)$/
};

const campos = {
    documento: false,
    tipoDocumento: false,
    nombres: false,
    apellidos: false,
    correo: false,
    telefono: false,
    fechaDeNacimiento: false,
    direccion: false,
    genero: false,
    contrasena: false,
    confirmarContrasena: false,
    beneficiario: false
};

const validarFormulario = (e) => {
    switch (e.target.name) {
        case "documento":
            validarCampo(expresiones.documento, e.target, 'documento');
            break;
        case "tipoDocumento":
            validarSelect(expresiones.tipoDocumento, e.target, 'tipoDocumento');
            break;
        case "nombres":
            validarCampo(expresiones.nombres, e.target, 'nombres');
            break;
        case "apellidos":
            validarCampo(expresiones.apellidos, e.target, 'apellidos');
            break;
        case "correo":
            validarCampo(expresiones.correo, e.target, 'correo');
            break;
        case "telefono":
            validarCampo(expresiones.telefono, e.target, 'telefono');
            break;
        case "fechaDeNacimiento":
            validarCampo(expresiones.fechaDeNacimiento, e.target, 'fechaDeNacimiento');
            break;
        case "direccion":
            validarCampo(expresiones.direccion, e.target, 'direccion');
            break;
        case "genero":
            validarSelect(expresiones.genero, e.target, 'genero');
            break;
        case "contrasena":
            validarCampo(expresiones.contrasena, e.target, 'contrasena');
            validarConfirmacionContrasena();
            break;
        case "confirmarContrasena":
            validarConfirmacionContrasena();
            break;
        case "beneficiario":
            validarSelect(expresiones.beneficiario, e.target, 'beneficiario');
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

const validarSelect = (expresion, select, campo) => {
    if (expresion.test(select.value)) {
        document.getElementById(`grupo__${campo}`).classList.remove('formularioRegistro__grupo-incorrecto');
        document.getElementById(`grupo__${campo}`).classList.add('formularioRegistro__grupo-correcto');
        campos[campo] = true;
    } else {
        document.getElementById(`grupo__${campo}`).classList.add('formularioRegistro__grupo-incorrecto');
        document.getElementById(`grupo__${campo}`).classList.remove('formularioRegistro__grupo-correcto');
        campos[campo] = false;
    }
};


const validarConfirmacionContrasena = () => {
    const contrasena = document.getElementById('contrasena');
    const confirmarContrasena = document.getElementById('confirmarContrasena');

    if (contrasena.value !== confirmarContrasena.value || confirmarContrasena.value === '') {
        document.getElementById(`grupo__confirmarContrasena`).classList.add('formularioRegistro__grupo-incorrecto');
        document.getElementById(`grupo__confirmarContrasena`).classList.remove('formularioRegistro__grupo-correcto');
        document.querySelector(`#grupo__confirmarContrasena i`).classList.remove('fa-check-circle');
        document.querySelector(`#grupo__confirmarContrasena i`).classList.add('fa-times-circle');
        document.querySelector(`#grupo__confirmarContrasena .formularioRegistro__input-error`).classList.add('formularioRegistro__input-error-activo');
        campos['confirmarContrasena'] = false;
    } else {
        document.getElementById(`grupo__confirmarContrasena`).classList.remove('formularioRegistro__grupo-incorrecto');
        document.getElementById(`grupo__confirmarContrasena`).classList.add('formularioRegistro__grupo-correcto');
        document.querySelector(`#grupo__confirmarContrasena i`).classList.add('fa-check-circle');
        document.querySelector(`#grupo__confirmarContrasena i`).classList.remove('fa-times-circle');
        document.querySelector(`#grupo__confirmarContrasena .formularioRegistro__input-error`).classList.remove('formularioRegistro__input-error-activo');
        campos['confirmarContrasena'] = true;
    }
};

// Event listeners para validar en cada cambio o blur
inputs.forEach((input) => {
    if (input.type !== 'checkbox') { // Excluir checkboxes que no necesitan validación específica
        input.addEventListener('change', validarFormulario);
        input.addEventListener('keyup', validarFormulario);
        input.addEventListener('blur', validarFormulario);
    }
});
