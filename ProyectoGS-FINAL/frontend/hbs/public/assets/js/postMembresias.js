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
                        <div class="d-flex justify-content-center">
                            <a href="detalleMembresia?id=${membresia.IdMembresia}" class="me-2"><i class="fa-regular fa-eye fa-lg"></i></a>
                            <a href="formMembresiasModal?id=${membresia.IdMembresia}" class="me-2"><i class="fa-regular fa-pen-to-square fa-lg"></i></a>
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
        })
        .catch(error => {
            console.error('Error al obtener los datos:', error);
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
            Estado:1// Convertir a número entero, asignar null si no está definido
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






const cargarDetalleMembresia = async () => {
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
        document.getElementById('Descripcion').value = membresia.Descripcion || '';

        const estadoSelect = document.getElementById('Estado');
        if (estadoSelect) {
            estadoSelect.value = membresia.Estado || ''; // Establece el valor del select

            // Manejo de la opción seleccionada
            const selectedOption = Array.from(estadoSelect.options).find(option => option.value === membresia.Estado.toString());
            if (selectedOption) {
                estadoSelect.value = selectedOption.value; // Establece el valor del select solo si la opción existe
            } else {
                console.error('Opción de estado no encontrada');
            }
        }

        // Cargar los servicios asociados a la membresía
        const responseServicios = await fetch(`http://localhost:3000/api/membresias-servicios/${membresiaId}`);
        if (!responseServicios.ok && responseServicios.status !== 404) {
            throw new Error('Error en la solicitud de servicios asociados: ' + responseServicios.statusText);
        }
        const servicios = responseServicios.status === 404 ? [] : await responseServicios.json();
        console.log('Servicios asociados a la membresía:', servicios);

        // Obtener la tabla de servicios agregados
        const serviciosTableBody = document.getElementById('serviciosAgregados');
        const serviciosTable = document.getElementById('serviciosTable');

        // Limpiar tabla existente
        serviciosTableBody.innerHTML = '';

        // Crear filas para los servicios asociados
        servicios.forEach(servicio => {
            const tr = document.createElement('tr');
            tr.className = 'servicioRow';

            const tdServicio = document.createElement('td');
            tdServicio.textContent = servicio.NombreClase || 'Nombre de la clase no disponible';
            tr.appendChild(tdServicio);

            serviciosTableBody.appendChild(tr);
        });

        // Mostrar la tabla de servicios
        serviciosTable.style.display = 'table';  // Mostrar la tabla de servicios

    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: '¡Oops...',
            text: 'Ocurrió un error al cargar los datos: ' + error.message
        });
    }
};



function agregarServicio() {
    var serviciosAgregados = document.getElementById("serviciosAgregados");

    // Crear nueva fila para el servicio
    var newRow = document.createElement("tr");
    newRow.className = "servicioRow";

    var servicioCell = document.createElement("td");

    // Crear el select pero no lo añadimos todavía
    var selectElement = document.createElement("select");
    selectElement.name = "servicios[]";
    selectElement.className = "selectServicio";
    selectElement.style.width = "300px";

    // Llamar a la función que llena el select con los servicios activos
    fetch('http://localhost:3000/api/Servicios')
        .then(response => response.json())
        .then(data => {
            // Llenar las opciones del select después de recibir los datos
            fillSelectOptions(selectElement, data);

            // Una vez que las opciones estén cargadas, añade el select a la fila
            servicioCell.appendChild(selectElement);

            // Crear la celda de acciones y el botón eliminar
            var accionesCell = document.createElement("td");
            var btnEliminar = document.createElement("button");
            btnEliminar.type = "button";
            btnEliminar.className = "btn btn-soft-danger mt-2";
            btnEliminar.innerHTML = '<i class="fa-solid fa-minus fa-lg"></i>';
            btnEliminar.onclick = function () {
                newRow.remove();
            };
            accionesCell.appendChild(btnEliminar);

            // Añadir las celdas a la fila
            newRow.appendChild(servicioCell);
            newRow.appendChild(accionesCell);

            // Finalmente, añadir la nueva fila a la tabla de servicios agregados
            serviciosAgregados.appendChild(newRow);
        })
        .catch(error => {
            console.error('Error al cargar servicios:', error);
        });
}

function fillSelectOptions(selectElement, servicios) {
    selectElement.innerHTML = '<option selected="" disabled="" value="">Agregar servicio</option>';

    servicios.forEach(servicio => {
        // Filtramos los servicios que estén activos (Estado === 1)
        if (servicio.Estado === 1) {
            const option = document.createElement('option');
            option.value = servicio.IdServicio;
            option.textContent = servicio.NombreClase;
            selectElement.appendChild(option);
        }
    });
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
            const selectServicio = document.getElementById('selectServicio');
            selectServicio.innerHTML = '<option value="" disabled selected hidden>Agregar servicio</option>';

            data.forEach(servicio => {
                // Filtramos los servicios que estén activos (Estado === 1)
                if (servicio.Estado === 1) {
                    const option = document.createElement('option');
                    option.value = servicio.IdServicio;
                    option.textContent = servicio.NombreClase;
                    selectServicio.appendChild(option);
                }
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
        document.getElementById('Descripcion').value = membresia.Descripcion || '';

        const estadoSelect = document.getElementById('Estado');
        if (estadoSelect) {
            estadoSelect.value = membresia.Estado || ''; // Establece el valor del select

            // Manejo de la opción seleccionada
            const selectedOption = Array.from(estadoSelect.options).find(option => option.value === membresia.Estado.toString());
            if (selectedOption) {
                estadoSelect.value = selectedOption.value; // Establece el valor del select solo si la opción existe
            } else {
                console.error('Opción de estado no encontrada');
            }
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

        // Limpiar tabla existente
        serviciosTableBody.innerHTML = '';

        // Crear una opción por defecto para el select
        const crearSelectServicios = (selectedId = '') => {
            const selectServicio = document.createElement('select');
            selectServicio.className = 'selectServicio';
            selectServicio.name = 'servicios[]';
            selectServicio.style.width = '300px';

            const optionDefault = document.createElement('option');
            optionDefault.value = '';
            optionDefault.textContent = 'Selecciona un servicio';
            optionDefault.disabled = true;
            optionDefault.selected = true;
            selectServicio.appendChild(optionDefault);

            serviciosDisponibles.forEach(servicioDisponible => {
                if (servicioDisponible.IdServicio && servicioDisponible.NombreClase) {
                    const option = document.createElement('option');
                    option.value = servicioDisponible.IdServicio;
                    option.textContent = servicioDisponible.NombreClase;
                    selectServicio.appendChild(option);
                }
            });

            selectServicio.value = selectedId; // Preseleccionar el servicio asociado si existe
            return selectServicio;
        };

        // Cargar los servicios asociados
        let servicios = [];
        try {
            const responseServicios = await fetch(`http://localhost:3000/api/membresias-servicios/${membresiaId}`);
            if (!responseServicios.ok) {
                if (responseServicios.status === 404) {
                    console.log('No hay servicios asociados a esta membresía.');
                } else {
                    throw new Error('Error en la solicitud de servicios asociados: ' + responseServicios.statusText);
                }
            } else {
                servicios = await responseServicios.json();
                console.log('Servicios asociados a la membresía:', servicios);
            }
        } catch (error) {
            console.error('Error al cargar servicios asociados:', error);
            return; // Salir de la función si no se pueden cargar los servicios
        }

        // Crear filas para los servicios asociados
        servicios.forEach(servicio => {
            const tr = document.createElement('tr');
            tr.className = 'servicioRow';

            const tdSelect = document.createElement('td');
            const selectServicio = crearSelectServicios(servicio.IdServicio); // Preseleccionar el servicio asociado
            tdSelect.appendChild(selectServicio);
            tr.appendChild(tdSelect);

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

            serviciosTableBody.appendChild(tr);
        });

        // Agregar una fila para añadir un nuevo servicio
        const trAgregar = document.createElement('tr');
        trAgregar.className = 'servicioRow';

        const tdSelectAgregar = document.createElement('td');
        const selectServicioAgregar = crearSelectServicios(); // Sin preselección
        tdSelectAgregar.appendChild(selectServicioAgregar);
        trAgregar.appendChild(tdSelectAgregar);

        const tdAgregar = document.createElement('td');
        const btnAgregar = document.createElement('button');
        btnAgregar.type = 'button';
        btnAgregar.className = 'btn btn-soft-primary mt-2';
        btnAgregar.innerHTML = '<i class="fa-solid fa-plus fa-lg"></i>';
        btnAgregar.onclick = function () {
            const trNuevo = document.createElement('tr');
            trNuevo.className = 'servicioRow';

            const tdSelectNuevo = document.createElement('td');
            const selectServicioNuevo = crearSelectServicios(); // Sin preselección
            tdSelectNuevo.appendChild(selectServicioNuevo);
            trNuevo.appendChild(tdSelectNuevo);

            const tdEliminarNuevo = document.createElement('td');
            const btnEliminarNuevo = document.createElement('button');
            btnEliminarNuevo.type = 'button';
            btnEliminarNuevo.className = 'btn btn-soft-danger mt-2';
            btnEliminarNuevo.innerHTML = '<i class="fa-solid fa-minus fa-lg"></i>';
            btnEliminarNuevo.onclick = function () {
                serviciosTableBody.removeChild(trNuevo);
            };

            tdEliminarNuevo.appendChild(btnEliminarNuevo);
            trNuevo.appendChild(tdEliminarNuevo);

            serviciosTableBody.appendChild(trNuevo);
        };

        tdAgregar.appendChild(btnAgregar);
        trAgregar.appendChild(tdAgregar);

        serviciosTableBody.appendChild(trAgregar);

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

        const formulario = document.getElementById('FormularioMembresiasEditar');
        const formData = new FormData(formulario);

        const membresiaData = {};
        formData.forEach((value, key) => {
            membresiaData[key] = value;
        });

        // Eliminar el estado por defecto, ahora el campo 'Estado' debe estar incluido en el formulario
        const requiredFields = ['NombreMembresia', 'Frecuencia', 'CostoVenta', 'Descripcion', 'Estado'];
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

        // Servicios son opcionales
        const serviciosSelects = document.querySelectorAll('.selectServicio');
        const serviciosData = Array.from(serviciosSelects)
            .map(select => parseInt(select.value, 10))
            .filter(value => !isNaN(value));

        // Si hay servicios seleccionados, actualizar los servicios asociados
        if (serviciosData.length > 0) {
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









