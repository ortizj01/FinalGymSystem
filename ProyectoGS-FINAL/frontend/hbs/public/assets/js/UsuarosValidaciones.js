const formularioUsuarios = document.getElementById('formularioUsuarios');
const inputsUsuarios = document.querySelectorAll('#formularioUsuarios input');
const selectsUsuarios = document.querySelectorAll('#formularioUsuarios select');

const expresionesUsuarios = {
    Nombre: /^[a-zA-ZÀ-ÿ\s]{1,50}$/,
    Apellidos: /^[a-zA-ZÀ-ÿ\s]{1,50}$/,
    Email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    Telefono: /^[0-9]+$/,
    Rol: /^[a-zA-ZÀ-ÿ\s]{1,50}$/,
    Cedula: /^[a-zA-Z0-9]+$/,
    contraseña: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/
};

const camposUsuarios = {
    Nombre: false,
    Apellidos: false,
    Email: false,
    Telefono: false,
    Rol: false,
    Cedula: false,
    contraseña: false,
    ConfirmarContraseña: false
};

const validarFormularioUsuarios = (e) => {
    switch (e.target.name) {
        case "Nombre":
            validarCampoUsuarios(expresionesUsuarios.Nombre, e.target, 'Nombre');
            break;
        case "Apellidos":
            validarCampoUsuarios(expresionesUsuarios.Apellidos, e.target, 'Apellidos');
            break;
        case "Email":
            validarCampoUsuarios(expresionesUsuarios.Email, e.target, 'Email');
            break;
        case "Telefono":
            validarCampoUsuarios(expresionesUsuarios.Telefono, e.target, 'Telefono');
            break;
        case "Rol":
            validarRol();
            break;
        case "Cedula":
            validarCampoUsuarios(expresionesUsuarios.Cedula, e.target, 'Cedula');
            break;
        case "contraseña":
            validarCampoUsuarios(expresionesUsuarios.contraseña, e.target, 'contraseña');
            validarConfirmarContraseña();
            break;
        case "confirmarContrasena":
            validarConfirmarContraseña();
            break;
    }
};

const validarCampoUsuarios = (expresion, input, campo) => {
    if (expresion.test(input.value)) {
        document.getElementById(`grupo__${campo}`).classList.remove('formulario__grupo-incorrecto');
        document.getElementById(`grupo__${campo}`).classList.add('formulario__grupo-correcto');
        document.querySelector(`#grupo__${campo} i`).classList.remove('fa-times-circle');
        document.querySelector(`#grupo__${campo} i`).classList.add('fa-check-circle');
        document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.remove('formulario__input-error-activo');
        camposUsuarios[campo] = true;
    } else {
        document.getElementById(`grupo__${campo}`).classList.add('formulario__grupo-incorrecto');
        document.getElementById(`grupo__${campo}`).classList.remove('formulario__grupo-correcto');
        document.querySelector(`#grupo__${campo} i`).classList.remove('fa-check-circle');
        document.querySelector(`#grupo__${campo} i`).classList.add('fa-times-circle');
        document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.add('formulario__input-error-activo');
        camposUsuarios[campo] = false;
    }
};

const validarRol = () => {
    const selectsRol = document.querySelectorAll('select[name="Rol"]');
    let rolValido = false;
    
    selectsRol.forEach(select => {
        if (select.value !== "") {
            rolValido = true;
        }
    });

    if (rolValido) {
        document.getElementById(`grupo__Rol`).classList.remove('formulario__grupo-incorrecto');
        document.getElementById(`grupo__Rol`).classList.add('formulario__grupo-correcto');
        document.querySelector(`#grupo__Rol i`).classList.remove('fa-times-circle');
        document.querySelector(`#grupo__Rol i`).classList.add('fa-check-circle');
        document.querySelector(`#grupo__Rol .formulario__input-error`).classList.remove('formulario__input-error-activo');
        camposUsuarios['Rol'] = true;
    } else {
        document.getElementById(`grupo__Rol`).classList.add('formulario__grupo-incorrecto');
        document.getElementById(`grupo__Rol`).classList.remove('formulario__grupo-correcto');
        document.querySelector(`#grupo__Rol i`).classList.remove('fa-check-circle');
        document.querySelector(`#grupo__Rol i`).classList.add('fa-times-circle');
        document.querySelector(`#grupo__Rol .formulario__input-error`).classList.add('formulario__input-error-activo');
        camposUsuarios['Rol'] = false;
    }
};

const validarConfirmarContraseña = () => {
    const inputContraseña = document.getElementById('contraseña');
    const inputConfirmarContraseña = document.getElementById('confirmarContrasena');
    const iconoConfirmarContraseña = document.querySelector('#grupo__confirmarContrasena i');

    if (inputContraseña.value === inputConfirmarContraseña.value && inputConfirmarContraseña.value !== '') {
        document.getElementById('grupo__confirmarContrasena').classList.remove('formulario__grupo-incorrecto');
        document.getElementById('grupo__confirmarContrasena').classList.add('formulario__grupo-correcto');
        iconoConfirmarContraseña.classList.remove('fa-times-circle');
        iconoConfirmarContraseña.classList.add('fa-check-circle');
        document.querySelector('#grupo__confirmarContrasena .formulario__input-error').classList.remove('formulario__input-error-activo');
        camposUsuarios['ConfirmarContraseña'] = true;
    } else {
        document.getElementById('grupo__confirmarContrasena').classList.add('formulario__grupo-incorrecto');
        document.getElementById('grupo__confirmarContrasena').classList.remove('formulario__grupo-correcto');
        iconoConfirmarContraseña.classList.remove('fa-check-circle');
        iconoConfirmarContraseña.classList.add('fa-times-circle');
        document.querySelector('#grupo__confirmarContrasena .formulario__input-error').classList.add('formulario__input-error-activo');
        camposUsuarios['ConfirmarContraseña'] = false;
    }
};

function togglePassword(inputId) {
    const inputElement = document.getElementById(inputId);
    const iconElement = document.querySelector(`#grupo__${inputId} i`);

    const type = inputElement.getAttribute('type') === 'password' ? 'text' : 'password';
    inputElement.setAttribute('type', type);

    if (type === 'password') {
        iconElement.classList.remove('fa-eye');
        iconElement.classList.add('fa-eye-slash');
    } else {
        iconElement.classList.remove('fa-eye-slash');
        iconElement.classList.add('fa-eye');
    }
};

inputsUsuarios.forEach((input) => {
    input.addEventListener('keyup', validarFormularioUsuarios);
    input.addEventListener('blur', validarFormularioUsuarios);
});

selectsUsuarios.forEach((select) => {
    select.addEventListener('change', validarFormularioUsuarios);
});

// Evento para mostrar/ocultar la contraseña
const iconoContraseña = document.querySelector('#grupo__contrasena i');
iconoContraseña.addEventListener('click', togglePassword);

formularioUsuarios.addEventListener('submit', (e) => {
    e.preventDefault();
    if (camposUsuarios.Nombre && camposUsuarios.Apellidos && camposUsuarios.Email && camposUsuarios.Telefono && camposUsuarios.Rol && camposUsuarios.Cedula && camposUsuarios.contraseña && camposUsuarios.ConfirmarContraseña) {
        formularioUsuarios.reset();
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            }
        });
        Toast.fire({
            icon: "success",
            title: "Guardado correctamente"
        });
        document.querySelectorAll('.formulario__grupo-correcto').forEach((icono) => {
            icono.classList.remove('formulario__grupo-correcto')
        });
        setTimeout(() => {
            window.location.href = 'usuariosAdmin'; // Ajusta el nombre de la página si es necesario
        }, 2000);
    } else {
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            }
        });
        Toast.fire({
            icon: "error",
            title: "Ingrese los datos correctamente"
        });
    }
});
