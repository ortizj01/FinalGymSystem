// Importar SweetAlert desde un CDN (puedes ajustar la URL según sea necesario)
async function actualizarDatos(event) {
    if (event) {
        event.preventDefault(); // Evitar el envío del formulario por defecto
    }

    const token = localStorage.getItem('token');
    if (!token) {
        console.error('No se encontró token');
        return;
    }

    try {
        // Obtener datos del usuario autenticado desde la API
        const response = await fetch('http://localhost:3000/api/auth/usuario-autenticado', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-token': token
            }
        });

        if (!response.ok) {
            throw new Error('Hubo un problema al obtener la información del usuario.');
        }

        const usuarioActual = await response.json();
        console.log('Datos del usuario recibidos:', usuarioActual);

        // Verificar que los datos del usuario actual sean válidos y completos
        if (!usuarioActual || !usuarioActual.IdUsuario) {
            console.error('No se encontraron datos válidos del usuario actual');
            return;
        }

        // Obtener valores de los campos del formulario
        const nombresInput = document.getElementById('Nombres').value.trim();
        const apellidosInput = document.getElementById('Apellidos').value.trim();
        const correoInput = document.getElementById('Correo').value.trim();
        const telefonoInput = document.getElementById('Telefono').value.trim();
        const documentoInput = document.getElementById('Documento').value.trim();
        const fechaInput = document.getElementById('FechaDeNacimiento').value;
        const direccionInput = document.getElementById('Direccion').value.trim();
        const generoInput = document.getElementById('Genero').value.trim();
        const pwNueva = document.getElementById('pw-nueva').value.trim();
        const pwConfirma = document.getElementById('pw-confirma').value.trim();

        // Validación básica de contraseña (opcional)
        if (pwNueva && pwNueva !== pwConfirma) {
            console.error('Las contraseñas no coinciden');
            return;
        }

        // Construir objeto formData con datos válidos
        const formData = {
            Nombres: nombresInput,
            Apellidos: apellidosInput,
            Correo: correoInput,
            Telefono: telefonoInput ? parseInt(telefonoInput, 10) : null,
            Documento: documentoInput ? parseInt(documentoInput, 10) : null,
            TipoDocumento: usuarioActual.TipoDocumento,
            FechaDeNacimiento: fechaInput,
            Direccion: direccionInput,
            Genero: generoInput,
            Estado: usuarioActual.Estado,
        };

        // Incluir contraseña solo si se está cambiando y no está vacía
        if (pwNueva !== '') {
            formData.Contrasena = pwNueva;
            formData.ContrasenaConfirmacion = pwConfirma;
        }

        // Realizar la actualización de los datos del usuario si hay cambios
        const updateResponse = await fetch(`http://localhost:3000/api/usuarios/${usuarioActual.IdUsuario}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-token': token
            },
            body: JSON.stringify(formData)
        });

        if (!updateResponse.ok) {
            const errorMessage = await updateResponse.json();
            if (errorMessage.message && errorMessage.message.includes('teléfono')) {
                throw new Error('El teléfono ingresado ya está en uso por otro usuario.');
            } else {
                throw new Error(errorMessage.message || 'Error al actualizar usuario');
            }
        }

        const data = await updateResponse.json();
        console.log('Usuario actualizado correctamente:', data);

        // Mostrar alerta de éxito con SweetAlert
        await swal.fire({
            icon: 'success',
            title: '¡Actualización Exitosa!',
            text: 'Los datos del usuario se han actualizado correctamente.',
        });

    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        // Mostrar alerta de error con SweetAlert
        await swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message || 'Error al actualizar usuario',
        });
    }
}

// Event listener para el formulario de edición
document.addEventListener('DOMContentLoaded', function() {
    const formUsuario = document.getElementById('formularioUsuario');
    if (formUsuario) {
        formUsuario.addEventListener('submit', function(event) {
            actualizarDatos(event); // Llamar a actualizarDatos con el evento
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const togglePassword = document.getElementById('togglePassword');
    const passwordField = document.getElementById('pw-nueva');

    togglePassword.addEventListener('click', function() {
        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);
        this.querySelector('i').classList.toggle('fa-eye');
        this.querySelector('i').classList.toggle('fa-eye-slash');
    });
});

