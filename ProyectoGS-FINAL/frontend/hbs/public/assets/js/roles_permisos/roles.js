// Espera a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", async () => {
    listarRoles(); // Llama a la función para listar roles
});

// Función para listar roles
async function listarRoles() {
    try {
        // Realiza la solicitud al backend para obtener los roles
        const response = await fetch('http://localhost:3000/api/rolesDos');
        const roles = await response.json();

        // Selecciona el cuerpo de la tabla donde se van a insertar los roles
        const contenidoRoles = document.getElementById('contenidoRoles');
        contenidoRoles.innerHTML = ''; // Limpia el contenido previo

        // Itera sobre cada rol y crea una fila en la tabla
        roles.forEach(rol => {
            const row = document.createElement('tr');

            // Columna del nombre del rol
            const nombreCell = document.createElement('td');
            nombreCell.textContent = rol.NombreRol;
            row.appendChild(nombreCell);

            // Columna del estado del rol
            const estadoCell = document.createElement('td');
            estadoCell.textContent = rol.EstadoRol === 1 ? 'Activo' : 'Inactivo';
            row.appendChild(estadoCell);

            // Columna de acciones
            const accionesCell = document.createElement('td');
            accionesCell.style.textAlign = 'center'; // Centra el contenido

            // Contenedor centrado para los iconos
            const iconContainer = document.createElement('div');
            iconContainer.classList.add('centered-container');

            // Icono de edición
            const editIcon = document.createElement('i');
            editIcon.classList.add('fa-regular', 'fa-pen-to-square', 'fa-xl', 'me-2');
            editIcon.style.cursor = 'pointer'; // Cambia el cursor al pasar sobre el icono
            editIcon.title = 'Editar'; // Texto que aparecerá al pasar el mouse
            editIcon.addEventListener('click', () => editarRol(rol.IdRol));

            // Icono de asignación de permisos
            const permissionIcon = document.createElement('i');
            permissionIcon.classList.add('fa-solid', 'fa-user-lock', 'fa-xl', 'me-2');
            permissionIcon.style.cursor = 'pointer'; // Cambia el cursor al pasar sobre el icono
            permissionIcon.title = 'Asignar Roles'; // Texto que aparecerá al pasar el mouse
            permissionIcon.addEventListener('click', () => {
                // Redirige a /asignarPermisos con el rolId como parámetro
                window.location.href = `/asignarPermisos?rolId=${rol.IdRol}`;
            });

            // Añadir los iconos al contenedor centrado
            iconContainer.appendChild(editIcon);
            iconContainer.appendChild(permissionIcon);

            // Añadir el contenedor al celda de acciones
            accionesCell.appendChild(iconContainer);
            row.appendChild(accionesCell);

            // Añade la fila al cuerpo de la tabla
            contenidoRoles.appendChild(row);
        });

    } catch (error) {
        console.error('Error al cargar los roles:', error);
    }
}

// Variables globales para almacenar el ID del rol que se está editando
let rolIdParaEditar = null;

// Función para abrir el modal de edición
function editarRol(idRol) {
    // Guarda el ID del rol que se está editando
    rolIdParaEditar = idRol;

    // Obtén los datos del rol seleccionado
    fetch(`http://localhost:3000/api/rolesDos/${idRol}`)
        .then(response => response.json())
        .then(rol => {
            // Rellena el formulario del modal con los datos del rol
            document.getElementById('nombreRolModal').value = rol.NombreRol;
            document.getElementById('estadoRolModal').value = rol.EstadoRol;

            // Cambia el título del modal
            document.getElementById('crearRolModalLabel').textContent = 'Editar Rol';

            // Muestra el modal
            const modal = new bootstrap.Modal(document.getElementById('crearRolModal'));
            modal.show();
        })
        .catch(error => {
            console.error('Error al obtener los datos del rol:', error);
        });
}

// Maneja la creación y edición de un rol desde el modal
document.getElementById('FormularioRolModal').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombreRol = document.getElementById('nombreRolModal').value;
    const estadoRol = parseInt(document.getElementById('estadoRolModal').value);

    try {
        if (rolIdParaEditar) {
            // Actualiza un rol existente
            const response = await fetch(`http://localhost:3000/api/rolesDos/${rolIdParaEditar}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ NombreRol: nombreRol, EstadoRol: estadoRol })
            });

            if (response.ok) {
                // Cierra el modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('crearRolModal'));
                modal.hide();

                // Limpia el formulario y el ID del rol que se estaba editando
                document.getElementById('FormularioRolModal').reset();
                rolIdParaEditar = null;

                // Recarga la lista de roles
                listarRoles();

                // Mostrar notificación de éxito
                Swal.fire('Éxito', 'El rol ha sido actualizado con éxito.', 'success');
            } else {
                // Mostrar mensaje de error
                Swal.fire('Error', 'No se pudo actualizar el rol. Inténtalo nuevamente.', 'error');
            }
        } else {
            // Crea un nuevo rol
            const response = await fetch('http://localhost:3000/api/rolesDos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ NombreRol: nombreRol, EstadoRol: estadoRol })
            });

            if (response.ok) {
                // Cierra el modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('crearRolModal'));
                modal.hide();

                // Limpia el formulario
                document.getElementById('FormularioRolModal').reset();

                // Recarga la lista de roles
                listarRoles();

                // Mostrar notificación de éxito
                Swal.fire('Éxito', 'El rol ha sido creado con éxito.', 'success');
            } else {
                // Mostrar mensaje de error
                Swal.fire('Error', 'No se pudo crear el rol. Inténtalo nuevamente.', 'error');
            }
        }
    } catch (error) {
        console.error('Error al enviar los datos del rol:', error);
        Swal.fire('Error', 'Ocurrió un error al guardar el rol.', 'error');
    }
});
