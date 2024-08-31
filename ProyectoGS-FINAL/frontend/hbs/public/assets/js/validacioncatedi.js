const formularioCategoriaedit = document.getElementById('formularioCategoriaedit');
const inputCategoriaEdit = document.querySelector('#formularioCategoriaedit input[type="text"]');

const expresionesCategoriaEdit = {
    categoria: /^[a-zA-Z\s]+$/ // Solo letras y espacios para la categoría
};

const camposCategoriaEdit = {
    categoria: false
};

const validarFormularioCategoriaEdit = (e) => {
    switch (e.target.id) {
        case "categoriaEdit":
            validarCampoCategoriaEdit(expresionesCategoriaEdit.categoria, e.target, "categoriaEdit");
            break;
    }
};

const validarCampoCategoriaEdit = (expresion, input, campo) => {
    const grupo = document.getElementById(`grupo__${campo}`);
    const icono = grupo.querySelector('.formulario__validacion-estado');
    const mensajeError = grupo.querySelector('.formulario__input-error');

    if (expresion.test(input.value)) {
        grupo.classList.remove("formulario__grupo-incorrecto");
        grupo.classList.add("formulario__grupo-correcto");
        icono.classList.remove('fa-times-circle');
        icono.classList.add('fa-check-circle');
        mensajeError.classList.remove("formulario__input-error-activo");
        camposCategoriaEdit[campo] = true;
    } else {
        grupo.classList.add("formulario__grupo-incorrecto");
        grupo.classList.remove("formulario__grupo-correcto");
        icono.classList.add('fa-times-circle');
        icono.classList.remove('fa-check-circle');
        mensajeError.classList.add("formulario__input-error-activo");
        camposCategoriaEdit[campo] = false;
    }
};

inputCategoriaEdit.addEventListener('keyup', validarFormularioCategoriaEdit);
inputCategoriaEdit.addEventListener('blur', validarFormularioCategoriaEdit);

formularioCategoriaedit.addEventListener('submit', (e) => {
    e.preventDefault();
    if (camposCategoriaEdit.categoria) {
        formularioCategoriaedit.reset();
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
