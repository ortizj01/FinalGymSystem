const FormularioMembresias = document.getElementById('FormularioMembresias');
const inputs = document.querySelectorAll('#FormularioMembresias input');

const expresiones = {
    NombreMembresia: /^[a-zA-Z0-9À-ÿ\s.,-]+$/,
    Cantidad: /^[0-9]+$/,
    Costototal: /^\d+(\.\d{1,2})?$|^\d+$/,
    Costoventa: /^\d+(\.\d{1,2})?$/
};

const campos = {
    NombreMembresia: false,
    Cantidad: false,
    Costototal: false,
    Costoventa: false
};

const validarformularioMembresias = (e) => {
    switch (e.target.name) {
        case "NombreMembresia":
            validarCampo(expresiones.NombreMembresia, e.target, 'NombreMembresia');
            break;

        case "Cantidad":
            validarCampo(expresiones.Cantidad, e.target, 'Cantidad');
            break;

        case "Costototal":
            validarCampo(expresiones.Costototal, e.target, 'Costototal');
            break;

        case "Costoventa":
            validarCampo(expresiones.Costoventa, e.target, 'Costoventa');
            break;
    }
};

const validarCampo = (expresion, input, campo) => {
    if (expresion.test(input.value)) {
        document.getElementById(`grupo__${campo}`).classList.remove('formulario__grupo-incorrecto');
        document.getElementById(`grupo__${campo}`).classList.add('formulario__grupo-correcto');
        document.querySelector(`#grupo__${campo} i`).classList.remove('fa-times-circle');
        document.querySelector(`#grupo__${campo} i`).classList.add('fa-check-circle');
        document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.remove('formulario__input-error-activo');
        campos[campo] = true;
    } else {
        document.getElementById(`grupo__${campo}`).classList.add('formulario__grupo-incorrecto');
        document.getElementById(`grupo__${campo}`).classList.remove('formulario__grupo-correcto');
        document.querySelector(`#grupo__${campo} i`).classList.remove('fa-check-circle');
        document.querySelector(`#grupo__${campo} i`).classList.add('fa-times-circle');
        document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.add('formulario__input-error-activo');
        campos[campo] = false;
    }
};

inputs.forEach((input) => {
    input.addEventListener('keyup', validarformularioMembresias);
    input.addEventListener('blur', validarformularioMembresias);
});

FormularioMembresias.addEventListener('submit', (e) => {
    e.preventDefault();

    if (campos.NombreMembresia && campos.Cantidad && campos.Costototal && campos.Costoventa) {
        FormularioMembresias.reset();
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
            icono.classList.remove('formulario__grupo-correcto');
        });
        setTimeout(() => {
            window.location.href = 'membresiasAdmin'; // Ajusta el nombre de la página si es necesario
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
