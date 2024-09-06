const url = 'http://localhost:3000/api/categorias'
//const url = 'http://localhost:8081/proveedor'




const editarCategoria = async (id) => {
    const NombreCategoriaProductos = document.getElementById('categoriaEdit').value;
    const EstadoCategoriaProductos = document.getElementById('Estado').value;


    if (NombreCategoriaProductos === "" || EstadoCategoriaProductos === "") {
        Swal.fire({
            icon: 'warning',
            title: 'Error',
            text: 'Llene todos los campos',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    try {
        const response = await fetch(`${url}/${id}`, {
            method: 'PATCH', // Cambiado a 'PATCH' para cumplir con el método de la API
            mode: 'cors',
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify({
                NombreCategoriaProductos,
                EstadoCategoriaProductos,
            })
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }

        const data = await response.json();
        Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Categoria editada con éxito',
            confirmButtonText: 'Aceptar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Redirigir a otra vista, por ejemplo, la lista de proveedores
                window.location.href = '../Categoriaprod'; // Reemplaza esta URL con la ruta real
            }
        });
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al editar el categoria',
            confirmButtonText: 'Aceptar'
        });
    }
};


const agregarCategoria = async () => {
    const NombreCategoriaProductos=document.getElementById('NombreCategoriaProductos').value;


    if (NombreCategoriaProductos === "") {
        Swal.fire({
            icon: 'warning',
            title: 'Error',
            text: 'Llene todos los campos',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify({
                NombreCategoriaProductos,
                EstadoCategoriaProductos:1,
            })
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }

        const data = await response.json();
        Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Categoria agregada con éxito',
            confirmButtonText: 'Aceptar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Redirigir a otra vista, por ejemplo, la lista de proveedores
                window.location.href = '../Categoriaprod'; // Reemplaza esta URL con la ruta real
            }
        });
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al agregar el categoria',
            confirmButtonText: 'Aceptar'
        });
    }
};


const listarCategoria = async () => {
    let ObjectId = document.getElementById('contenidoCategoria'); // obj donde se mostrara la info
    let contenido = ''; // contiene las filas y celdas que se mostraran en el tbody

    try {
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }

        const data = await response.json();
        
        // Verificar datos recibidos
        console.log('Datos recibidos:', data);
        
        // Aquí asumimos que data es un array de objetos de rutinas
        data.forEach(categoria => {
            // Verificar cada rutina
            console.log('categoria:', categoria);
            
            // Asegurarse de que las propiedades existan
            if (categoria.NombreCategoriaProductos && categoria.EstadoCategoriaProductos !== undefined) {
                contenido += `
                    <tr>
                        <td>${categoria.NombreCategoriaProductos}</td>
                        <td>${categoria.estado_descripcion}</td>
                        <td style="text-align: center;" class="column-to-hide-categoriaProducto">
                            <div class="centered-container" >
                                <i class="fa-regular fa-pen-to-square fa-xl me-2"
                                data-bs-toggle="modal" data-bs-target="#exampleModal1" data-bs-whatever="@mdo" onclick="precargarDatosCategoriaEnFormulario(${categoria.IdCategoriaProductos})"></i>
                        </td>
                    </tr>
                `;
            } else {
                console.error('Formato de datos incorrecto', categoria);
            }
        });

        ObjectId.innerHTML = contenido;
        $('#dataTable').DataTable().destroy();

        $('#dataTable').DataTable({
            language: {
                "decimal": "",
                "emptyTable": "No hay información",
                "info": "Mostrando _START_ a _END_ de _TOTAL_ Entradas",
                "infoEmpty": "Mostrando 0 to 0 of 0 Entradas",
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
                    "last": "Ultimo",
                    "next": "Siguiente",
                    "previous": "Anterior"
                }
            }, 
            lengthMenu: [5, 10, 25, 50], // Opciones de selección de registros por página
            pageLength: 5 
        });

    } catch (error) {
        console.error('Error:', error);
    }
};

const precargarDatosCategoriaEnFormulario = async (Id) => {
    try {
        const response = await fetch(`${url}/${Id}`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }


        const categoria = await response.json();

        // Precargar los datos del proveedor en el formulario
        document.getElementById('categoriaEdit').value = categoria.NombreCategoriaProductos;
        document.getElementById('Estado').value = categoria.EstadoCategoriaProductos;
        document.getElementById('id').value = categoria.IdCategoriaProductos;


    } catch (error) {
        console.error('Error:', error);
    }
};





