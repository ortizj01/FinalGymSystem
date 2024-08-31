const url = 'http://localhost:3000/api/productos'

const listarProductos= async () => {
    let ObjectId = document.getElementById('contenidoProductos'); // obj donde se mostrara la info
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
        
        data.forEach(producto => {
            // Verificar cada producto
            console.log('producto:', producto);
            
            // Asegurarse de que las propiedades existan
            if (producto.NombreProducto && producto.PrecioProducto && producto.IvaProducto && producto.Imagen && producto.IdCategoriaProductos !== undefined) {
                contenido += `
                    <tr>
                        <td>${producto.NombreProducto}</td>
                        <td>${producto.PrecioProducto}</td>
                        <td>${producto.IvaProducto}</td>
                        <td>${producto.Stock}</td>
                        <td>${producto.estado_descripcion}</td>
                        <td>${producto.Nombre_categoria}</td>
                        <td style="text-align: center;" class="column-to-hide-producto">
                            <div class="centered-container">
                            <a href="../ProductosEditar?id=${producto.IdProducto}">
                                <i class="fa-regular fa-pen-to-square fa-xl me-2"></i>
                            </a>
                        </td>
                    </tr>
                `;
            } else {
                console.error('Formato de datos incorrecto', producto);
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


const precargarDatosProductosEnFormulario = async () => {

    
    // Buscar el parámetro 'id' en la URL
    var urlParams = new URLSearchParams(window.location.search);
    var productoId = urlParams.get('id');
    console.log(productoId);
    try {
        const response = await fetch(`${url}/${productoId}`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }


        const producto = await response.json();


        document.getElementById('Nombreproducto').value = producto.NombreProducto;
        document.getElementById('Precioproducto').value = producto.PrecioProducto;
        document.getElementById('ivaproducto').value = producto.IvaProducto;
        document.getElementById('Estadoedit').value = producto.EstadoProducto;
        document.getElementById('categoria').value = producto.IdCategoriaProductos;

    } catch (error) {
        console.error('Error:', error);
    }
};


// const editarProductos = async () => {
//     var urlParams = new URLSearchParams(window.location.search);
//     var id = urlParams.get('id');
//     const NombreProducto = document.getElementById('Nombreproducto').value;
//     const PrecioProducto = document.getElementById('Precioproducto').value;
//     const IvaProducto = document.getElementById('ivaproducto').value;
//     const Imagen = document.getElementById('Imagen').value;
//     const EstadoProducto = document.getElementById('Estadoedit').value;
//     const IdCategoriaProductos = document.getElementById('categoria').value;
    

//     if (NombreProducto === "" || PrecioProducto === "" || IvaProducto === "" || Imagen === "" || EstadoProducto === "" || IdCategoriaProductos === "") {
//         Swal.fire({
//             icon: 'warning',
//             title: 'Error',
//             text: 'Llene todos los campos',
//             confirmButtonText: 'Aceptar'
//         });
//         return;
//     }

//     try {
//         const response = await fetch(`${url}/${id}`, {
//             method: 'PATCH', // Cambiado a 'PATCH' para cumplir con el método de la API
//             mode: 'cors',
//             headers: {
//                 "Content-type": "application/json; charset=UTF-8"
//             },
//             body: JSON.stringify({
//                 NombreProducto,
//                 PrecioProducto,
//                 IvaProducto,
//                 Imagen,
//                 EstadoProducto,
//                 IdCategoriaProductos,
//             })
//         });

//         if (!response.ok) {
//             throw new Error('Error en la solicitud: ' + response.statusText);
//         }

//         const data = await response.json();
//         Swal.fire({
//             icon: 'success',
//             title: 'Éxito',
//             text: 'Producto editado con éxito',
//             confirmButtonText: 'Aceptar'
//         }).then((result) => {
//             if (result.isConfirmed) {
//                 // Redirigir a otra vista, por ejemplo, la lista de proveedores
//                 window.location.href = '../Productos'; // Reemplaza esta URL con la ruta real
//             }
//         });
//         listarProductos();
//     } catch (error) {
//         Swal.fire({
//             icon: 'error',
//             title: 'Error',
//             text: 'Hubo un error al editar el proveedor',
//             confirmButtonText: 'Aceptar'
//         });
//     }
// };


const editarProductos = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const NombreProducto = document.getElementById('Nombreproducto').value;
    const PrecioProducto = document.getElementById('Precioproducto').value;
    const IvaProducto = document.getElementById('ivaproducto').value;
    const Imagen = document.getElementById('Imagen').files[0]; // Obtén el archivo de la entrada de archivos
    const EstadoProducto = document.getElementById('Estadoedit').value;
    const IdCategoriaProductos = document.getElementById('categoria').value;

    if (!NombreProducto || !PrecioProducto || !IvaProducto || !EstadoProducto || !IdCategoriaProductos || !Imagen) {
        Swal.fire({
            icon: 'warning',
            title: 'Error',
            text: 'Llene todos los campos',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    const formData = new FormData();
    formData.append('NombreProducto', NombreProducto);
    formData.append('PrecioProducto', PrecioProducto);
    formData.append('IvaProducto', IvaProducto);
    formData.append('Imagen', Imagen); // Añade el archivo aquí
    formData.append('EstadoProducto', EstadoProducto);
    formData.append('IdCategoriaProductos', IdCategoriaProductos);

    try {
        const response = await fetch(`${url}/${id}`, {
            method: 'PATCH',
            mode: 'cors',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }

        const data = await response.json();
        Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Producto editado con éxito',
            confirmButtonText: 'Aceptar'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = '../Productos'; // Reemplaza esta URL con la ruta real
            }
        });
        listarProductos();
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al editar el producto',
            confirmButtonText: 'Aceptar'
        });
    }
};



    const agregarProducto = async () => {
        const NombreProducto = document.getElementById('Nombreproducto').value;
        const PrecioProducto = document.getElementById('Precioproducto').value;
        const IvaProducto = document.getElementById('Ivaproducto').value;
        const Imagen = document.getElementById('Imagen').files[0];  // Obtener el archivo de imagen
        const IdCategoriaProductos = document.getElementById('SelectorCategoria').value;

        if (NombreProducto === "" || PrecioProducto === "" || IvaProducto === "" || !Imagen || IdCategoriaProductos === "") {
            Swal.fire({
                icon: 'warning',
                title: 'Error',
                text: 'Llene todos los campos, incluyendo la imagen',
                confirmButtonText: 'Aceptar'
            });
            return;
        }

        const formData = new FormData();
        formData.append('NombreProducto', NombreProducto);
        formData.append('PrecioProducto', PrecioProducto);
        formData.append('IvaProducto', IvaProducto);
        formData.append('Stock', '0');  // Asumiendo que Stock siempre es 0 al agregar
        formData.append('Imagen', Imagen);
        formData.append('EstadoProducto', '1');  // Asumiendo que EstadoProducto siempre es 1 al agregar
        formData.append('IdCategoriaProductos', IdCategoriaProductos);

        try {
            const response = await fetch(url, {
                method: 'POST',
                mode: 'cors',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Error en la solicitud: ' + response.statusText);
            }

            const data = await response.json();
            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Producto agregado con éxito',
                confirmButtonText: 'Aceptar'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = '../productos';  // Redirigir a la lista de productos
                }
            });

            // Actualizar la lista de productos después de agregar uno nuevo
            listarProductos();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al agregar el Producto',
                confirmButtonText: 'Aceptar'
            });
        }
    };



document.addEventListener('DOMContentLoaded', function () {
    const selectElement = document.getElementById('SelectorCategoria');

    fetch('http://localhost:3000/api/categorias')
        .then(response => response.json())
        .then(data => {
            data.forEach(categorias => {
                const option = document.createElement('option');
                option.value = categorias.IdCategoriaProductos;
                option.textContent = categorias.NombreCategoriaProductos;
                selectElement.appendChild(option);
            });
        })
        .catch(error => console.error('Error al cargar las categorias:', error));
});

document.addEventListener('DOMContentLoaded', function () {
    const selectElement = document.getElementById('categoria');

    fetch('http://localhost:3000/api/categorias')
        .then(response => response.json())
        .then(data => {
            data.forEach(categorias => {
                const option = document.createElement('option');
                option.value = categorias.IdCategoriaProductos;
                option.textContent = categorias.NombreCategoriaProductos;
                selectElement.appendChild(option);
            });
        })
        .catch(error => console.error('Error al cargar los productos:', error));
});










const formularioproductos = document.getElementById('formularioProductos');
const inputs = document.querySelectorAll('#formularioProductos input');


const expresiones = {
	Nombreproducto: /^[^0-9][a-zA-Z0-9]*$/, 
    Precioproducto: /^(?:\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?|\d+(?:\.\d{1,2})?)$/,
	Ivaproducto:  /^([1-9]|[1-9][0-9]|100)%?$/
}

const campos={
    Nombreproducto:false,
    Precioproducto:false,
    Imagen:false,
    Ivaproducto:false
}


const validarformularioProductos = (e)=> {
    switch(e.target.name){
        case "Nombreproducto":
            validarcampo(expresiones.Nombreproducto, e.target,"Nombreproducto");
            break
    }
    switch(e.target.name){
        case "Precioproducto":
            validarcampo(expresiones.Precioproducto, e.target,"Precioproducto");
            break
    }
    switch(e.target.name){
        case "Ivaproducto":
            validarcampo(expresiones.Ivaproducto, e.target,"Ivaproducto");
            break
    }



}


const validarcampo = (expresion,input,campo) => {
    if (expresion.test(input.value)) {
        document.getElementById(`grupo__${campo}`).classList.remove("formulario__grupo-incorrecto");
        document.getElementById(`grupo__${campo}`).classList.add("formulario__grupo-correcto");
        document.querySelector(`#grupo__${campo} i`).classList.add("fa-check-circle");
        document.querySelector(`#grupo__${campo} i`).classList.remove("fa-times-circle");
        document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.remove("formulario__input-error-activo");
        campos[campo]=true;
    }else {
        document.getElementById(`grupo__${campo}`).classList.add("formulario__grupo-incorrecto");
        document.getElementById(`grupo__${campo}`).classList.remove("formulario__grupo-correcto");
        document.querySelector(`#grupo__${campo} i`).classList.add("fa-times-circle");
        document.querySelector(`#grupo__${campo} i`).classList.remove("fa-check-circle");
        document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.add("formulario__input-error-activo");
        campos[campo]=false;
    }


}

inputs.forEach((input)=>{
    input.addEventListener('keyup',validarformularioProductos);
    input.addEventListener('blur',validarformularioProductos);
    });

formularioproductos.addEventListener('submit',(e) => {
    e.preventDefault();
    if(campos.Nombreproducto && campos.Precioproducto && campos.Imagen && campos.Ivaproducto){
        document.getElementById('formulario__mensaje-exito').classList.add('formulario__mensaje-exito-activo');
        setTimeout(() => {
            document.getElementById('formulario__mensaje-exito').classList.remove('formulario__mensaje-exito-activo');
        }, 3000);
        document.querySelectorAll('.formulario__grupo-correcto').forEach((icono)=>{
            icono.classList.remove('formulario__grupo-correcto')
        });
    } else {
        document.getElementById('formulario__mensaje').classList.add('formulario__mensaje-activo')
        setTimeout(() => {
            document.getElementById('formulario__mensaje').classList.remove('formulario__mensaje-activo');
        }, 3000);

    }
});

