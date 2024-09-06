document.addEventListener('DOMContentLoaded', function() {
    const formularioRegistro = document.getElementById('formularioRegistro');
    const inputs = document.querySelectorAll('#formularioRegistro input, #formularioRegistro select');

    // Funcionalidad de mostrar/ocultar contraseña
    const togglePassword1 = document.getElementById('togglePassword1');
    const togglePassword2 = document.getElementById('togglePassword2');
    const passwordInput1 = document.getElementById('Contrasena');
    const passwordInput2 = document.getElementById('confirmarPassword');

    togglePassword1.addEventListener('click', function() {
        const type = passwordInput1.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput1.setAttribute('type', type);
        this.querySelector('i').classList.toggle('fa-eye-slash');
    });

    togglePassword2.addEventListener('click', function() {
        const type = passwordInput2.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput2.setAttribute('type', type);
        this.querySelector('i').classList.toggle('fa-eye-slash');
    });

    // Función para validar que no haya campos vacíos
    const validarCamposVacios = () => {
        let camposValidos = true;

        inputs.forEach((input) => {
            const grupo = input.closest('.form-group');
            const mensajeError = grupo.querySelector('.text-danger');
            
            if (input.value.trim() === '') {
                grupo.classList.add('formularioRegistro__grupo-incorrecto');
                grupo.classList.remove('formularioRegistro__grupo-correcto');
                mensajeError.classList.remove('d-none');
                camposValidos = false;
            } else {
                mensajeError.classList.add('d-none');
                grupo.classList.remove('formularioRegistro__grupo-incorrecto');
                grupo.classList.add('formularioRegistro__grupo-correcto');
            }
        });

        return camposValidos;
    };

    const expresiones = {
        Nombres: /^[a-zA-ZÀ-ÿ\s]{3,20}$/,
        Apellidos: /^[a-zA-ZÀ-ÿ\s]{3,40}$/,
        Documento: /^[A-Za-z0-9\s-]{10}$/,
        Correo: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
        Telefono: /^(\(\+?\d{2,3}\)[\*|\s|\-|\.]?(([\d][\*|\s|\-|\.]?){6})(([\d][\s|\-|\.]?){2})?|(\+?[\d][\s|\-|\.]?){8}(([\d][\s|\-|\.]?){2}(([\d][\s|\-|\.]?){2})?)?)$/,
        FechaDeNacimiento: /^\d{4}-\d{2}-\d{2}$/,
        Direccion: /^[A-Za-z0-9\s#áéíóúÁÉÍÓÚüÜ.,-]+$/,
        Contrasena: /^(?=.*[A-Z])(?=.*\d).+$/ // Mínimo una mayúscula y un número, de 4 a 12 caracteres.
    };

    const campos = {
        Nombres: false,
        Apellidos: false,
        TipoDocumento: false,
        Documento: false,
        Correo: false,
        Telefono: false,
        FechaDeNacimiento: false,
        Direccion: false,
        Genero: false,
        Contrasena: false,
        confirmarPassword: false,
        terminos: false
    };

    const validarCampo = (expresion, input, campo) => {
        const grupo = input.closest('.form-group');
        const mensajeError = grupo.querySelector('.text-danger');

        if (expresion.test(input.value)) {
            grupo.classList.remove('formularioRegistro__grupo-incorrecto');
            grupo.classList.add('formularioRegistro__grupo-correcto');
            mensajeError.classList.add('d-none');
            campos[campo] = true;
        } else {
            grupo.classList.add('formularioRegistro__grupo-incorrecto');
            grupo.classList.remove('formularioRegistro__grupo-correcto');
            mensajeError.classList.remove('d-none');
            campos[campo] = false;
        }
    };

    const validarFechaNacimiento = (input) => {
        const grupo = input.closest('.form-group');
        const mensajeError = grupo.querySelector('.text-danger');

        if (expresiones.FechaDeNacimiento.test(input.value)) {
            // Verificar si la fecha no es futura
            const fechaNacimiento = new Date(input.value);
            const hoy = new Date();
            
            if (fechaNacimiento >= hoy) {
                grupo.classList.add('formularioRegistro__grupo-incorrecto');
                grupo.classList.remove('formularioRegistro__grupo-correcto');
                mensajeError.textContent = 'La fecha de nacimiento no puede ser futura.';
                mensajeError.classList.remove('d-none');
                campos['FechaDeNacimiento'] = false;
            } else {
                grupo.classList.remove('formularioRegistro__grupo-incorrecto');
                grupo.classList.add('formularioRegistro__grupo-correcto');
                mensajeError.classList.add('d-none');
                campos['FechaDeNacimiento'] = true;
            }
        } else {
            grupo.classList.add('formularioRegistro__grupo-incorrecto');
            grupo.classList.remove('formularioRegistro__grupo-correcto');
            mensajeError.classList.remove('d-none');
            campos['FechaDeNacimiento'] = false;
        }
    };

    const validarSelect = (select, campo) => {
        const grupo = select.closest('.form-group');
        const mensajeError = grupo.querySelector('.text-danger');

        if (select.value !== "") {
            grupo.classList.remove('formularioRegistro__grupo-incorrecto');
            grupo.classList.add('formularioRegistro__grupo-correcto');
            mensajeError.classList.add('d-none');
            campos[campo] = true;
        } else {
            grupo.classList.add('formularioRegistro__grupo-incorrecto');
            grupo.classList.remove('formularioRegistro__grupo-correcto');
            mensajeError.classList.remove('d-none');
            campos[campo] = false;
        }
    };

    const validarPassword2 = () => {
        const inputPassword1 = document.getElementById('Contrasena');
        const inputPassword2 = document.getElementById('confirmarPassword');
        const grupoConfirmarPass = document.getElementById('grupo__confirmarPassword');
        const mensajeError = grupoConfirmarPass.querySelector('.text-danger');
    
        if (inputPassword1.value !== inputPassword2.value) {
            grupoConfirmarPass.classList.add('formularioRegistro__grupo-incorrecto');
            grupoConfirmarPass.classList.remove('formularioRegistro__grupo-correcto');
            mensajeError.classList.remove('d-none');
            campos['confirmarPassword'] = false;
        } else {
            grupoConfirmarPass.classList.remove('formularioRegistro__grupo-incorrecto');
            grupoConfirmarPass.classList.add('formularioRegistro__grupo-correcto');
            mensajeError.classList.add('d-none');
            campos['confirmarPassword'] = true;
        }
    };

    const validarTerminos = (checkbox) => {
        campos['terminos'] = checkbox.checked;
    };

    const mostrarExito = () => {
        // Mostrar éxito con SweetAlert
        Swal.fire({
            icon: 'success',
            title: 'Registro exitoso',
            text: '¡Tu registro ha sido completado con éxito!',
            timer: 3000, // Cierra automáticamente después de 3 segundos
            showConfirmButton: false
        });

        formularioRegistro.reset();
        const mensajeExito = document.getElementById('formularioRegistro__mensaje-exito');
        if (mensajeExito) {
            mensajeExito.classList.remove('d-none');
        }

        // Reiniciar los estilos de los campos
        const grupos = document.querySelectorAll('.form-group');
        grupos.forEach(grupo => {
            grupo.classList.remove('formularioRegistro__grupo-correcto');
        });

        campos.Nombres = campos.Apellidos = campos.TipoDocumento = campos.Documento = campos.Correo = campos.Telefono = campos.FechaDeNacimiento = campos.Direccion = campos.Genero = campos.Contrasena = campos.confirmarPassword = campos.terminos = false;
    };

    inputs.forEach((input) => {
        input.addEventListener('keyup', () => {
            const campo = input.id;
            if (expresiones[campo]) {
                validarCampo(expresiones[campo], input, campo);
            }
        });

        input.addEventListener('blur', () => {
            const campo = input.id;
            if (expresiones[campo]) {
                validarCampo(expresiones[campo], input, campo);
            }
        });

        if (input.tagName === 'SELECT') {
            input.addEventListener('change', () => {
                validarSelect(input, input.id);
            });
        }

        if (input.id === 'confirmarPassword') {
            input.addEventListener('keyup', validarPassword2);
            input.addEventListener('blur', validarPassword2);
        }

        if (input.id === 'FechaDeNacimiento') {
            input.addEventListener('keyup', () => {
                validarFechaNacimiento(input);
            });
            input.addEventListener('blur', () => {
                validarFechaNacimiento(input);
            });
        }
    });

    const terminosCheckbox = document.getElementById('terminos');
    if (terminosCheckbox) {
        terminosCheckbox.addEventListener('change', () => {
            validarTerminos(terminosCheckbox);
        });
    }

    formularioRegistro.addEventListener('submit', (e) => {
        e.preventDefault();
        const camposVacios = validarCamposVacios();

        if (camposVacios && Object.values(campos).every(valor => valor === true)) {
            mostrarExito();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor, completa correctamente todos los campos requeridos.',
                timer: 3000,
                showConfirmButton: false
            });
        }
    });
});
