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
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${membresia.NombreMembresia}</td>
                    <td>${membresia.Frecuencia}</td>
                    <td>${membresia.CostoVenta}</td>
                    <td>${membresia.Estado}</td>
                    <td>
                        <div class="centered-container">
                            <a href="detalleMembresia?id=${membresia.IdMembresia}"><i class="fa-regular fa-eye fa-lg me-2"></i></a>
                            <a href="formMembresiasModal?id=${membresia.IdMembresia}"><i class="fa-regular fa-pen-to-square fa-lg me-2"></i></a>
                            <i class="fa-solid fa-trash fa-lg me-2" data-bs-toggle="modal" data-bs-target="#eliminarMembresiaModal" data-id="${membresia.IdMembresia}"></i>
                        </div>
                    </td>
                `;
                tableBody.appendChild(row);

                // Agregar evento al botón de eliminar para mostrar modal de confirmación
                const eliminarBtn = row.querySelector('.fa-trash');
                eliminarBtn.addEventListener('click', () => {
                    const membresiaId = eliminarBtn.getAttribute('data-id');
                    console.log('Eliminar membresía con ID:', membresiaId);
                    // Asignar el ID de la membresía al formulario de confirmación
                    document.getElementById('eliminarMembresiaForm').setAttribute('data-id', membresiaId);
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
        const membresiaId = eliminarMembresiaForm.getAttribute('id');
        console.log('Confirmar eliminar membresía con ID:', membresiaId);
        // Aquí puedes agregar lógica para enviar la solicitud DELETE al servidor
        // por ejemplo, utilizando fetch o axios
        // Una vez eliminada, puedes recargar la tabla o actualizar los datos según sea necesario
        // Por ahora, simplemente cierro el modal
        const modal = document.getElementById('eliminarMembresiaModal');
        const bsModal = bootstrap.Modal.getInstance(modal);
        bsModal.hide(); // Cerrar el modal de confirmación
    });
});
function fetchServicios() {
    fetch('http://localhost:3000/api/Servicios')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const selectProducto = document.getElementById('selectProducto');
            selectProducto.innerHTML = '<option value="" disabled selected hidden>Agregar servicio</option>';

            data.forEach(servicio => {
                const option = document.createElement('option');
                option.value = servicio.IdServicio;
                option.textContent = servicio.NombreClase;
                selectProducto.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error al cargar servicios:', error);
        });
}

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
            if (key === 'productos[]') {
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
            CostoTotal: jsonObject.Costototal ? parseFloat(jsonObject.Costototal) : null, // Convertir a número decimal, asignar null si no está definido
            CostoVenta: jsonObject.Costoventa ? parseFloat(jsonObject.Costoventa) : null, // Convertir a número decimal, asignar null si no está definido
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
            const membresiaServicios = {
                IdServicios: jsonObject['productos[]'] || [] // Asegúrate de que sea un arreglo
            };

            // Mostrar los datos a enviar en la consola
            console.log('Datos de servicios a enviar:', membresiaServicios);

            // Ahora enviamos los servicios a la membresía
            return fetch(`http://localhost:3000/api/membresias-servicios/${data.IdMembresia}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(membresiaServicios)
            });
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(error => {
                    throw new Error(error.message || 'Hubo un problema al asignar los servicios.');
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Servicios asignados a la membresía:', data);
            Swal.fire({
                title: "¡Excelente!",
                text: "Membresía y servicios registrados correctamente!",
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
            document.getElementById('CostoTotal').innerText = data.CostoTotal;
            document.getElementById('CostoVenta').innerText = data.CostoVenta;
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
