const formularioRegistro = document.getElementById('formularioRegistro')
const inputs = document.querySelectorAll('#formularioRegistro input')
const selects = document.querySelectorAll('#formularioRegistro select');


const expresiones = {
	descripcionAgenda: /^.{1,200}$/,
    horaInicio: /^(([8-9]|1[0-9]):[0-5][0-9](\s)?([AaPp][Mm]))$/,
    horaFin:  /^(([8-9]|1[0-9]):[0-5][0-9](\s)?([AaPp][Mm]))$/
}

const campos = {
    descripcionAgenda: false,
    horaInicio: false,
    horaFin:  false,
    serviciosAgenda: false,
    nombreEmpleado: false
}

const validarFormulario = (e) => {
    switch (e.target.name) {
        case "descripcionAgenda":
            validarCampo(expresiones.descripcionAgenda, e.target, 'descripcionAgenda')
        break
        case "horaInicio":
            validarCampo(expresiones.horaInicio, e.target, 'horaInicio')
        break
        case "horaFin":
            validarCampo(expresiones.horaInicio, e.target, 'horaFin')
        break
    }
}

const validarCampo = (expresion, input, campo) => {
    if (expresion.test(input.value)) {
        document.getElementById(`grupo__${campo}`).classList.remove('formularioRegistro__grupo-incorrecto')
        document.getElementById(`grupo__${campo}`).classList.add('formularioRegistro__grupo-correcto')
        document.querySelector(`#grupo__${campo} i`).classList.add('fa-check-circle')
        document.querySelector(`#grupo__${campo} i`).classList.remove('fa-times-circle')
        document.querySelector(`#grupo__${campo} .formularioRegistro__input-error`).classList.remove('formularioRegistro__input-error-activo')
        campos[campo] = true
    }else {
        document.getElementById(`grupo__${campo}`).classList.add('formularioRegistro__grupo-incorrecto')
        document.getElementById(`grupo__${campo}`).classList.remove('formularioRegistro__grupo-correcto')
        document.querySelector(`#grupo__${campo} i`).classList.remove('fa-check-circle')
        document.querySelector(`#grupo__${campo} i`).classList.add('fa-times-circle')
        document.querySelector(`#grupo__${campo} .formularioRegistro__input-error`).classList.add('formularioRegistro__input-error-activo')
        campo[false]
    }
}

const validarCampoSelect = (select) => {
    const campo = select.getAttribute('name');

    if (select.value !== '') {
        document.getElementById(`grupo__${campo}`).classList.remove('formularioRegistro__grupo-incorrecto');
        document.getElementById(`grupo__${campo}`).classList.add('formularioRegistro__grupo-correcto');
        document.querySelector(`#grupo__${campo} i`).classList.remove('fa-times-circle');
        document.querySelector(`#grupo__${campo} i`).classList.add('fa-check-circle');
        document.querySelector(`#grupo__${campo} .formularioRegistro__input-error`).classList.remove('formularioRegistro__input-error-activo');
        campos[campo] = true;
    } else {
        document.getElementById(`grupo__${campo}`).classList.add('formularioRegistro__grupo-incorrecto');
        document.getElementById(`grupo__${campo}`).classList.remove('formularioRegistro__grupo-correcto');
        document.querySelector(`#grupo__${campo} i`).classList.add('fa-times-circle');
        document.querySelector(`#grupo__${campo} i`).classList.remove('fa-check-circle');
        document.querySelector(`#grupo__${campo} .formularioRegistro__input-error`).classList.add('formularioRegistro__input-error-activo');
        campos[campo] = false;
    }
}

selects.forEach((select) => {
    select.addEventListener('change', (e) => {
        validarCampoSelect(e.target);
    });
});


inputs.forEach((input) => {
    input.addEventListener('keyup', validarFormulario)
    input.addEventListener('blur', validarFormulario)
})

formularioRegistro.addEventListener('submit', (e) =>{
    e.preventDefault();

    if (campos.descripcionAgenda && campos.horaInicio && campos.horaFin && campos.serviciosAgenda && campos.nombreEmpleado) {
        formularioRegistro.reset()

        Swal.fire({
            title: "Excelente!",
            text: "La rutina se guardo con exito!",
            icon: "success"
        }).then(() => {
            // Cerrar el modal después de mostrar la alerta
            $("#formularioEventos").modal('hide');
            
            // Remover clases de éxito
            document.querySelectorAll('.formularioRegistro__grupo-correcto').forEach((icono) => {
                icono.classList.remove('formularioRegistro__grupo-correcto');
            });
        });

    } else {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Ingresa los datos correctos",
          });
    }

})