document.addEventListener('DOMContentLoaded', function() {
    const formularioRegistro = document.getElementById('formularioRegistro');
    const inputs = document.querySelectorAll('#formularioRegistro input, #formularioRegistro select');

    const expresiones = {
        Nombres: /^[a-zA-ZÀ-ÿ\s]{1,20}$/,
        Apellidos: /^[a-zA-ZÀ-ÿ\s]{1,40}$/,
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
        document.getElementById('formularioRegistro__mensaje-exito').classList.remove('d-none');
    };

    const mostrarError = () => {
        // Mostrar error con SweetAlert
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor completa todos los campos correctamente.',
            timer: 3000, // Cierra automáticamente después de 3 segundos
            showConfirmButton: false
        });

        document.getElementById('formularioRegistro__mensaje').classList.remove('d-none');
    };

    // Event listeners para validar en tiempo real
    inputs.forEach((input) => {
        if (input.tagName === "SELECT") {
            input.addEventListener('change', () => {
                const campo = input.id;
                validarSelect(input, campo);
            });
        } else {
            input.addEventListener('keyup', () => {
                const campo = input.id;
                validarCampo(expresiones[campo], input, campo);
            });

            input.addEventListener('blur', () => {
                const campo = input.id;
                validarCampo(expresiones[campo], input, campo);
            });
        }
    });

    // Event listener para validar la confirmación de contraseña
    const inputPassword1 = document.getElementById('Contrasena');
    const inputPassword2 = document.getElementById('confirmarPassword');
    inputPassword1.addEventListener('input', validarPassword2);
    inputPassword2.addEventListener('input', validarPassword2);

    // Event listener para validar los términos y condiciones
    const checkboxTerminos = document.getElementById('terminos');
    checkboxTerminos.addEventListener('change', () => {
        validarTerminos(checkboxTerminos);
    });

    // Event listener para el envío del formulario
    formularioRegistro.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validar todos los campos
        Object.keys(campos).forEach(campo => {
            if (campo === 'TipoDocumento' || campo === 'Genero') {
                validarSelect(document.getElementById(campo), campo);
            } else if (campo !== 'confirmarPassword' && campo !== 'terminos') {
                validarCampo(expresiones[campo], document.getElementById(campo), campo);
            }
        });

        // Verificar si todos los campos son válidos
        if (Object.values(campos).every(campo => campo)) {
            mostrarExito();
        } else {
            mostrarError();
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const togglePassword1 = document.getElementById('togglePassword1');
    const togglePassword2 = document.getElementById('togglePassword2');
    const passwordInput1 = document.getElementById('Contrasena');
    const passwordInput2 = document.getElementById('confirmarPassword');
    
    togglePassword1.addEventListener('click', function () {
        // Alternar el tipo de input entre 'password' y 'text'
        const type = passwordInput1.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput1.setAttribute('type', type);
        // Cambiar el ícono en función del tipo
        this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
    });
    
    togglePassword2.addEventListener('click', function () {
        // Alternar el tipo de input entre 'password' y 'text'
        const type = passwordInput2.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput2.setAttribute('type', type);
        // Cambiar el ícono en función del tipo
        this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
    });
});

