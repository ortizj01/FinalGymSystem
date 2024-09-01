document.addEventListener('DOMContentLoaded', () => {
    // Obtener el formulario y los campos
    const formularioUsuarios = document.getElementById('formularioUsuarios');
    const inputsUsuarios = document.querySelectorAll('#formularioUsuarios input');
    const selectsUsuarios = document.querySelectorAll('#formularioUsuarios select');

    // Expresiones regulares para validación
    const expresionesUsuarios = {
        Nombre: /^[a-zA-ZÀ-ÿ\s]{1,50}$/,
        Apellidos: /^[a-zA-ZÀ-ÿ\s]{1,50}$/,
        Email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
        Telefono: /^[0-9]{10}$/,
        FechaDeNacimiento: /^\d{4}-\d{2}-\d{2}$/, // Formato de fecha YYYY-MM-DD
Direccion: /^[a-zA-Z0-9\s,.-#]{5,100}$/,
        Genero: /^[a-zA-Z]+$/,
        Rol: /^[a-zA-Z]+$/,
        Estado: /^[01]$/,
      
    };

    // Estado de los campos
    const camposUsuarios = {
        Nombre: false,
        Apellidos: false,
        Email: false,
        Telefono: false,
        FechaDeNacimiento: false,
        Direccion: false,
        Genero: false,
        Rol: false,
        Estado: false,
       
    };

    // Función para validar un campo
    const validarCampoUsuarios = (expresion, input, campo) => {
        const grupoCampo = document.getElementById(`grupo__${campo}`);
        const icono = grupoCampo.querySelector('i');
        const error = grupoCampo.querySelector('.formulario__input-error');

        if (expresion.test(input.value)) {
            grupoCampo.classList.remove('formulario__grupo-incorrecto');
            grupoCampo.classList.add('formulario__grupo-correcto');
            icono.classList.remove('fa-times-circle');
            icono.classList.add('fa-check-circle');
            error.classList.remove('formulario__input-error-activo');
            camposUsuarios[campo] = true;
        } else {
            grupoCampo.classList.add('formulario__grupo-incorrecto');
            grupoCampo.classList.remove('formulario__grupo-correcto');
            icono.classList.remove('fa-check-circle');
            icono.classList.add('fa-times-circle');
            error.classList.add('formulario__input-error-activo');
            camposUsuarios[campo] = false;
        }
    };

    // Función para validar la confirmación de la contraseña
    const validarConfirmarContraseña = () => {
        const inputContrasena = document.getElementById('contrasena');
        const inputConfirmarContrasena = document.getElementById('confirmarContrasena');
        const grupoCampo = document.getElementById('grupo__ConfirmarContrasena');
        const icono = grupoCampo.querySelector('i');
        const error = grupoCampo.querySelector('.formulario__input-error');

        if (inputContrasena.value === inputConfirmarContrasena.value && camposUsuarios.Contrasena) {
            grupoCampo.classList.remove('formulario__grupo-incorrecto');
            grupoCampo.classList.add('formulario__grupo-correcto');
            icono.classList.remove('fa-times-circle');
            icono.classList.add('fa-check-circle');
            error.classList.remove('formulario__input-error-activo');
            camposUsuarios.ConfirmarContrasena = true;
        } else {
            grupoCampo.classList.add('formulario__grupo-incorrecto');
            grupoCampo.classList.remove('formulario__grupo-correcto');
            icono.classList.remove('fa-check-circle');
            icono.classList.add('fa-times-circle');
            error.classList.add('formulario__input-error-activo');
            camposUsuarios.ConfirmarContrasena = false;
        }
    };

    // Función para manejar la validación del formulario
    const validarFormularioUsuarios = (e) => {
        switch (e.target.id) {
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
            case "FechaDeNacimiento":
                validarCampoUsuarios(expresionesUsuarios.FechaDeNacimiento, e.target, 'FechaDeNacimiento');
                break;
            case "Direccion":
                validarCampoUsuarios(expresionesUsuarios.Direccion, e.target, 'Direccion');
                break;
            case "Genero":
                validarCampoUsuarios(expresionesUsuarios.Genero, e.target, 'Genero');
                break;
            case "Rol":
                validarCampoUsuarios(expresionesUsuarios.Rol, e.target, 'Rol');
                break;
            case "Estado":
                validarCampoUsuarios(expresionesUsuarios.Estado, e.target, 'Estado');
                break;
            
        }
    };

    // Event listeners para validar campos al escribir o hacer blur
    inputsUsuarios.forEach(input => {
        input.addEventListener('keyup', validarFormularioUsuarios);
        input.addEventListener('blur', validarFormularioUsuarios);
    });

    // Event listeners para validar selects al cambiar
    selectsUsuarios.forEach(select => {
        select.addEventListener('change', validarFormularioUsuarios);
    });

    // Event listener para el submit del formulario
    formularioUsuarios.addEventListener('submit', (e) => {
        e.preventDefault();

        // Verificar si todos los campos son válidos
        const check = Object.values(camposUsuarios).every(Boolean);

        if (check) {
            // Código para enviar el formulario
            console.log('Formulario válido, enviando...');
            // Aquí puedes añadir el código para enviar el formulario
        } else {
            console.log('Formulario no válido');
        }
    });

    // Toggle visibility for passwords
    function togglePasswordVisibility(inputId, buttonId) {
        const passwordInput = document.getElementById(inputId);
        const button = document.getElementById(buttonId).querySelector('span');

        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            button.className = 'fa-regular fa-eye fa-xl me-2';
        } else {
            passwordInput.type = 'password';
            button.className = 'fa-regular fa-eye-slash fa-xl me-2';
        }
    }

    document.getElementById('togglePassword').addEventListener('click', function() {
        togglePasswordVisibility('contrasena', 'togglePassword');
    });

    document.getElementById('toggleConfirmPassword').addEventListener('click', function() {
        togglePasswordVisibility('confirmarContrasena', 'toggleConfirmPassword');
    });
});
