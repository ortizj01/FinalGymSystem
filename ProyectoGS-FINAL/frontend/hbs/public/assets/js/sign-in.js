const apiUrl = 'http://localhost:3000/api/auth/login';

function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    console.log('Datos enviados:', { Correo: email, Contrasena: password });

    // Limpiar mensajes de error anteriores
    document.getElementById('emailError').innerText = '';
    document.getElementById('passwordError').innerText = '';
    document.getElementById('loginError').innerText = '';

    // Validaciones básicas
    if (!email) {
        document.getElementById('emailError').innerText = 'El correo es requerido';
        return;
    }
    if (!password) {
        document.getElementById('passwordError').innerText = 'La contraseña es requerida';
        return;
    }

    // Realizar la solicitud de inicio de sesión a la API
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Correo: email, Contrasena: password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }
        return response.json();
    })
    .then(data => {
        console.log('Respuesta del servidor:', data);
        if (data.token) {
            localStorage.setItem('token', data.token); // Guardar el token en localStorage

            // Realizar una solicitud para obtener los detalles del usuario autenticado
            fetch('http://localhost:3000/api/auth/usuario-autenticado', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-token': data.token // Enviar el token en los headers
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener los detalles del usuario');
                }
                return response.json();
            })
            .then(user => {
                console.log('Detalles del usuario:', user);
                // Verificar el rol del usuario y redirigir a la ruta adecuada
                if (user.Rol === 'Entrenador' || user.Rol === 'Administrador') {
                    window.location.href = '/dashboard';
                } else if (user.Rol === 'Cliente' || user.Rol === 'Beneficiario') {
                    window.location.href = '/indexCarrito';
                } else {
                    document.getElementById('loginError').innerText = 'Rol de usuario no reconocido';
                }
            })
            .catch(error => {
                console.error('Error al obtener los detalles del usuario:', error);
                document.getElementById('loginError').innerText = 'Error al obtener los detalles del usuario';
            });

        } else {
            document.getElementById('loginError').innerText = data.msg || 'Error al iniciar sesión';
        }
    })
    .catch(error => {
        console.error('Error al conectar, intente nuevamente:', error);
        document.getElementById('loginError').innerText = 'Error al conectar, intente nuevamente';
    });
}

// Función para cargar eventos protegidos
function cargarEventosProtegidos() {
    // Recuperar el token del localStorage
    const token = localStorage.getItem('authToken');

    if (token) {
        fetch('http://localhost:8086/eventos', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }
            return response.json();
        })
        .then(data => {
            console.log('Respuesta del servidor:', data);
            // Aquí puedes manejar la respuesta como sea necesario
        })
        .catch(error => console.error('Error:', error));
    } else {
        console.log('No hay token disponible');
        // Aquí puedes manejar el caso de que no haya token disponible, por ejemplo, redirigir a la página de inicio de sesión
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const togglePassword = document.getElementById('togglePassword');
    const password = document.getElementById('password');

    togglePassword.addEventListener('click', function() {
        // Alternar el tipo de entrada entre 'password' y 'text'
        const type = password.type === 'password' ? 'text' : 'password';
        password.type = type;

        // Alternar el ícono entre 'eye' y 'eye-slash'
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });
});

