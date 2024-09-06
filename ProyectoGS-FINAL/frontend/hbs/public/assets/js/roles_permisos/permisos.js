document.addEventListener("DOMContentLoaded", async () => {
    const rolId = getRolIdFromURL(); // Obtén el ID del rol desde la URL
    if (rolId) {
        await listarPermisos(rolId); // Llama a la función para listar permisos
    } else {
        console.error('ID del rol no encontrado en la URL.');
    }
});

// Obtén el ID del rol desde la URL
function getRolIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('rolId');
}

// Función para listar permisos
async function listarPermisos(rolId) {
    try {
        // Realiza la solicitud al backend para obtener los permisos
        const responsePermisos = await fetch('http://localhost:3000/api/permisosDos');
        const permisos = await responsePermisos.json();

        // Selecciona el cuerpo de la tabla donde se van a insertar los permisos
        const contenidoPermisos = document.getElementById('contenidoPermisos');
        contenidoPermisos.innerHTML = ''; // Limpia el contenido previo

        // Itera sobre cada permiso y crea una fila en la tabla
        permisos.forEach(permiso => {
            const row = document.createElement('tr');

            // Columna del nombre del permiso
            const nombreCell = document.createElement('td');
            nombreCell.textContent = permiso.NombrePermiso;
            row.appendChild(nombreCell);

            // Columnas de los checkboxes para CRUD
            ['Crear', 'Editar', 'Visualizar', 'VistaAdmin'].forEach(accion => {
                const cell = document.createElement('td');
                cell.classList.add('text-center');

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.classList.add('form-check-input');
                checkbox.dataset.permisoId = permiso.IdPermiso; // Asegúrate de que el ID del permiso está asignado
                checkbox.dataset.accion = accion;
                cell.appendChild(checkbox);

                row.appendChild(cell);
            });

            // Añade la fila al cuerpo de la tabla
            contenidoPermisos.appendChild(row);
        });

        // Cargar los permisos asignados al rol
        await cargarPermisosAsignados(rolId);

        // Obtener el nombre del rol y actualizar el título
        const rolNombre = await obtenerNombreRol(rolId);
        document.getElementById('tituloPermisos').textContent = `Permisos para Rol ${rolNombre}`;

    } catch (error) {
        console.error('Error al cargar los permisos:', error);
    }
}

// Función para obtener el nombre del rol
async function obtenerNombreRol(rolId) {
    try {
        const response = await fetch(`http://localhost:3000/api/roles/${rolId}`);
        const rol = await response.json();
        return rol.NombreRol; // Suponiendo que el nombre del rol está en la propiedad `NombreRol`
    } catch (error) {
        console.error('Error al obtener el nombre del rol:', error);
        return 'Desconocido'; // Valor por defecto en caso de error
    }
}


// Función para cargar los permisos asignados a un rol
async function cargarPermisosAsignados(rolId) {
    try {
        const response = await fetch(`http://localhost:3000/api/permisoRolesDetalle/rol?rolId=${rolId}`);
        const permisosAsignados = await response.json();

        permisosAsignados.forEach(({ IdPermiso, Crear, Editar, Visualizar, VistaAdmin }) => {
            document.querySelectorAll(`input[data-permiso-id="${IdPermiso}"]`).forEach(checkbox => {
                if (checkbox.dataset.accion === 'Crear') checkbox.checked = Crear === 1;
                if (checkbox.dataset.accion === 'Editar') checkbox.checked = Editar === 1;
                if (checkbox.dataset.accion === 'Visualizar') checkbox.checked = Visualizar === 1;
                if (checkbox.dataset.accion === 'VistaAdmin') checkbox.checked = VistaAdmin === 1;
            });
        });
    } catch (error) {
        console.error('Error al cargar los permisos asignados:', error);
    }
}

// Maneja el guardado de permisos desde la tabla
document.getElementById('guardarPermisosBtn').addEventListener('click', async () => {
    const rolId = getRolIdFromURL();
    const permisos = [];

    // Recorre cada fila de la tabla
    document.querySelectorAll('#contenidoPermisos tr').forEach(row => {
        const permisoId = row.querySelector('input[data-permiso-id]').dataset.permisoId;

        const permiso = {
            IdPermiso: permisoId,
            Crear: row.querySelector('input[data-accion="Crear"]').checked ? 1 : 0,
            Editar: row.querySelector('input[data-accion="Editar"]').checked ? 1 : 0,
            Visualizar: row.querySelector('input[data-accion="Visualizar"]').checked ? 1 : 0,
            VistaAdmin: row.querySelector('input[data-accion="VistaAdmin"]').checked ? 1 : 0
        };

        permisos.push(permiso);
    });

    // Envío de los datos al backend
    try {
        const response = await fetch('http://localhost:3000/api/permisoRolesDetalle', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ rolId, permisos })
        });
    
        if (response.ok) {
            Swal.fire({
                title: 'Éxito',
                text: 'Permisos asignados correctamente.',
                icon: 'success',
                timer: 1000, // La alerta se cerrará automáticamente después de 2 segundos
                timerProgressBar: true,
                didClose: () => {
                    location.reload(); // Recargar la página después de que la alerta se haya cerrado
                }
            });
        } else {
            Swal.fire('Error', 'No se pudieron asignar los permisos. Inténtalo nuevamente.', 'error');
        }
    } catch (error) {
        console.error('Error al guardar los permisos:', error);
        Swal.fire('Error', 'Ocurrió un error al guardar los permisos.', 'error');
    }
    
});
