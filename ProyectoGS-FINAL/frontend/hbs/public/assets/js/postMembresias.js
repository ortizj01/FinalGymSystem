document.addEventListener('DOMContentLoaded', () => {
    // URL del endpoint de membresías en tu servidor
    const url = 'http://localhost:3000/Api/Membresias';

    // Realizar la solicitud GET utilizando fetch
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json(); // Parsear la respuesta a JSON
        })
        .then(data => {
            // Aquí puedes procesar los datos recibidos y mostrarlos en tu página HTML
            console.log('Datos recibidos:', data);

            // Obtener el cuerpo de la tabla donde se mostrarán las membresías
            const tableBody = document.getElementById('membresiasTableBody');

            // Limpiar el contenido actual de la tabla si es necesario
            tableBody.innerHTML = '';

            // Iterar sobre los datos y crear filas de tabla para cada membresía
            data.forEach(membresia => {
                const estado = membresia.Estado === 1 ? 'Activo' : 'Inactivo';

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${membresia.NombreMembresia}</td>
                    <td>${membresia.Frecuencia}</td>
                    <td>${estado}</td>
                    <td>
                        <div class="d-flex justify-content-start">
                            <a href="detalleMembresia?id=${membresia.IdMembresia}" class="me-2"><i class="fa-regular fa-eye fa-lg"></i></a>
                            <a href="formMembresiasModal?id=${membresia.IdMembresia}" class="me-2"><i class="fa-regular fa-pen-to-square fa-lg"></i></a>
                            <a href="#" class="btn-delete" data-id="${membresia.IdMembresia}"><i class="fa-solid fa-trash fa-lg"></i></a>
                        </div>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            // Inicializar DataTable
            $('#membresiasTable').DataTable({
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

            // Agregar evento al botón de eliminar para mostrar modal de confirmación
            document.querySelectorAll('.btn-delete').forEach(button => {
                button.addEventListener('click', (event) => {
                    event.preventDefault();
                    const membresiaId = button.getAttribute('data-id');
                    console.log('Eliminar membresía con ID:', membresiaId);
                    // Asignar el ID de la membresía al formulario de confirmación
                    document.getElementById('eliminarMembresiaForm').setAttribute('data-id', membresiaId);
                    // Mostrar el modal para confirmar la eliminación
                    const modal = new bootstrap.Modal(document.getElementById('eliminarMembresiaModal'));
                    modal.show();
                });
            });
        })
        .catch(error => {
            console.error('Error al obtener los datos:', error);
        });

    // Manejar la confirmación de eliminar
    const eliminarMembresiaForm = document.getElementById('eliminarMembresiaForm');
    eliminarMembresiaForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const membresiaId = eliminarMembresiaForm.getAttribute('data-id');
        console.log('Confirmar eliminar membresía con ID:', membresiaId);

        // Enviar la solicitud DELETE al servidor
        fetch(`http://localhost:3000/Api/Membresias/${membresiaId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            // Eliminar la fila correspondiente de la tabla
            const rowToDelete = document.querySelector(`.btn-delete[data-id='${membresiaId}']`).closest('tr');
            if (rowToDelete) rowToDelete.remove();

            // Cerrar el modal de confirmación
            const modal = document.getElementById('eliminarMembresiaModal');
            if (modal) {
                const bsModal = bootstrap.Modal.getInstance(modal);
                bsModal.hide();
            }
        })
        .catch(error => {
            console.error('Error al eliminar la membresía:', error);
            alert('Hubo un problema al eliminar la membresía. Por favor, inténtalo de nuevo.');
            const modal = document.getElementById('eliminarMembresiaModal');
            if (modal) {
                const bsModal = bootstrap.Modal.getInstance(modal);
                bsModal.hide();
            }
        });
    });
});
//post membresias
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('FormularioMembresias');
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Evita el envío del formulario por defecto

        // Obtener los datos del formulario
        const formData = new FormData(form);

        // Convertir FormData a objeto JSON
        const jsonObject = {};
        formData.forEach(function(value, key) {
            if (key === 'servicios[]') {
                if (!jsonObject[key]) {
                    jsonObject[key] = [];
                }
                jsonObject[key].push(value);
            } else {
                jsonObject[key] = value;
            }
        });

        const membresia = {
            NombreMembresia: jsonObject.NombreMembresia || '', // Asigna un valor vacío si no está definido
            Frecuencia: jsonObject.Frecuencia ? parseInt(jsonObject.Frecuencia) : null, // Convertir a número entero, asignar null si no está definido
            CostoVenta: jsonObject.Costoventa ? parseFloat(jsonObject.Costoventa) : null, 
            Descripcion: jsonObject.Descripcion || '', // Asigna un valor vacío si no está definido
            Estado: jsonObject.Estado ? parseInt(jsonObject.Estado, 10) : null // Convertir a número entero, asignar null si no está definido
        };

        // Enviar los datos a la API para crear la membresía
        fetch('http://localhost:3000/api/membresias', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(membresia)
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
            console.log('Membresía creada:', data);

            // Obtener el IdMembresia creado
            const IdMembresia = data.IdMembresia;

            // Estructura para los servicios
            const servicios = jsonObject['servicios[]'] || [];

            // Si el arreglo de servicios no está vacío, asignarlos a la membresía
            if (servicios.length > 0) {
                const membresiaServicios = {
                    IdServicios: servicios
                };

                // Mostrar los datos a enviar en la consola
                console.log('Datos de servicios a enviar:', membresiaServicios);

                // Enviar los servicios a la membresía
                return fetch(`http://localhost:3000/api/membresias-servicios/${IdMembresia}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(membresiaServicios)
                });
            }
        })
        .then(response => {
            if (response && !response.ok) {
                return response.json().then(error => {
                    throw new Error(error.message || 'Hubo un problema al asignar los servicios.');
                });
            }
            if (response) {
                return response.json();
            }
        })
        .then(data => {
            if (data) {
                console.log('Servicios asignados a la membresía:', data);
            }
            Swal.fire({
                title: "¡Excelente!",
                text: "Membresía registrada correctamente!",
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




function getMembresiaIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const idMembresia = urlParams.get('id');
    console.log('ID de Membresía desde URL:', idMembresia); // Agrega este log para verificar el ID
    return idMembresia;
}

function cargarDetalleMembresia() {
    const membresiaId = getMembresiaIdFromURL();

    if (!membresiaId) {
        console.error('ID de Membresía no encontrado en la URL');
        return; // No continuar si no hay ID válido
    }

    // Fetch para obtener los detalles de la membresía
    fetch(`http://localhost:3000/api/membresias/${membresiaId}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('NombreMembresia').innerText = data.NombreMembresia;
            document.getElementById('Frecuencia').innerText = data.Frecuencia;
            document.getElementById('CostoVenta').innerText = data.CostoVenta;
            document.getElementById('Descripcion').innerText = data.Descripcion;
            document.getElementById('Estado').innerText = data.Estado ? 'Activo' : 'Inactivo';
        })
        .catch(error => console.error('Error al obtener los datos de la membresía:', error));

    // Fetch para obtener los servicios asociados a la membresía
    fetch(`http://localhost:3000/api/membresias-servicios/${membresiaId}`)
        .then(response => response.json())
        .then(data => {
            const tableServicios = document.getElementById('TableServicios');
            if (!tableServicios) {
                console.error('Elemento TableServicios no encontrado');
                return;
            }
            tableServicios.innerHTML = ""; // Clear existing table rows
            data.forEach(servicio => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${servicio.NombreClase}</td>

                `;
                tableServicios.appendChild(row);
            });
        })
        .catch(error => console.error('Error al obtener los datos de los servicios:', error));
}

document.addEventListener('DOMContentLoaded', cargarDetalleMembresia);


function agregarServicio() {
    var serviciosTable = document.getElementById("serviciosTable");
    var serviciosAgregados = document.getElementById("serviciosAgregados");

    var newRow = document.createElement("tr");
    newRow.className = "servicioRow";

    var servicioCell = document.createElement("td");
    var selectElement = document.createElement("select");
    selectElement.name = "servicios[]";
    selectElement.className = "selectServicio";
    selectElement.style.width = "300px";
    selectElement.innerHTML = document.getElementById("selectServicio").innerHTML;
    selectElement.onchange = function() {
        // Aquí podrías agregar lógica si es necesario
    };
    servicioCell.appendChild(selectElement);

    var accionesCell = document.createElement("td");
    var btnEliminar = document.createElement("button");
    btnEliminar.type = "button";
    btnEliminar.className = "btn btn-soft-danger mt-2";
    btnEliminar.innerHTML = '<i class="fa-solid fa-minus fa-lg"></i>';
    btnEliminar.onclick = function () {
        newRow.remove();
    };
    accionesCell.appendChild(btnEliminar);

    newRow.appendChild(servicioCell);
    newRow.appendChild(accionesCell);

    serviciosAgregados.appendChild(newRow);
}

function fetchServicios() {
    fetch('http://localhost:3000/api/Servicios')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const selectServicio = document.getElementById('selectServicio'); // Cambié el id aquí
            selectServicio.innerHTML = '<option value="" disabled selected hidden>Agregar servicio</option>';

            data.forEach(servicio => {
                const option = document.createElement('option');
                option.value = servicio.IdServicio;
                option.textContent = servicio.NombreClase;
                selectServicio.appendChild(option); // Cambié el id aquí
            });
        })
        .catch(error => {
            console.error('Error al cargar servicios:', error);
        });
}

const precargarDatosMembresiaEnFormulario = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const membresiaId = urlParams.get('id');

    if (!membresiaId) {
        console.error('ID de membresía no proporcionado en la URL');
        return;
    }

    try {
        // Obtener los datos de la membresía
        const responseMembresia = await fetch(`http://localhost:3000/api/membresias/${membresiaId}`);
        if (!responseMembresia.ok) {
            throw new Error('Error en la solicitud de membresía: ' + responseMembresia.statusText);
        }
        const membresia = await responseMembresia.json();
        console.log('Datos de la Membresía:', membresia);

        // Precargar datos de la membresía en el formulario
        document.getElementById('NombreMembresia').value = membresia.NombreMembresia || '';
        document.getElementById('Frecuencia').value = membresia.Frecuencia || '';
        document.getElementById('CostoVenta').value = membresia.CostoVenta || '';
        document.getElementById('Estado').value = membresia.Estado || '';
        document.getElementById('Descripcion').value = membresia.Descripcion || '';

        // Cargar los servicios asociados
        let servicios = [];
        try {
            const responseServicios = await fetch(`http://localhost:3000/api/membresias-servicios/${membresiaId}`);
            if (!responseServicios.ok) {
                if (responseServicios.status === 404) {
                    // Si el recurso no se encuentra, simplemente retorna sin hacer nada
                    console.log('No hay servicios asociados a esta membresía.');
                    return;
                } else {
                    throw new Error('Error en la solicitud de servicios asociados: ' + responseServicios.statusText);
                }
            }
            servicios = await responseServicios.json();
            console.log('Servicios asociados a la membresía:', servicios);
        } catch (error) {
            // Si ocurre un error específico en la carga de servicios, manejarlo aquí
            console.error('Error al cargar servicios asociados:', error);
            // Decide si mostrar un mensaje al usuario o solo ocultar la tabla
            return; // Salir de la función si no se pueden cargar los servicios
        }

        // Cargar todos los servicios disponibles
        const responseServiciosDisponibles = await fetch('http://localhost:3000/api/servicios');
        if (!responseServiciosDisponibles.ok) {
            throw new Error('Error en la solicitud de servicios disponibles: ' + responseServiciosDisponibles.statusText);
        }
        const serviciosDisponibles = await responseServiciosDisponibles.json();
        console.log('Servicios disponibles:', serviciosDisponibles);

        // Obtener la tabla de servicios agregados
        const serviciosTableBody = document.getElementById('serviciosAgregados');
        const serviciosTable = document.getElementById('serviciosTable');

        // Limpiar tabla existente (si es necesario)
        serviciosTableBody.innerHTML = '';

        // Si hay servicios asociados, crear filas para ellos
        if (servicios.length > 0) {
            servicios.forEach(servicio => {
                // Crear una nueva fila para la tabla
                const tr = document.createElement('tr');
                tr.className = 'servicioRow';

                // Crear una celda para el select de servicio
                const tdSelect = document.createElement('td');
                const selectServicio = document.createElement('select');
                selectServicio.className = 'selectServicio';
                selectServicio.name = 'servicios[]';
                selectServicio.style.width = '300px';

                // Agregar opción por defecto
                const optionDefault = document.createElement('option');
                optionDefault.value = '';
                optionDefault.textContent = 'Selecciona un servicio';
                optionDefault.disabled = true;
                optionDefault.selected = true;
                selectServicio.appendChild(optionDefault);

                // Agregar opciones para servicios disponibles
                serviciosDisponibles.forEach(servicioDisponible => {
                    if (servicioDisponible.IdServicio && servicioDisponible.NombreClase) {
                        const option = document.createElement('option');
                        option.value = servicioDisponible.IdServicio;
                        option.textContent = servicioDisponible.NombreClase;
                        selectServicio.appendChild(option);
                    }
                });

                // Preseleccionar el servicio asociado
                selectServicio.value = servicio.IdServicio;

                tdSelect.appendChild(selectServicio);
                tr.appendChild(tdSelect);

                // Crear una celda para el botón de eliminar
                const tdEliminar = document.createElement('td');
                const btnEliminar = document.createElement('button');
                btnEliminar.type = 'button';
                btnEliminar.className = 'btn btn-soft-danger mt-2';
                btnEliminar.innerHTML = '<i class="fa-solid fa-minus fa-lg"></i>';
                btnEliminar.onclick = function () {
                    serviciosTableBody.removeChild(tr);
                };

                tdEliminar.appendChild(btnEliminar);
                tr.appendChild(tdEliminar);

                // Agregar la fila a la tabla
                serviciosTableBody.appendChild(tr);
            });

            // Mostrar la tabla
            serviciosTable.style.display = 'table';
        } else {
            // Si no hay servicios asociados, ocultar la tabla
            serviciosTable.style.display = 'none';
        }

    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: '¡Oops...',
            text: 'Ocurrió un error al cargar los datos: ' + error.message
        });
    }
};


const actualizarMembresia = async () => {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const membresiaId = urlParams.get('id');

        const formulario = document.getElementById('FormularioMembresiasEditar'); // Corregido
        const formData = new FormData(formulario);

        const membresiaData = {};
        formData.forEach((value, key) => {
            membresiaData[key] = value;
        });

        // Asegúrate de que el campo de estado esté incluido y tenga un valor por defecto
        if (!membresiaData['Estado']) {
            membresiaData['Estado'] = '1'; // Estado por defecto "Activo"
        }

        const requiredFields = ['NombreMembresia', 'Frecuencia', 'CostoVenta', 'Descripcion'];
        for (const field of requiredFields) {
            if (!membresiaData[field]) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Error',
                    text: `Llene el campo ${field}`,
                    confirmButtonText: 'Aceptar'
                });
                return;
            }
        }

        // Actualizar la membresía
        const response = await fetch(`http://localhost:3000/api/membresias/${membresiaId}`, {
            method: 'PUT',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(membresiaData)
        });

        if (!response.ok) {
            throw new Error('Error al actualizar la membresía: ' + response.statusText);
        }

        // Actualizar los servicios asociados
        const serviciosSelects = document.querySelectorAll('.selectServicio');
        const serviciosData = Array.from(serviciosSelects) // Convierte el NodeList a array
            .map(select => parseInt(select.value, 10)) // Extrae y convierte el valor de cada select a número
            .filter(value => !isNaN(value)); // Filtra valores no numéricos

        // Envía el formato correcto al servidor
        const responseServicios = await fetch(`http://localhost:3000/api/membresias-servicios/${membresiaId}`, {
            method: 'PUT',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ IdServicios: serviciosData })
        });

        if (!responseServicios.ok) {
            throw new Error('Error al actualizar los servicios asociados: ' + responseServicios.statusText);
        }

        Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Membresía actualizada con éxito',
            confirmButtonText: 'Aceptar'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = '../membresiasAdmin';
            }
        });

    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al actualizar la membresía y/o sus servicios. Por favor, inténtalo de nuevo.',
            confirmButtonText: 'Aceptar'
        });
    }
};







