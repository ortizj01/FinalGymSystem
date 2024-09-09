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
                    <button type="button" class="btn btn-primary btn-gestionar" data-product-id="${producto.IdProducto}">
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
        $('#dataTableProductos').DataTable({
            pageLength: 5,
            language: {
                "lengthMenu": "Mostrar _MENU_ entradas",
                "zeroRecords": "No se encontraron resultados",
                "info": "Mostrando _START_ a _END_ de _TOTAL_ entradas",
                "infoEmpty": "Mostrando 0 a 0 de 0 entradas",
                "infoFiltered": "(filtrado de _MAX_ entradas en total)",
                "paginate": {
                    "first": "Primero",
                    "last": "Último",
                    "next": "Siguiente",
                    "previous": "Anterior"
                },
                "search": "Buscar:"
            }
        });

        // Delegación de eventos para todos los botones de gestionar
        $('#dataTableProductos').on('click', '.btn-gestionar', function () {
            const productId = $(this).attr('data-product-id');
            abrirModalProducto(productId);
        });
    } else {
        console.error('No se encontró el elemento con id "tablaProductos"');
    }
};


// Función para obtener las membresías de la API
const obtenerMembresias = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/membresias', {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener las membresías');
        }

        const membresias = await response.json();
        return membresias;
    } catch (error) {
        console.error('Error:', error.message);
        return [];
    }
};

// Función para listar membresías en la tabla
const listarMembresias = async () => {
    const membresias = await obtenerMembresias();
    let contenidoTabla = '';

    for (const membresia of membresias) {
        contenidoTabla += `<tr>` +
            `<td>${membresia.IdMembresia}</td>` +
            `<td>${membresia.NombreMembresia}</td>` +
            `<td>${membresia.Frecuencia}</td>` +
            `<td>${membresia.CostoVenta}</td>` +
            `<td>${membresia.Estado == 1 ? 'Activo' : 'Inactivo'}</td>` +
            `<td>
                <div class="btn-group">
                    <button type="button" class="btn btn-secondary btn-gestionar-membresia" data-membresia-id="${membresia.IdMembresia}">
                        <i class="fas fa-shopping-cart"></i> Gestionar
                    </button>
                </div>
            </td>` +
            `</tr>`;
    }

    const tablaMembresias = document.getElementById('tablaMembresias');
    if (tablaMembresias) {
        tablaMembresias.innerHTML = contenidoTabla;

        // Inicializar DataTables después de agregar los datos al DOM
        $('#dataTableMembresias').DataTable({
            pageLength: 5,
            language: {
                "lengthMenu": "Mostrar _MENU_ entradas",
                "zeroRecords": "No se encontraron resultados",
                "info": "Mostrando _START_ a _END_ de _TOTAL_ entradas",
                "infoEmpty": "Mostrando 0 a 0 de 0 entradas",
                "infoFiltered": "(filtrado de _MAX_ entradas en total)",
                "paginate": {
                    "first": "Primero",
                    "last": "Último",
                    "next": "Siguiente",
                    "previous": "Anterior"
                },
                "search": "Buscar:"
            }
        });

        // Delegación de eventos para todos los botones de gestionar membresías
        $('#dataTableMembresias').on('click', '.btn-gestionar-membresia', function () {
            const membresiaId = $(this).attr('data-membresia-id');
            abrirModalMembresia(membresiaId);
        });
    } else {
        console.error('No se encontró el elemento con id "tablaMembresias"');
    }
};


// Función para abrir el modal de opciones de producto
const abrirModalProducto = async (productId) => {
    const saveButton = document.getElementById('saveProductChanges');
    saveButton.setAttribute('data-product-id', productId);

    // Restablecer el estado del checkbox
    document.getElementById('showInCatalog').checked = false;

    // Obtener el estado actual del producto en el catálogo desde el backend
    try {
        const response = await fetch(`http://localhost:3000/api/carrito/catalogo/producto/${productId}`, {
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

// Función para abrir el modal de opciones de membresía
const abrirModalMembresia = async (membresiaId) => {
    const saveButton = document.getElementById('saveMembershipChanges');
    saveButton.setAttribute('data-membresia-id', membresiaId);

    // Restablecer el estado del checkbox
    document.getElementById('showMembershipInCatalog').checked = false;

    // Obtener el estado actual de la membresía en el catálogo desde el backend
    try {
        const response = await fetch(`http://localhost:3000/api/carrito/catalogo/membresia/${membresiaId}`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener el estado de la membresía en el catálogo');
        }

        const membresiaCatalogo = await response.json();

        if (membresiaCatalogo.en_catalogo) {
            document.getElementById('showMembershipInCatalog').checked = true;
        }

        $('#membershipOptionsModal').modal('show');
    } catch (error) {
        console.error('Error:', error.message);
    }
};


// Listener para guardar los cambios de producto
document.getElementById('saveProductChanges').addEventListener('click', async () => {
    const productId = document.getElementById('saveProductChanges').getAttribute('data-product-id');
    const showInCatalog = document.getElementById('showInCatalog').checked;

    try {
        const response = await fetch(`http://localhost:3000/api/carrito/catalogo/producto/${productId}`, {
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

// Listener para guardar los cambios de membresía
document.getElementById('saveMembershipChanges').addEventListener('click', async () => {
    const membresiaId = document.getElementById('saveMembershipChanges').getAttribute('data-membresia-id');
    const showMembershipInCatalog = document.getElementById('showMembershipInCatalog').checked;

    try {
        const response = await fetch(`http://localhost:3000/api/carrito/catalogo/membresia/${membresiaId}`, {
            method: 'PATCH',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ en_catalogo: showMembershipInCatalog })
        });

        if (!response.ok) {
            throw new Error('Error al actualizar la membresía en el catálogo');
        }

        Swal.fire({
            icon: 'success',
            title: 'Membresía actualizada',
            text: 'La membresía ha sido actualizada en el catálogo correctamente.',
        });

        $('#membershipOptionsModal').modal('hide');
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `La membresía no se pudo actualizar. ${error.message}`,
        });
        console.error('Error al actualizar el catálogo:', error);
    }
});

// Listener manual para el botón de cerrar (X) en la esquina del modal
document.querySelectorAll('.modal .close').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
        $('.modal').modal('hide');
    });
});

// Listener manual para el botón "Cerrar" en el pie del modal
document.querySelectorAll('.modal-footer .btn-secondary').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
        $('.modal').modal('hide');
    });
});



// Funciones para alternar vistas
document.getElementById('showProductos').addEventListener('click', () => {
    document.getElementById('productosTable').style.display = 'block';
    document.getElementById('membresiasTable').style.display = 'none';
});

document.getElementById('showMembresias').addEventListener('click', () => {
    document.getElementById('productosTable').style.display = 'none';
    document.getElementById('membresiasTable').style.display = 'block';
});



// Cargar las listas al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    listarProductos();
    listarMembresias();
});


