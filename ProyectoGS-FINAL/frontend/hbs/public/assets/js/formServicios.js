// Obtención de elementos del DOM
const FormularioServicios = document.getElementById('FormularioServicios');
const inputs = document.querySelectorAll('#FormularioServicios input, #FormularioServicios select');

// Expresiones regulares para validación
const expresiones = {
    NombreClase: /^[a-zA-Z0-9À-ÿ\s.,-]+$/,
    Cantidad: /^[0-9]+$/,
    CostoTotal: /^\d+(\.\d{1,2})?$|^\d+$/,
    CostoVenta: /^\d+(\.\d{1,2})?$|^\d+$/
};

// Objeto para mantener el estado de validación de los campos
const campos = {
    NombreClase: false,
    Cantidad: false,
    CostoTotal: false,
    CostoVenta: false,
    Estado: false
};

// Función de validación de campos
const validarCampo = (expresion, input, campo) => {
    if (expresion.test(input.value)) {
        document.getElementById(`grupo_${campo}`).classList.remove('formulario__grupo-incorrecto');
        document.getElementById(`grupo_${campo}`).classList.add('formulario__grupo-correcto');
        document.querySelector(`#grupo_${campo} i`).classList.remove('fa-times-circle');
        document.querySelector(`#grupo_${campo} i`).classList.add('fa-check-circle');
        document.querySelector(`#grupo_${campo} .formulario__input-error`).classList.remove('formulario__input-error-activo');
        campos[campo] = true;
    } else {
        document.getElementById(`grupo_${campo}`).classList.add('formulario__grupo-incorrecto');
        document.getElementById(`grupo_${campo}`).classList.remove('formulario__grupo-correcto');
        document.querySelector(`#grupo_${campo} i`).classList.remove('fa-check-circle');
        document.querySelector(`#grupo_${campo} i`).classList.add('fa-times-circle');
        document.querySelector(`#grupo_${campo} .formulario__input-error`).classList.add('formulario__input-error-activo');
        campos[campo] = false;
    }
};

// Función para validar el formulario completo
const validarFormularioServicios = (e) => {
    switch (e.target.name) {
        case "NombreClase":
            validarCampo(expresiones.NombreClase, e.target, 'NombreClase');
            break;
        case "Cantidad":
            validarCampo(expresiones.Cantidad, e.target, 'Cantidad');
            break;
        case "CostoTotal":
            validarCampo(expresiones.CostoTotal, e.target, 'CostoTotal');
            break;
        case "CostoVenta":
            validarCampo(expresiones.CostoVenta, e.target, 'CostoVenta');
            break;
        case "Estado":
            if (e.target.value) {
                document.getElementById(`grupo_Estado`).classList.remove('formulario__grupo-incorrecto');
                document.getElementById(`grupo_Estado`).classList.add('formulario__grupo-correcto');
                document.querySelector(`#grupo_Estado i`).classList.remove('fa-eye-slash');
                document.querySelector(`#grupo_Estado i`).classList.add('fa-check-circle');
                document.querySelector(`#grupo_Estado .formulario__input-error`).classList.remove('formulario__input-error-activo');
                campos['Estado'] = true;
            } else {
                document.getElementById(`grupo_Estado`).classList.add('formulario__grupo-incorrecto');
                document.getElementById(`grupo_Estado`).classList.remove('formulario__grupo-correcto');
                document.querySelector(`#grupo_Estado i`).classList.remove('fa-check-circle');
                document.querySelector(`#grupo_Estado i`).classList.add('fa-times-circle'); // Cambiar ícono a X
                document.querySelector(`#grupo_Estado .formulario__input-error`).classList.add('formulario__input-error-activo');
                campos['Estado'] = false;
            }
            break;
    }
};

// Añadir event listeners a los inputs
inputs.forEach((input) => {
    input.addEventListener('keyup', validarFormularioServicios);
    input.addEventListener('blur', validarFormularioServicios);
});

// Manejo del submit del formulario
FormularioServicios.addEventListener('submit', (e) => {
    e.preventDefault();

    if (campos.NombreClase && campos.Cantidad && campos.CostoTotal && campos.CostoVenta && campos.Estado) {
        Swal.fire({
            icon: 'success',
            title: 'Formulario Enviado',
            text: 'Formulario enviado exitosamente!',
            confirmButtonText: 'Aceptar'
        }).then(() => {
            FormularioServicios.reset();
            window.location.href = 'serviciosAdmin'; // Ajusta el nombre de la página si es necesario
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor rellena el formulario correctamente.',
            confirmButtonText: 'Aceptar'
        });
    }
});
