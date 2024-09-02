document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formularioUsuarios');
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Evita el envío del formulario por defecto

        // Obtener los datos del formulario
        const formData = new FormData(form);

        // Convertir FormData a objeto JSON
        const jsonObject = {};
        formData.forEach(function(value, key) {
            jsonObject[key] = value.trim(); // Eliminar espacios en blanco
        });

        // Mostrar los datos del formulario en la consola para depuración
        console.log('Datos del formulario:', jsonObject);

        // Validar si todos los campos están llenos
        if (!jsonObject.Documento || !jsonObject.TipoDocumento || !jsonObject.Nombres || !jsonObject.Apellidos ||
            !jsonObject.Correo || !jsonObject.Telefono || !jsonObject.FechaDeNacimiento || !jsonObject.Direccion ||
            !jsonObject.Genero || !jsonObject.Contrasena || !jsonObject.Rol) {
            Swal.fire({
                icon: 'warning',
                title: 'Error',
                text: 'Llene todos los campos',
                confirmButtonText: 'Aceptar'
            });
            return;
        }

        // Validación de la edad
        const fechaNacimiento = new Date(jsonObject.FechaDeNacimiento);
        const edadMinima = 18;
        const hoy = new Date();
        let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
        const mes = hoy.getMonth() - fechaNacimiento.getMonth();
        
        if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
            edad--;
        }
        
        if (edad < edadMinima) {
            Swal.fire({
                icon: 'error',
                title: 'Edad inválida',
                text: 'El usuario debe ser mayor de edad para registrarse.',
                confirmButtonText: 'Aceptar'
            });
            return;
        }

        // Confirmar envío
        Swal.fire({
            title: 'Confirmación',
            text: "¿Estás seguro de que quieres guardar este usuario?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, guardar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
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
                    Estado: 1, // Asegúrate de que el estado siempre sea activo
                    Beneficiario: jsonObject.Beneficiario || null
                };

                console.log('Datos del usuario a enviar:', JSON.stringify(usuario)); // Verificar los datos a enviar

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
                    console.log('Usuario creado:', data);

                    // Asignar el rol al usuario recién creado
                    const usuarioRol = {
                        IdRol: jsonObject.Rol
                    };

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
                        // Redirigir a la página usuariosAdmin
                        window.location.href = '/usuariosAdmin';
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
            }
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
                if (rol.IdRol!=4) {
                    
               
                const option = document.createElement('option');
                option.value = rol.IdRol; // Ajusta esto según el campo que contiene el ID del rol
                option.textContent = rol.NombreRol; // Ajusta esto según el campo que contiene el nombre del rol
                rolesSelect.appendChild(option); }
                
                
            });
        })
        .catch(error => {
            console.error('Error al cargar roles:', error);
        });
}

const actualizarUsuario = async () => {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const usuarioId = urlParams.get('id');

        const formulario = document.getElementById('formularioUsuariosEditar');
        const formData = new FormData(formulario);

        const usuarioData = {};
        formData.forEach((value, key) => {
            usuarioData[key] = value;
        });

        const requiredFields = ['Nombres', 'Apellidos', 'Correo', 'Telefono', 'TipoDocumento', 'Documento', 'Direccion', 'Genero', 'Estado'];
        for (const field of requiredFields) {
            if (!usuarioData[field]) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Error',
                    text: `Llene el campo ${field}`,
                    confirmButtonText: 'Aceptar'
                });
                return;
            }
        }

        const response = await fetch(`http://localhost:3000/api/Usuarios/${usuarioId}`, {
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

        if (usuarioData.Rol) {  // Usar 'Rol' en lugar de 'IdRol'
            const responseRol = await fetch(`http://localhost:3000/api/usuariosRol/${usuarioId}`, {
                method: 'PUT',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ IdRol: usuarioData.Rol })  // Asegúrate de enviar el campo correcto
            });

            if (!responseRol.ok) {
                throw new Error('Error al actualizar el rol del usuario: ' + responseRol.statusText);
            }
        }
        Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Usuario actualizado con éxito',
            confirmButtonText: 'Aceptar'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = '../usuariosAdmin';
            }
        });

    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al actualizar el usuario y/o su rol. Por favor, inténtalo de nuevo.',
            confirmButtonText: 'Aceptar'
        });
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

        })
        .catch(error => console.error('Error al obtener los detalles del usuario:', error));
}
// Llamar a la función cuando la página se cargue
window.addEventListener('DOMContentLoaded', obtenerDetallesUsuario);


// Event listener para el submit del formulario
const precargarDatosUsuarioEnFormulario = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const usuarioId = urlParams.get('id');

    if (!usuarioId) {
        console.error('ID de usuario no proporcionado en la URL');
        return;
    }

    try {
        // Obtener los datos del usuario
        const responseUsuario = await fetch(`http://localhost:3000/Api/Usuarios/${usuarioId}`, {
            method: 'GET',
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
        document.getElementById('IdUser').value = usuarioId;
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

        // Obtener el rol actual del usuario
        const responseUsuarioRoles = await fetch(`http://localhost:3000/api/usuariosRol/${usuarioId}/roles`, {
            method: 'GET',
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


