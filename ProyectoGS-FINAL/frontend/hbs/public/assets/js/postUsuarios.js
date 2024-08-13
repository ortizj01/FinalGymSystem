document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formularioUsuarios');
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Evita el envío del formulario por defecto

        // Obtener los datos del formulario
        const formData = new FormData(form);

        // Convertir FormData a objeto JSON
        const jsonObject = {};
        formData.forEach(function(value, key) {
            jsonObject[key] = value;
        });

        // Estructura de los datos para la API
        const usuario = {
            Documento: jsonObject.Documento,
            TipoDocumento: jsonObject.TipoDocumento,
            Nombres: jsonObject.Nombres,
            Apellidos: jsonObject.Apellidos,
            Correo: jsonObject.Correo,
            Telefono: jsonObject.Telefono,
            FechaDeNacimiento: jsonObject.FechaDeNacimiento,
            Direccion: jsonObject.Direccion,
            Genero: jsonObject.Genero,
            Contrasena: jsonObject.Contrasena,
            Estado: parseInt(jsonObject.Estado), // Convertir Estado a número
            Beneficiario: jsonObject.Beneficiario
        };

        // Enviar los datos a tu API para crear el usuario
        fetch('http://localhost:3000/api/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuario)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(error => {
                    throw new Error(error.message || 'Hubo un problema al enviar los datos.');
                });
            }
            return response.json();
        })
        .then(data => {
            // Aquí puedes manejar la respuesta de tu API
            console.log('Usuario creado:', data);

            // Ahora asignamos el rol al usuario recién creado
            const usuarioRol = {
                IdRol: jsonObject.Rol // Asumiendo que jsonObject.Rol contiene el Id del rol seleccionado
            };

            // Hacer la solicitud POST para asignar el rol al usuario
            return fetch(`http://localhost:3000/api/usuariosRol/${data.IdUsuario}/roles`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(usuarioRol)
            });
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(error => {
                    throw new Error(error.message || 'Hubo un problema al asignar el rol.');
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Rol asignado:', data);
            Swal.fire({
                title: "¡Excelente!",
                text: "Usuario y rol registrados correctamente!",
                icon: "success"
            }).then(() => {
                location.reload();
            });
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                icon: "error",
                title: "¡Oops...",
                text: "Ocurrió un error: " + error.message
            });
        });
    });
});

function fetchRoles() {
    fetch('http://localhost:3000/api/roles')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const rolesSelect = document.getElementById('rolesSelect');
            data.forEach(rol => {
                const option = document.createElement('option');
                option.value = rol.IdRol; // Ajusta esto según el campo que contiene el ID del rol
                option.textContent = rol.NombreRol; // Ajusta esto según el campo que contiene el nombre del rol
                rolesSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error al cargar roles:', error);
        });
}

const actualizarUsuario = async (event) => {
    event.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    const usuarioId = urlParams.get('id');
    const rolUsuarioId = urlParams.get('IdRolUsuario'); // Asegúrate de tener IdRolUsuario si está en la URL.

    const formulario = document.getElementById('formularioUsuariosEditar');
    const formData = new FormData(formulario);

    const usuarioData = {};
    formData.forEach((value, key) => {
        usuarioData[key] = value;
    });

    try {
        // Actualizar usuario
        const response = await fetch(`http://localhost:3000/Api/Usuarios/${usuarioId}`, {
            method: 'PUT',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuarioData)
        });

        if (!response.ok) {
            throw new Error('Error al actualizar el usuario: ' + response.statusText);
        }

        // Si hay un rol en los datos del usuario, actualizar el rol también
        if (usuarioData.IdRol && rolUsuarioId) {
            const responseRol = await fetch(`http://localhost:3000/api/usuariosRol/${usuarioId}/roles/${rolUsuarioId}`, {
                method: 'PUT',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ IdRol: usuarioData.IdRol })
            });

            if (!responseRol.ok) {
                throw new Error('Error al actualizar el rol del usuario: ' + responseRol.statusText);
            }
        }

        // Mostrar modal de éxito
        const successModal = document.getElementById('successModal');
        successModal.style.display = 'block';

    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un problema al actualizar el usuario y/o su rol. Por favor, inténtalo de nuevo.');
    }
};



function obtenerDetallesUsuario() {
    // Obtener el ID del usuario de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');
    console.log('User ID:', userId); // Para depuración

    if (!userId) {
        console.error('No se encontró el ID del usuario en la URL.');
        return;
    }

    // Hacer una solicitud GET para obtener los detalles del usuario
    fetch(`http://localhost:3000/api/Usuarios/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la solicitud: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Datos del usuario:', data); // Para depuración
            // Rellenar los campos de la tabla con los datos del usuario
            document.getElementById('nombre').innerText = data.Nombres || '-';
            document.getElementById('apellidos').innerText = data.Apellidos || '-';
            document.getElementById('email').innerText = data.Correo || '-';
            document.getElementById('telefono').innerText = data.Telefono || '-';
            document.getElementById('tipoDocumento').innerText = data.TipoDocumento || '-';
            document.getElementById('documento').innerText = data.Documento || '-';
            document.getElementById('fechaNacimiento').innerText = new Date(data.FechaDeNacimiento).toLocaleDateString() || '-';
            document.getElementById('direccion').innerText = data.Direccion || '-';
            document.getElementById('genero').innerText = data.Genero || '-';
            document.getElementById('estado').innerText = data.Estado ? 'Activo' : 'Inactivo';
            document.getElementById('beneficiario').innerText = data.Beneficiario || '-';

        })
        .catch(error => console.error('Error al obtener los detalles del usuario:', error));
}
// Llamar a la función cuando la página se cargue
window.addEventListener('DOMContentLoaded', obtenerDetallesUsuario);
// Event listener para el submit del formulario
const precargarDatosUsuarioEnFormulario = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const usuarioId = urlParams.get('id');

    try {
        // Obtener los datos del usuario
        const responseUsuario = await fetch(`http://localhost:3000/Api/Usuarios/${usuarioId}`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });

        if (!responseUsuario.ok) {
            throw new Error('Error en la solicitud: ' + responseUsuario.statusText);
        }

        const usuario = await responseUsuario.json();
        console.log('Datos del Usuario:', usuario);

        // Formatear la fecha de nacimiento
        const fechaNacimiento = usuario.FechaDeNacimiento.split('T')[0];

        // Precargar datos del usuario en el formulario
        document.getElementById('Nombre').value = usuario.Nombres;
        document.getElementById('Apellidos').value = usuario.Apellidos;
        document.getElementById('E-mail').value = usuario.Correo;
        document.getElementById('Teléfono').value = usuario.Telefono;
        document.getElementById('TipoDocumento').value = usuario.TipoDocumento;
        document.getElementById('Documento').value = usuario.Documento;
        document.getElementById('FechaDeNacimiento').value = fechaNacimiento;
        document.getElementById('Direccion').value = usuario.Direccion;
        document.getElementById('Genero').value = usuario.Genero;
        document.getElementById('Estado').value = usuario.Estado;
        document.getElementById('Beneficiario').value = usuario.Beneficiario;

        // Obtener el rol actual del usuario
        const responseUsuarioRoles = await fetch(`http://localhost:3000/api/usuariosRol/${usuarioId}/roles`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });

        if (!responseUsuarioRoles.ok) {
            throw new Error('Error en la solicitud: ' + responseUsuarioRoles.statusText);
        }

        const usuarioRolesData = await responseUsuarioRoles.json();
        console.log('Roles del Usuario:', usuarioRolesData);

        // Obtener el ID del rol actual del usuario (suponiendo que es un array y queremos el primero)
        const rolActual = usuarioRolesData.length > 0 ? usuarioRolesData[0].IdRol : null;
        console.log('Rol actual del usuario:', rolActual);

        // Obtener todos los roles disponibles
        const responseTodosRoles = await fetch(`http://localhost:3000/api/roles`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });

        if (!responseTodosRoles.ok) {
            throw new Error('Error en la solicitud: ' + responseTodosRoles.statusText);
        }

        const todosRolesData = await responseTodosRoles.json();
        console.log('Todos los Roles:', todosRolesData);

        // Precargar todos los roles en el select del formulario
        const rolSelect = document.getElementById('Rol');
        todosRolesData.forEach(role => {
            const option = document.createElement('option');
            option.value = role.IdRol;
            option.text = role.NombreRol;
            rolSelect.add(option);
        });

        // Preseleccionar el rol actual del usuario en el select después de añadir todas las opciones
        if (rolActual) {
            // Preselecciona el rol actual después de que se hayan añadido todas las opciones
            setTimeout(() => {
                rolSelect.value = rolActual;
                console.log('Rol preseleccionado:', rolSelect.value);
            }, 100); // Ajusta el tiempo según sea necesario para asegurar que las opciones estén cargadas
        }

    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un problema al cargar los datos del Usuario. Por favor, inténtalo de nuevo.');
    }
};

// Llamar a la función cuando la página se cargue
document.addEventListener('DOMContentLoaded', async () => {
    await precargarDatosUsuarioEnFormulario();
});

const formulario = document.getElementById('formularioUsuariosEditar');
formulario.addEventListener('submit', actualizarUsuario);


