// Función para obtener y mostrar información del usuario
function actualizarTopbar() {
    const token = localStorage.getItem('token');

    if (!token) {
        console.error('No token found in localStorage');
        document.getElementById('welcomeMessage').innerText = 'Bienvenidos';
        document.getElementById('authLinks').style.display = 'block';
        document.getElementById('userMenu').style.display = 'none';
        return;
    }

    fetch('https://finalgymsystem.onrender.com/api/auth/usuario-autenticado', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-token': token
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al obtener la información del usuario.');
        }
        return response.json();
    })
    .then(data => {
        console.log('Datos del usuario recibidos:', data);

        // Guardar la información del usuario en localStorage
        localStorage.setItem('usuario', JSON.stringify(data));

        // Actualizar el nombre y el rol del usuario en la topbar
        document.getElementById('welcomeMessage').innerText = `Bienvenido, ${data.Nombres} ${data.Apellidos}`;
        document.getElementById('authLinks').style.display = 'none';
        document.getElementById('userMenu').style.display = 'block';
    })
    .catch(error => {
        console.error('Error al obtener la información del usuario:', error);
        document.getElementById('welcomeMessage').innerText = 'Bienvenidos';
        document.getElementById('authLinks').style.display = 'block';
        document.getElementById('userMenu').style.display = 'none';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    actualizarTopbar(); // Ejecutar la función al cargar la página

    // Manejar el cierre de sesión con advertencia
    document.getElementById('logout').addEventListener('click', (e) => {
        e.preventDefault();

        Swal.fire({
            title: '¿Estás seguro?',
            text: "Estás a punto de cerrar sesión.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, cerrar sesión',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Si el usuario confirma, se procede a cerrar sesión
                localStorage.removeItem('token');
                localStorage.removeItem('usuario');
                actualizarTopbar(); // Actualizar la topbar después del cierre de sesión

                Swal.fire(
                    'Sesión cerrada',
                    'Has cerrado sesión exitosamente.',
                    'success'
                ).then(() => {
                    window.location.href = '/indexCarrito';
                });
            }
        });
    });

    // Manejar el clic en el botón de "Pedido"
    document.getElementById('pedidoBtn').addEventListener('click', (e) => {
        const token = localStorage.getItem('token');
        if (!token) {
            e.preventDefault();
            Swal.fire({
                icon: 'warning',
                title: 'No has iniciado sesión',
                text: 'Debes iniciar sesión para finalizar el pedido.',
                confirmButtonText: 'Iniciar sesión'
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.setItem('redirectAfterLogin', window.location.href);
                    window.location.href = '/ingresar';
                }
            });
        } else {
            window.location.href = 'pedidoCarrito';
        }
    });
});
