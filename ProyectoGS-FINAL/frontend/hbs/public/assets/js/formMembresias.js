document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('#FormularioMembresias input, #FormularioMembresias textarea');
    
    const expresiones = {
        NombreMembresia: /^.{3,}$/,  // Al menos 3 caracteres
        Frecuencia: /^[1-9]\d*$/,  // Solo números mayores a 0
        Costoventa: /^[1-9]\d*(\.\d{1,2})?$/,  // Números mayores a 0, hasta dos decimales
        Descripcion: /^.{10,}$/  // Al menos 10 caracteres
    };

    const campos = {
        NombreMembresia: false,
        Frecuencia: false,
        Costoventa: false,
        Descripcion: false
    };

    const validarFormulario = (e) => {
        switch (e.target.name) {
            case "NombreMembresia":
                validarCampo(expresiones.NombreMembresia, e.target, 'NombreMembresia');
                break;
            case "Frecuencia":
                validarCampo(expresiones.Frecuencia, e.target, 'Frecuencia');
                break;
            case "Costoventa":
                validarCampo(expresiones.Costoventa, e.target, 'Costoventa');
                break;
            case "Descripcion":
                validarCampo(expresiones.Descripcion, e.target, 'Descripcion');
                break;
        }
    };

    const validarCampo = (expresion, input, campo) => {
        const grupo = document.getElementById(`grupo__${campo}`);
        const icono = grupo ? grupo.querySelector('i') : null;
        const error = grupo ? grupo.querySelector('.formulario__input-error') : null;
        
        if (grupo && icono && error) {
            if (expresion.test(input.value)) {
                grupo.classList.remove('formulario__grupo-incorrecto');
                grupo.classList.add('formulario__grupo-correcto');
                icono.classList.add('fa-check-circle');
                icono.classList.remove('fa-times-circle');
                error.classList.remove('formulario__input-error-activo');
                campos[campo] = true;
            } else {
                grupo.classList.add('formulario__grupo-incorrecto');
                grupo.classList.remove('formulario__grupo-correcto');
                icono.classList.remove('fa-check-circle');
                icono.classList.add('fa-times-circle');
                error.classList.add('formulario__input-error-activo');
                campos[campo] = false;
            }
        }
    };

    inputs.forEach((input) => {
        input.addEventListener('keyup', validarFormulario);
        input.addEventListener('blur', validarFormulario);
    });

    const formularioMembresias = document.getElementById('FormularioMembresias');
    if (formularioMembresias) {
        formularioMembresias.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (Object.values(campos).every(campo => campo)) {
                // Aquí podrías agregar lógica para verificar si la membresía ya existe, si es necesario

                // Mostrar mensaje de éxito usando SweetAlert o una notificación personalizada
                Swal.fire({
                    title: 'Éxito',
                    text: 'La membresía se guardó con éxito.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Redirigir a la página de membresiasAdmin
                        window.location.href = '/membresiasAdmin'; // Asegúrate de que la URL sea correcta
                    }
                });

                // Resetea el formulario
                formularioMembresias.reset();
            } else {
                // Mostrar mensaje de error usando SweetAlert o una notificación personalizada
                Swal.fire({
                    title: 'Error',
                    text: 'Por favor, completa todos los campos correctamente.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            }
        });
    }
});
