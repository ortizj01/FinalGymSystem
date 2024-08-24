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
const abrirModalProducto = async (productId) => {
    const saveButton = document.getElementById('saveProductChanges');
    saveButton.setAttribute('data-product-id', productId);

    // Restablecer el estado del checkbox
    document.getElementById('showInCatalog').checked = false;

    // Obtener el estado actual del producto en el catálogo desde el backend
    try {
        const response = await fetch(`http://localhost:3000/api/carrito/catalogo/${productId}`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener el estado del producto en el catálogo');
        }

        const productoCatalogo = await response.json();

        if (productoCatalogo.en_catalogo) {
            document.getElementById('showInCatalog').checked = true;
        }

        $('#productOptionsModal').modal('show');
    } catch (error) {
        console.error('Error:', error.message);
    }
};

document.getElementById('saveProductChanges').addEventListener('click', async () => {
    const productId = document.getElementById('saveProductChanges').getAttribute('data-product-id');
    const showInCatalog = document.getElementById('showInCatalog').checked;

    // Actualizar el estado del producto en el catálogo en la base de datos
    try {
        const response = await fetch(`http://localhost:3000/api/carrito/catalogo/${productId}`, {
            method: 'PATCH',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ en_catalogo: showInCatalog })
        });

        if (!response.ok) {
            throw new Error('Error al actualizar el producto en el catálogo');
        }

        Swal.fire({
            icon: 'success',
            title: 'Producto actualizado',
            text: 'El producto ha sido actualizado en el catálogo correctamente.',
        });

        $('#productOptionsModal').modal('hide');
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `El producto no se pudo actualizar. ${error.message}`,
        });
        console.error('Error al actualizar el catálogo:', error);
    }
});

// Listener manual para el botón de cerrar (X) en la esquina del modal
document.querySelector('.modal .close').addEventListener('click', () => {
    $('#productOptionsModal').modal('hide');
});

// Listener manual para el botón "Cerrar" en el pie del modal
document.querySelector('.modal-footer .btn-secondary').addEventListener('click', () => {
    $('#productOptionsModal').modal('hide');
});


// Cargar la lista de productos al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    listarProductos();
});
