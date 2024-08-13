// Función para obtener los productos de la API
const obtenerProductos = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/productos', {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener los productos');
        }

        const productos = await response.json();
        return productos;
    } catch (error) {
        console.error('Error:', error.message);
        return [];
    }
};

// Función para listar productos en la tabla
const listarProductos = async () => {
    const productos = await obtenerProductos();
    let contenidoTabla = '';

    for (const producto of productos) {
        contenidoTabla += `<tr>` +
            `<td>${producto.IdProducto}</td>` +
            `<td>${producto.NombreProducto}</td>` +
            `<td>${producto.PrecioProducto}</td>` +
            `<td>${producto.Stock}</td>` +
            `<td><img src="${producto.Imagen}" alt="${producto.NombreProducto}" style="width:50px;height:50px;"></td>` +
            `<td>
                <div class="btn-group">
                    <button type="button" class="btn btn-primary" data-product-id="${producto.IdProducto}">
                        <i class="fas fa-shopping-cart"></i> Gestionar
                    </button>
                </div>
            </td>` +
            `</tr>`;
    }

    const tablaProductos = document.getElementById('tablaProductos');
    if (tablaProductos) {
        tablaProductos.innerHTML = contenidoTabla;

        // Inicializar DataTables después de agregar los datos al DOM
        $('#dataTable').DataTable({
            language: {
                url: 'https://cdn.datatables.net/plug-ins/1.10.20/i18n/Spanish.json',
                paginate: {
                    previous: "Anterior",
                    next: "Siguiente"
                },
                search: "Buscar:",
                lengthMenu: "Mostrar _MENU_ registros",
                info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
                infoEmpty: "No hay registros disponibles",
                infoFiltered: "(filtrado de _MAX_ registros totales)",
                zeroRecords: "No se encontraron coincidencias",
                emptyTable: "No hay datos disponibles en la tabla",
                loadingRecords: "Cargando...",
                processing: "Procesando...",
            },
            pageLength: 5,
            lengthChange: false,
            destroy: true // Destruir cualquier instancia previa de DataTables para evitar conflictos
        });

    } else {
        console.error('No se encontró el elemento con id "tablaProductos"');
    }

    // Re-bind click event for buttons
    document.querySelectorAll('[data-product-id]').forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = event.currentTarget.getAttribute('data-product-id');
            abrirModalProducto(productId);
        });
    });
};

// Función para abrir el modal de opciones de producto
const abrirModalProducto = (productId) => {
    const saveButton = document.getElementById('saveProductChanges');
    saveButton.setAttribute('data-product-id', productId);

    // Restablecer el estado del checkbox
    document.getElementById('showInCatalog').checked = false;

    // Cargar el estado del producto desde localStorage
    const productosCatalogo = JSON.parse(localStorage.getItem('productosCatalogo')) || [];
    const productoEnCatalogo = productosCatalogo.find(prod => prod.IdProducto == productId);
    if (productoEnCatalogo) {
        document.getElementById('showInCatalog').checked = true;
    }

    $('#productOptionsModal').modal('show');
};

// Agregar un listener manual al botón de cierre
document.querySelectorAll('[data-dismiss="modal"]').forEach(button => {
    button.addEventListener('click', () => {
        $('#productOptionsModal').modal('hide');
    });
});

document.getElementById('saveProductChanges').addEventListener('click', async () => {
    const productId = document.getElementById('saveProductChanges').getAttribute('data-product-id');
    const showInCatalog = document.getElementById('showInCatalog').checked;

    const productos = await obtenerProductos();
    const producto = productos.find(prod => prod.IdProducto == productId);

    if (producto) {
        let productosCatalogo = JSON.parse(localStorage.getItem('productosCatalogo')) || [];

        if (showInCatalog) {
            if (!productosCatalogo.some(prod => prod.IdProducto == productId)) {
                productosCatalogo.push(producto);
            }
        } else {
            productosCatalogo = productosCatalogo.filter(prod => prod.IdProducto != productId);
        }

        localStorage.setItem('productosCatalogo', JSON.stringify(productosCatalogo));
        
        // Mostrar mensaje de éxito
        Swal.fire({
            icon: 'success',
            title: 'Producto actualizado',
            text: 'El producto ha sido actualizado en el catálogo correctamente.',
        });
    } else {
        // Mostrar mensaje de error
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El producto no se pudo actualizar. Inténtalo nuevamente.',
        });
        console.error('Producto no encontrado');
    }

    $('#productOptionsModal').modal('hide');

    // Re-list products in the catalog
    listarProductosEnCatalogo();
});

// Cargar la lista de productos al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    listarProductos();
});
