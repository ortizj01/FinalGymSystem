const formularioProductoedit = document.getElementById('formularioProductoedit');
const inputsProductoEdit = document.querySelectorAll('#formularioProductoedit input[type="text"]');

const expresionesProductoEdit = {
    nombreProducto: /^[a-zA-Z\s]+$/, // Solo letras y espacios para el nombre del producto
    precioProducto: /^[0-9.]+$/,     // Solo números y puntos para el precio
    ivaProducto: /^[0-9.]+$/,        // Solo números y puntos para el IVA
};

const camposProductoEdit = {
    nombreProducto: false,
    precioProducto: false,
    ivaProducto: false
};

const validarFormularioProductoEdit = (e) => {
    switch (e.target.id) {
        case "Nombreproducto":
            validarCampoProductoEdit(expresionesProductoEdit.nombreProducto, e.target, "nombreProducto");
            break;
        case "Precioproducto":
            validarCampoProductoEdit(expresionesProductoEdit.precioProducto, e.target, "precioProducto");
            break;
        case "ivaproducto":
            validarCampoProductoEdit(expresionesProductoEdit.ivaProducto, e.target, "ivaProducto");
            break;
    }
};

const validarCampoProductoEdit = (expresion, input, campo) => {
    const grupo = input.parentElement;
    const icono = grupo.querySelector('.formulario__validacion-estado');
    const mensajeError = grupo.querySelector('.formulario__input-error');

    if (expresion.test(input.value)) {
        grupo.classList.remove("formulario__grupo-incorrecto");
        grupo.classList.add("formulario__grupo-correcto");
        icono.classList.remove('fa-times-circle');
        icono.classList.add('fa-check-circle');
        mensajeError.classList.remove("formulario__input-error-activo");
        camposProductoEdit[campo] = true;
    } else {
        grupo.classList.add("formulario__grupo-incorrecto");
        grupo.classList.remove("formulario__grupo-correcto");
        icono.classList.add('fa-times-circle');
        icono.classList.remove('fa-check-circle');
        mensajeError.classList.add("formulario__input-error-activo");
        camposProductoEdit[campo] = false;
    }
};

inputsProductoEdit.forEach((input) => {
    input.addEventListener('keyup', validarFormularioProductoEdit);
    input.addEventListener('blur', validarFormularioProductoEdit);
});

formularioProductoedit.addEventListener('submit', (e) => {
    e.preventDefault();
    if (camposProductoEdit.nombreProducto && camposProductoEdit.precioProducto && camposProductoEdit.ivaProducto) {
        formularioProductoedit.reset();
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
