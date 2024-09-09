document.addEventListener('DOMContentLoaded', () => {
    const url = 'http://localhost:3000/Api/Servicios';
    let dataTableInstance = null;
    const crearServicioModal = new bootstrap.Modal(document.getElementById('crearServicioModal')); // Almacenar la instancia
    const editarServicioModal = new bootstrap.Modal(document.getElementById('editarServicioModal')); // Almacenar la instancia para el modal de edición

    // Function to initialize/reinitialize DataTable
    const initDataTable = () => {
        if (dataTableInstance) {
            dataTableInstance.destroy();
        }
        dataTableInstance = $('#dataTable').DataTable({
            language: {
                "decimal": "",
                "emptyTable": "No hay información",
                "info": "Mostrando _START_ a _END_ de _TOTAL_ Entradas",
                "infoEmpty": "Mostrando 0 a 0 de 0 Entradas",
                "infoFiltered": "(Filtrado de _MAX_ total entradas)",
                "lengthMenu": "Mostrar _MENU_ Entradas",
                "loadingRecords": "Cargando...",
                "processing": "Procesando...",
                "search": "Buscar:",
                "zeroRecords": "Sin resultados encontrados",
                "paginate": {
                    "first": "Primero",
                    "last": "Último",
                    "next": "Siguiente",
                    "previous": "Anterior"
                }
            },
            lengthMenu: [5, 10, 25, 50],
            pageLength: 5
        });
    };

    // Function to fetch and display service data
    const actualizarTabla = () => {
        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                return response.json();
            })
            .then(data => {
                const tableBody = document.getElementById('dataTableBody');
                if (tableBody) {
                    tableBody.innerHTML = '';
                    data.forEach(servicio => {
                        const estado = servicio.Estado === 1 ? 'Activo' : 'Inactivo';
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${servicio.NombreClase}</td>
                            <td>${estado}</td>
                            <td>
                                <div class="d-flex justify-content-center">
    <a href="#" class="btn-view me-2" data-id="${servicio.IdServicio}"><i class="fa-regular fa-eye fa-xl"></i></a>
    <a href="#" class="btn-edit me-2" data-id="${servicio.IdServicio}"><i class="fa-regular fa-pen-to-square fa-xl"></i></a>
</div>

                            </td>
                        `;
                        tableBody.appendChild(row);
                    });

                    initDataTable();  // Initialize DataTable
                    handleButtonEvents(); // Attach event handlers to buttons
                }
            })
            .catch(error => {
                console.error('Error al obtener los datos:', error);
                Swal.fire('Error', 'Hubo un problema al cargar los datos del servidor. Por favor, inténtalo de nuevo.', 'error');
            });
    };

    // Fetch and display data on page load
    actualizarTabla();

    // Event handlers for edit and view buttons
    const handleButtonEvents = () => {
        document.querySelectorAll('.btn-edit').forEach(button => {
            button.addEventListener('click', async event => {
                event.preventDefault();
                const servicioId = button.getAttribute('data-id');
                const servicio = await verificarServicioExistentePorId(servicioId);
                if (!servicio) {
                    Swal.fire('Error', 'El servicio no existe. No se puede editar.', 'error');
                    return;
                }
                precargarDatosServicioEnFormulario(servicio);
                editarServicioModal.show(); // Mostrar el modal de edición
            });
        });

        document.querySelectorAll('.btn-view').forEach(button => {
            button.addEventListener('click', event => {
                event.preventDefault();
                const servicioId = button.getAttribute('data-id');
                precargarDatosServicioEnDetalle(servicioId);
                new bootstrap.Modal(document.getElementById('verDetalleServicio')).show();
            });
        });
    };

    // Fetch service by ID
    const verificarServicioExistentePorId = async (servicioId) => {
        try {
            const response = await fetch(`${url}/${servicioId}`);
            if (!response.ok) throw new Error('Error en la solicitud: ' + response.statusText);
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            Swal.fire('Error', 'Hubo un problema al verificar el servicio. Por favor, inténtalo de nuevo.', 'error');
            return null;
        }
    };

    // Preload service data into edit form
    const precargarDatosServicioEnFormulario = async (servicio) => {
        try {
            document.getElementById('editNombreClase').value = servicio.NombreClase;
            document.getElementById('editEstado').value = servicio.Estado.toString();
            document.getElementById('editServicioId').value = servicio.IdServicio;
        } catch (error) {
            console.error('Error:', error);
            Swal.fire('Error', 'Hubo un problema al cargar los datos del servicio. Por favor, inténtalo de nuevo.', 'error');
        }
    };

    // Preload service data into view detail modal
    const precargarDatosServicioEnDetalle = async (servicioId) => {
        try {
            const servicio = await verificarServicioExistentePorId(servicioId);
            if (!servicio) {
                Swal.fire('Error', 'El servicio no existe. No se pueden mostrar los detalles.', 'error');
                return;
            }
            document.getElementById('detalleServicioNombre').textContent = `Nombre Clase: ${servicio.NombreClase}`;
            document.getElementById('detalleServicioEstado').textContent = `Estado: ${servicio.Estado === 1 ? 'Activo' : 'Inactivo'}`;
        } catch (error) {
            console.error('Error:', error);
            Swal.fire('Error', 'Hubo un problema al cargar los datos del servicio. Por favor, inténtalo de nuevo.', 'error');
        }
    };

    // Handle service editing
    const editarServicioForm = document.getElementById('editarServicioForm');
    if (editarServicioForm) {
        editarServicioForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const servicioId = document.getElementById('editServicioId').value;
            const formData = new FormData(editarServicioForm);
            const servicioData = {};
            formData.forEach((value, key) => { servicioData[key] = value; });

            try {
                const response = await fetch(`${url}/${servicioId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(servicioData)
                });

                if (!response.ok) throw new Error('Error al actualizar el servicio: ' + response.statusText);

                Swal.fire('Actualizado!', 'El servicio ha sido actualizado.', 'success');
                editarServicioModal.hide(); // Cerrar el modal de edición
                actualizarTabla(); // Refresh table after edit
            } catch (error) {
                console.error('Error:', error);
                Swal.fire('Error', 'El servicio ya existe. Por favor, elige un nombre diferente.', 'error');
            }
        });
    }

    // Handle service creation
    const form = document.getElementById('FormularioServicios');
    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
    
            const formData = new FormData(form);
            const jsonObject = {};
            formData.forEach((value, key) => { jsonObject[key] = value; });
            
            // Forzar el valor del Estado a 1 (Activo) al crear el servicio
            jsonObject['Estado'] = 1;
    
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(jsonObject)
                });
    
                if (!response.ok) throw new Error('Error al enviar los datos: ' + response.statusText);
    
                Swal.fire('Éxito', 'El servicio ha sido creado correctamente.', 'success');
                form.reset();
                actualizarTabla(); // Actualizar la tabla después de crear el servicio
                crearServicioModal.hide(); // Cerrar el modal de creación
            } catch (error) {
                console.error('Error:', error);
                Swal.fire('Error', 'Hubo un problema al crear el servicio. Por favor, inténtalo de nuevo.', 'error');
            }
        });
    }
    
});
