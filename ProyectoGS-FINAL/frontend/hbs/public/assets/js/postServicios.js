document.addEventListener('DOMContentLoaded', () => {
    const url = 'http://localhost:3000/Api/Servicios';

    // Realizar la solicitud GET utilizando fetch
    fetch(url)
        .then(response => {
            console.log('Respuesta del servidor:', response); // Añadir logging para ver la respuesta
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json(); // Parsear la respuesta a JSON
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
                            <div class="d-flex justify-content-start">
                                <a href="detalleServicio?id=${servicio.IdServicio}" class="me-2"><i class="fa-regular fa-eye fa-xl"></i></a>
                                <a href="formServiciosModal?id=${servicio.IdServicio}" class="me-2"><i class="fa-regular fa-pen-to-square fa-xl"></i></a>
                                <a href="#" class="btn-delete" data-id="${servicio.IdServicio}"><i class="fa-regular fa-trash-can fa-xl"></i></a>
                            </div>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });

                // Inicializar DataTable
                $('#dataTable').DataTable({
                    language: {
                        "decimal": "",
                        "emptyTable": "No hay información",
                        "info": "Mostrando _START_ a _END_ de _TOTAL_ Entradas",
                        "infoEmpty": "Mostrando 0 a 0 de 0 Entradas",
                        "infoFiltered": "(Filtrado de _MAX_ total entradas)",
                        "infoPostFix": "",
                        "thousands": ",",
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
                    lengthMenu: [5, 10, 25, 50], // Opciones de selección de registros por página
                    pageLength: 5
                });

                // Manejar el evento de clic en el botón de eliminar
                document.querySelectorAll('.btn-delete').forEach(button => {
                    button.addEventListener('click', (event) => {
                        event.preventDefault();
                        const servicioId = button.getAttribute('data-id');
                        console.log('Eliminar servicio con ID:', servicioId);
                        // Asignar el ID del servicio al formulario de confirmación
                        document.getElementById('eliminarServicioForm').setAttribute('data-id', servicioId);
                        // Mostrar el modal para confirmar la eliminación
                        const modal = new bootstrap.Modal(document.getElementById('eliminarServicioModal'));
                        modal.show();
                    });
                });

            } else {
                console.error('No se encontró el elemento tableBody');
            }
        })
        .catch(error => {
            console.error('Error al obtener los datos:', error);
            alert('Hubo un problema al cargar los datos del servidor. Por favor, inténtalo de nuevo.');
        });

    // Manejar la confirmación de eliminar
    const eliminarServicioForm = document.getElementById('eliminarServicioForm');
    if (eliminarServicioForm) {
        eliminarServicioForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const servicioId = eliminarServicioForm.getAttribute('data-id');
            console.log('Confirmar eliminar servicio con ID:', servicioId);

            // Enviar la solicitud DELETE al servidor
            fetch(`http://localhost:3000/Api/Servicios/${servicioId}`, {
                method: 'DELETE',
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                // Eliminar la fila correspondiente de la tabla
                const rowToDelete = document.querySelector(`.btn-delete[data-id='${servicioId}']`).closest('tr');
                if (rowToDelete) rowToDelete.remove();

                // Cerrar el modal de confirmación
                const modal = document.getElementById('eliminarServicioModal');
                if (modal) {
                    const bsModal = bootstrap.Modal.getInstance(modal);
                    bsModal.hide();
                }
            })
            .catch(error => {
                console.error('Error al eliminar el servicio:', error);
                alert('Hubo un problema al eliminar el servicio. Por favor, inténtalo de nuevo.');
                const modal = document.getElementById('eliminarServicioModal');
                if (modal) {
                    const bsModal = bootstrap.Modal.getInstance(modal);
                    bsModal.hide();
                }
            });
        });
    }
});



const actualizarServicio = async (event) => {
    event.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    const IdServicio = urlParams.get('id');

    const formulario = document.getElementById('FormularioServiciosModal');
    const formData = new FormData(formulario);

    const servicioData = {};
    formData.forEach((value, key) => {
        servicioData[key] = value;
    });

    try {
        // Actualizar servicio
        const response = await fetch(`http://localhost:3000/Api/Servicios/${IdServicio}`, {
            method: 'PUT',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(servicioData)
        });

        if (!response.ok) {
            throw new Error('Error al actualizar el servicio: ' + response.statusText);
        }

        // Mostrar modal de éxito
        const successModal = document.getElementById('successModal');
        if (successModal) {
            successModal.style.display = 'block';
        }

    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un problema al actualizar el servicio. Por favor, inténtalo de nuevo.');
    }
};

const precargarDatosServicioEnFormulario = async () => {
    // Obtener el ID del servicio de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const servicioId = urlParams.get('id');

    try {
        const response = await fetch(`http://localhost:3000/Api/Servicios/${servicioId}`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }

        const servicio = await response.json();
        console.log('Datos del servicio:', servicio);

        // Llenar el formulario con los datos obtenidos
        document.getElementById('NombreClase').value = servicio.NombreClase;
        document.getElementById('Estado').value = servicio.Estado.toString(); // Asegúrate de convertir a string

    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un problema al cargar los datos del servicio. Por favor, inténtalo de nuevo.');
    }
};

// Llamar a la función cuando la página se cargue


// Event listener para el submit del formulario
const form = document.getElementById('FormularioServicios');
if (form) {
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Evitar el envío por defecto del formulario

        // Obtener los datos del formulario
        const formData = new FormData(form);
        console.log('Datos del formulario:', formData);

        // Convertir FormData a objeto JSON
        const jsonObject = {};
        formData.forEach(function(value, key) {
            jsonObject[key] = value;
        });

        // Convertir el valor de Estado a número
        jsonObject['Estado'] = parseInt(jsonObject['Estado']);
        console.log('Datos en formato JSON:', jsonObject);

        // Enviar los datos a tu API de servicios
        fetch('http://localhost:3000/api/Servicios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonObject)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(error => {
                    throw new Error('Hubo un problema al enviar los datos: ' + JSON.stringify(error));
                });
            }
            return response.json();
        })
        .then(data => {
            // Manejar la respuesta de tu API
            console.log('Respuesta de la API:', data);
            alert('Los datos se han enviado correctamente.');
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Hubo un problema al enviar los datos. Por favor, inténtalo de nuevo.');
        });
    });
}
