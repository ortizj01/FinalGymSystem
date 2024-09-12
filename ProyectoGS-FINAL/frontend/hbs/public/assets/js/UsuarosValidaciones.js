const formularioUsuarios = document.getElementById('formularioUsuarios');
const inputs = document.querySelectorAll('#formularioUsuarios input, #formularioUsuarios select');

const expresiones = {
    TipoDocumento: /^(cedula_ciudadania|pasaporte)$/,
    Documento: /^[a-zA-Z0-9]{7,10}$/, // Considerando cédulas y pasaportes de entre 7 y 10 caracteres
    Nombre: /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/, // Solo letras y espacios
    Apellidos: /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/, // Solo letras y espacios
    Email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // Correo electrónico
    Telefono: /^\d{10}$/, // Teléfono de 10 dígitos
    FechaDeNacimiento: /^\d{4}-\d{2}-\d{2}$/, // Fecha en formato YYYY-MM-DD
    Direccion: /^[a-zA-Z0-9\s,.\-#]+$/, // Direcciones comunes
    Genero: /^(Masculino|Femenino|Otro)$/,
    Rol: /^(?!Seleccionar Rol$).*$/, // Excluye el valor por defecto "Seleccionar Rol"
    contrasena: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{4,12}$/, // Mínimo 8 caracteres, al menos una letra y un número
    ConfirmarContrasena: /^.*$/ // Solo se valida si coincide con la contraseña
};

const campos = {
    TipoDocumento: false,
    Documento: false,
    Nombre: false,
    Apellidos: false,
    Email: false,
    Telefono: false,
    FechaDeNacimiento: false,
    Direccion: false,
    Genero: false,
    Rol: false,
    contrasena: false,
    ConfirmarContrasena: false
};

const validarFormularioUsuarios = (e) => {

    console.log(`Evento: ${e.type}, Campo: ${e.target.name}`); // Agrega este log

    switch (e.target.name) {
        case "TipoDocumento":
            validarCampo(expresiones.TipoDocumento, e.target, "TipoDocumento");
            break;
        case "Documento":
            validarCampo(expresiones.Documento, e.target, "Documento");
            break;
        case "Nombre":
            validarCampo(expresiones.Nombre, e.target, "Nombre");
            break;
        case "Apellidos":
            validarCampo(expresiones.Apellidos, e.target, "Apellidos");
            break;
        case "Email":
            validarCampo(expresiones.Email, e.target, "Email");
            break;
        case "Telefono":
            validarCampo(expresiones.Telefono, e.target, "Telefono");
            break;
        case "FechaDeNacimiento":
            validarCampo(expresiones.FechaDeNacimiento, e.target, "FechaDeNacimiento");
            break;
        case "Direccion":
            validarCampo(expresiones.Direccion, e.target, "Direccion");
            break;
        case "Genero":
            validarCampo(expresiones.Genero, e.target, "Genero");
            break;
        case "Rol":
            validarCampo(expresiones.Rol, e.target, "Rol");
            break;
        case "contrasena":
            validarCampo(expresiones.contrasena, e.target, "contrasena");
            validarConfirmarContrasena();
            break;
        case "ConfirmarContrasena":
            validarConfirmarContrasena();
            break;
    }
};

const validarCampo = (expresion, input, campo) => {
    let valid = false;
    if (campo === "Rol") {
        // Validación directa para el campo Rol
        valid = input.value !== "Seleccionar Rol" && input.value.trim() !== "";
    } else {
        valid = expresion.test(input.value);
    }
    console.log(`Campo: ${campo}, Valor: ${input.value}, Válido: ${valid}`); // Agrega este log

    if (valid) {
        document.getElementById(`grupo__${campo}`).classList.remove("formulario__grupo-incorrecto");
        document.getElementById(`grupo__${campo}`).classList.add("formulario__grupo-correcto");
        document.querySelector(`#grupo__${campo} i`).classList.add("fa-check-circle");
        document.querySelector(`#grupo__${campo} i`).classList.remove("fa-times-circle");
        document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.remove("formulario__input-error-activo");
        campos[campo] = true;
    } else {
        document.getElementById(`grupo__${campo}`).classList.add("formulario__grupo-incorrecto");
        document.getElementById(`grupo__${campo}`).classList.remove("formulario__grupo-correcto");
        document.querySelector(`#grupo__${campo} i`).classList.add("fa-times-circle");
        document.querySelector(`#grupo__${campo} i`).classList.remove("fa-check-circle");
        document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.add("formulario__input-error-activo");
        campos[campo] = false;
    }
};

const validarConfirmarContrasena = () => {
    const contrasena = document.getElementById('contrasena').value;
    const confirmarContrasena = document.getElementById('confirmarContrasena').value;

    console.log(`Contraseña: ${contrasena}, Confirmar Contraseña: ${confirmarContrasena}`); // Agrega este log


    if (contrasena === confirmarContrasena && contrasena !== "") {
        document.getElementById('grupo__confirmarContrasena').classList.remove("formulario__grupo-incorrecto");
        document.getElementById('grupo__confirmarContrasena').classList.add("formulario__grupo-correcto");
        document.querySelector('#grupo__confirmarContrasena i').classList.add("fa-check-circle");
        document.querySelector('#grupo__confirmarContrasena i').classList.remove("fa-times-circle");
        document.querySelector('#grupo__confirmarContrasena .formulario__input-error').classList.remove("formulario__input-error-activo");
        campos.ConfirmarContrasena = true;
    } else {
        document.getElementById('grupo__confirmarContrasena').classList.add("formulario__grupo-incorrecto");
        document.getElementById('grupo__confirmarContrasena').classList.remove("formulario__grupo-correcto");
        document.querySelector('#grupo__confirmarContrasena i').classList.add("fa-times-circle");
        document.querySelector('#grupo__confirmarContrasena i').classList.remove("fa-check-circle");
        document.querySelector('#grupo__confirmarContrasena .formulario__input-error').classList.add("formulario__input-error-activo");
        campos.ConfirmarContrasena = false;
    }
};

inputs.forEach((input) => {
    input.addEventListener('keyup', validarFormularioUsuarios);
    input.addEventListener('blur', validarFormularioUsuarios);
    input.addEventListener('change', validarFormularioUsuarios); // Asegúrate de que los selects también se validen en el cambio
});

formularioUsuarios.addEventListener('submit', (e) => {
    e.preventDefault();
    if (Object.values(campos).every(campo => campo)) {
        document.getElementById('formulario__mensaje-exito').classList.add('formulario__mensaje-exito-activo');
        setTimeout(() => {
            document.getElementById('formulario__mensaje-exito').classList.remove('formulario__mensaje-exito-activo');
        }, 3000);
        document.querySelectorAll('.formulario__grupo-correcto').forEach((icono) => {
            icono.classList.remove('formulario__grupo-correcto');
        });
    } else {
        document.getElementById('formulario__mensaje').classList.add('formulario__mensaje-activo');
        setTimeout(() => {
            document.getElementById('formulario__mensaje').classList.remove('formulario__mensaje-activo');
        }, 3000);
    }
});
