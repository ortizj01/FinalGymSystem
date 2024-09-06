const formularioEditarProveedor = document.getElementById('formularioEditarProveedor');
const inputsEditar = document.querySelectorAll('#formularioEditarProveedor input');

const expresionesEditar = {
    Nombreedit: /^[a-zA-Z\s]+$/,
    Contactoedit: /^[a-zA-Z\s]+$/,
    Telefonoedit: /^[0-9]+$/,
    Direccionedit: /^[a-zA-Z0-9\s,.\-#]+$/,
    NITedit: /^[0-9]+$/
};

const camposEditar = {
    Nombreedit: false,
    Contactoedit: false,
    Telefonoedit: false,
    Direccionedit: false,
    NITedit: false
};

const validarFormularioEditar = (e) => {
    switch (e.target.name) {
        case "Nombreedit":
            validarCampoEditar(expresionesEditar.Nombreedit, e.target, "Nombreedit");
            break;
        case "Contactoedit":
            validarCampoEditar(expresionesEditar.Contactoedit, e.target, "Contactoedit");
            break;
        case "Telefonoedit":
            validarCampoEditar(expresionesEditar.Telefonoedit, e.target, "Telefonoedit");
            break;
        case "Direccionedit":
            validarCampoEditar(expresionesEditar.Direccionedit, e.target, "Direccionedit");
            break;
        case "NITedit":
            validarCampoEditar(expresionesEditar.NITedit, e.target, "NITedit");
            break;
    }
};

const validarCampoEditar = (expresion, input, campo) => {
    const grupo = document.getElementById(`grupo__${campo}`);
    const icono = grupo.querySelector('.formulario__validacion-estado');
    const mensajeError = grupo.querySelector('.formulario__input-error');

    if (expresion.test(input.value)) {
        grupo.classList.remove("formulario__grupo-incorrecto");
        grupo.classList.add("formulario__grupo-correcto");
        icono.classList.remove('fa-times-circle');
        icono.classList.add('fa-check-circle');
        mensajeError.classList.remove("formulario__input-error-activo");
        camposEditar[campo] = true;
    } else {
        grupo.classList.add("formulario__grupo-incorrecto");
        grupo.classList.remove("formulario__grupo-correcto");
        icono.classList.add('fa-times-circle');
        icono.classList.remove('fa-check-circle');
        mensajeError.classList.add("formulario__input-error-activo");
        camposEditar[campo] = false;
    }
};

inputsEditar.forEach((input) => {
    input.addEventListener('keyup', validarFormularioEditar);
    input.addEventListener('blur', validarFormularioEditar);
});

formularioEditarProveedor.addEventListener('submit', (e) => {
    e.preventDefault();
    if (camposEditar.Nombreedit && camposEditar.Contactoedit && camposEditar.Telefonoedit && camposEditar.Direccionedit && camposEditar.NITedit) {
        formularioEditarProveedor.reset();
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
