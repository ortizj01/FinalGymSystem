document.addEventListener('DOMContentLoaded', (event) => {
    inputs.forEach((input) => {
        if (input.value) {
            validarFormulario({target: input});
        }
    });
});

const formularioEditar = document.getElementById('formularioEditar');
const inputs = document.querySelectorAll('#formularioEditar input, #formularioEditar select');

const expresiones = {
    documento: /^[a-zA-Z0-9]{7,10}$/,
    nombres: /^[a-zA-ZÀ-ÿ\s]{1,40}$/,
    apellidos: /^[a-zA-ZÀ-ÿ\s]{1,40}$/,
    correo: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    telefono: /^[0-9]{7,11}$/,
    fechaDeNacimiento: /^(\d{4})-(\d{2})-(\d{2})$/,
    direccion: /^[A-Za-z0-9\s#áéíóúÁÉÍÓÚüÜ.,-]+$/,
    genero: /^(masculino|femenino|otro)$/,
    beneficiario: /^(1|0)$/,
    estado: /^(0|1)$/,
    tipoDocumento: /^(cedula_ciudadania|cedula_extranjeria|tarjeta_identidad)$/
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
    beneficiario: false,
    estado: false
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
        case "estado":
            validarSelect(expresiones.estado, e.target, 'estado');
            break;
        case "beneficiario":
            validarSelect(expresiones.beneficiario, e.target, 'beneficiario');
            break;
    }
};

const validarCampo = (expresion, input, campo) => {
    if (expresion.test(input.value)) {
        document.getElementById(`grupo__${campo}`).classList.remove('formularioEditar__grupo-incorrecto');
        document.getElementById(`grupo__${campo}`).classList.add('formularioEditar__grupo-correcto');
        document.querySelector(`#grupo__${campo} i`).classList.add('fa-check-circle');
        document.querySelector(`#grupo__${campo} i`).classList.remove('fa-times-circle');
        document.querySelector(`#grupo__${campo} .formularioEditar__input-error`).classList.remove('formularioEditar__input-error-activo');
        campos[campo] = true;
    } else {
        document.getElementById(`grupo__${campo}`).classList.add('formularioEditar__grupo-incorrecto');
        document.getElementById(`grupo__${campo}`).classList.remove('formularioEditar__grupo-correcto');
        document.querySelector(`#grupo__${campo} i`).classList.remove('fa-check-circle');
        document.querySelector(`#grupo__${campo} i`).classList.add('fa-times-circle');
        document.querySelector(`#grupo__${campo} .formularioEditar__input-error`).classList.add('formularioEditar__input-error-activo');
        campos[campo] = false;
    }
};

const validarSelect = (expresion, select, campo) => {
    if (expresion.test(select.value)) {
        document.getElementById(`grupo__${campo}`).classList.remove('formularioEditar__grupo-incorrecto');
        document.getElementById(`grupo__${campo}`).classList.add('formularioEditar__grupo-correcto');
        document.querySelector(`#grupo__${campo} .formularioEditar__input-error`).classList.remove('formularioEditar__input-error-activo');
        campos[campo] = true;
    } else {
        document.getElementById(`grupo__${campo}`).classList.add('formularioEditar__grupo-incorrecto');
        document.getElementById(`grupo__${campo}`).classList.remove('formularioEditar__grupo-correcto');
        document.querySelector(`#grupo__${campo} .formularioEditar__input-error`).classList.add('formularioEditar__input-error-activo');
        campos[campo] = false;
    }
};

inputs.forEach((input) => {
    input.addEventListener('change', validarFormulario);
    input.addEventListener('keyup', validarFormulario);
    input.addEventListener('blur', validarFormulario);
});

formularioEditar.addEventListener('submit', (e) => {
    e.preventDefault();

    if (campos.documento && campos.tipoDocumento && campos.nombres && campos.apellidos &&
        campos.correo && campos.telefono && campos.fechaDeNacimiento && campos.direccion && 
        campos.genero && campos.beneficiario && campos.estado) {

    } else {
        
    }
});
