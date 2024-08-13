const url = 'http://localhost:3000/api/roles';
const permisosUrl = 'http://localhost:3000/api/permisos';
const permisosRolesUrl = 'http://localhost:3000/api/permisosRoles';

document.addEventListener('DOMContentLoaded', () => {
    cargarRoles();
    cargarPermisosCrear();

    const formularioRolModal = document.getElementById('FormularioRolModal');
    if (formularioRolModal) {
        formularioRolModal.addEventListener('submit', async (event) => {
            event.preventDefault();
            const nombreRol = document.getElementById('nombreRolModal').value;
            const estadoRol = document.getElementById('estadoModal').value;
            const permisosSeleccionados = Array.from(document.querySelectorAll('#permisosContainerCrear input[type="checkbox"]:checked')).map(checkbox => checkbox.value);

            const rol = {
                NombreRol: nombreRol,
                EstadoRol: parseInt(estadoRol),
                Permisos: permisosSeleccionados
            };

            await crearRol(rol);
            cargarRoles();
            $('#crearRolModal').modal('hide');
        });
    }

    const editRolForm = document.getElementById('editRolForm');
    if (editRolForm) {
        editRolForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const nombreRol = document.getElementById('editNombreRol').value;
            const estadoRol = document.getElementById('editEstado').value;
            const rolId = document.getElementById('editIdRol').value;
            const permisosSeleccionados = Array.from(document.querySelectorAll('#permisosContainer input[type="checkbox"]:checked')).map(checkbox => checkbox.value);

            const rol = {
                NombreRol: nombreRol,
                EstadoRol: parseInt(estadoRol)
            };

            await editarRol(rolId, rol);
            await actualizarPermisosRol(rolId, permisosSeleccionados);
            $('#editarRolModal').modal('hide');
            cargarRoles();
        });
    }
});

async function cargarRoles() {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Error en la solicitud: ' + response.statusText);

        const roles = await response.json();
        const contenidoRoles = document.getElementById('contenidoRoles');
        if (contenidoRoles) {
            contenidoRoles.innerHTML = '';
            roles.forEach(rol => {
                contenidoRoles.innerHTML += `
                    <tr>
                        <td>${rol.IdRol}</td>
                        <td>${rol.NombreRol}</td>
                        <td>${rol.EstadoRol === 0 ? 'Activo' : 'Inactivo'}</td>
                        <td>
                            <div class="centered-container">
                                <i class="fa-regular fa-pen-to-square fa-xl me-2" 
                                    data-bs-toggle="modal" 
                                    data-bs-target="#editarRolModal" 
                                    onclick="cargarDatosEditar(${rol.IdRol})">
                                </i>
                                <i class="fa-solid fa-trash fa-xl me-2 trash-icon"
                                    onclick="confirmarEliminarRol(${rol.IdRol})"></i>
                            </div>
                        </td>
                    </tr>`;
            });
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function crearRol(rol) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(rol)
        });
        if (!response.ok) throw new Error('Error en la solicitud: ' + response.statusText);
        Swal.fire('¡Éxito!', 'Rol creado exitosamente.', 'success');
    } catch (error) {
        console.error('Error:', error);
        Swal.fire('Error', 'Hubo un problema al crear el rol.', 'error');
    }
}

async function cargarDatosEditar(id) {
    try {
        const response = await fetch(`${url}/${id}`);
        if (!response.ok) throw new Error('Error en la solicitud: ' + response.statusText);

        const rol = await response.json();
        document.getElementById('editIdRol').value = rol.IdRol;
        document.getElementById('editNombreRol').value = rol.NombreRol;
        document.getElementById('editEstado').value = rol.EstadoRol;

        await cargarPermisos(rol.IdRol);
        $('#editarRolModal').modal('show');
        document.getElementById('editarRolModalLabel').innerText = 'Editar Rol';
    } catch (error) {
        console.error('Error fetching or parsing data:', error);
    }
}

async function editarRol(id, rol) {
    try {
        const response = await fetch(`${url}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(rol)
        });
        if (!response.ok) throw new Error('Error en la solicitud: ' + response.statusText);
        Swal.fire('¡Éxito!', 'Rol actualizado exitosamente.', 'success');
    } catch (error) {
        console.error('Error:', error);
        Swal.fire('Error', 'Hubo un problema al actualizar el rol.', 'error');
    }
}

async function confirmarEliminarRol(id) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: 'No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminarlo!'
    }).then((result) => {
        if (result.isConfirmed) {
            eliminarRol(id);
        }
    });
}

async function eliminarRol(id) {
    try {
        const response = await fetch(`${url}/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Error en la solicitud: ' + response.statusText);
        Swal.fire('Eliminado!', 'El rol ha sido eliminado.', 'success');
        cargarRoles();
    } catch (error) {
        console.error('Error:', error);
        Swal.fire('Error!', 'Hubo un problema al eliminar el rol.', 'error');
    }
}

async function cargarPermisosCrear() {
    try {
        const responsePermisos = await fetch(permisosUrl);
        if (!responsePermisos.ok) throw new Error('Error en la solicitud de permisos: ' + responsePermisos.statusText);

        const permisos = await responsePermisos.json();
        const permisosContainerCrear = document.getElementById('permisosContainerCrear');
        permisosContainerCrear.innerHTML = '';
        permisos.forEach(permiso => {
            permisosContainerCrear.innerHTML += `
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="${permiso.IdPermiso}" id="permiso${permiso.IdPermiso}">
                    <label class="form-check-label" for="permiso${permiso.IdPermiso}">
                        ${permiso.NombrePermiso}
                    </label>
                </div>`;
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

async function cargarPermisos(idRol) {
    try {
        const responsePermisos = await fetch(permisosUrl);
        if (!responsePermisos.ok) throw new Error('Error en la solicitud de permisos: ' + responsePermisos.statusText);

        const permisos = await responsePermisos.json();
        const responsePermisosRol = await fetch(`${permisosRolesUrl}/${idRol}`);
        if (!responsePermisosRol.ok) throw new Error('Error en la solicitud de permisos de rol: ' + responsePermisosRol.statusText);

        const permisosRol = await responsePermisosRol.json();
        const permisosRolIds = permisosRol.map(permiso => permiso.IdPermiso);
        const permisosContainer = document.getElementById('permisosContainer');
        permisosContainer.innerHTML = '';
        permisos.forEach(permiso => {
            permisosContainer.innerHTML += `
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="${permiso.IdPermiso}" id="permiso${permiso.IdPermiso}" ${permisosRolIds.includes(permiso.IdPermiso) ? 'checked' : ''}>
                    <label class="form-check-label" for="permiso${permiso.IdPermiso}">
                        ${permiso.NombrePermiso}
                    </label>
                </div>`;
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

async function actualizarPermisosRol(idRol, permisosSeleccionados) {
    try {
        const responsePermisosRol = await fetch(`${permisosRolesUrl}/${idRol}`);
        if (!responsePermisosRol.ok) throw new Error('Error al obtener permisos actuales: ' + responsePermisosRol.statusText);

        const permisosRol = await responsePermisosRol.json();
        const permisosRolIds = permisosRol.map(permiso => permiso.IdPermiso);

        for (let permisoId of permisosRolIds) {
            if (!permisosSeleccionados.includes(permisoId.toString())) {
                await fetch(`${permisosRolesUrl}/${idRol}/${permisoId}`, {
                    method: 'DELETE'
                });
            }
        }

        for (let idPermiso of permisosSeleccionados) {
            if (!permisosRolIds.includes(parseInt(idPermiso))) {
                await fetch(`${permisosRolesUrl}/${idRol}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ IdPermiso: idPermiso })
                });
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
