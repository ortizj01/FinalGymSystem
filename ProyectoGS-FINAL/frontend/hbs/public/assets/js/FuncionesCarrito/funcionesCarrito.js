// Función para obtener productos del carrito desde el localStorage y mostrarlos en la vista del carrito
const cargarCarrito = () => {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const carritoContainer = document.querySelector('.cart-list-head');

    if (carrito.length === 0) {
        carritoContainer.innerHTML = '<h2 style="text-align: center; font-size: 28px; color: #dd4b39;">El carrito está vacío.</h2>';
        actualizarTotales(); // Asegúrate de que el total a pagar se actualice a 0
        return;
    }

    let contenidoCarrito = '';

    carrito.forEach(item => {
        const total = item.PrecioProducto * item.cantidad;
        contenidoCarrito += `
            <div class="cart-single-list">
                <div class="row align-items-center">
                    <div class="col-lg-1 col-md-1 col-12">
                        <a href="product-details.html"><img src="${item.Imagen}" alt="${item.NombreProducto}"></a>
                    </div>
                    <div class="col-lg-4 col-md-3 col-12">
                        <h5 class="product-name"><a href="product-details.html">${item.NombreProducto}</a></h5>
                    </div>
                    <div class="col-lg-2 col-md-2 col-12">
                        <div class="count-input">
                            <select class="form-control" onchange="actualizarCantidad(${item.IdProducto}, this.value)">
                                ${[...Array(item.Stock).keys()].map(i => 
                                    `<option value="${i+1}" ${i+1 === item.cantidad ? 'selected' : ''}>${i+1}</option>`
                                ).join('')}
                            </select>
                        </div>
                    </div>
                    <div class="col-lg-2 col-md-2 col-12">
                        <p>$${item.PrecioProducto.toFixed(0)}</p> <!-- Subtotal corregido -->
                    </div>
                    <div class="col-lg-2 col-md-2 col-12">
                        <p>$${total.toFixed(0)}</p> <!-- Total corregido -->
                    </div>
                    <div class="col-lg-1 col-md-2 col-12">
                        <a class="remove-item" href="javascript:void(0)" onclick="eliminarProducto(${item.IdProducto})"><i class="lni lni-trash-can icon-trash-large"></i></a>
                    </div>
                </div>
            </div>
        `;
    });

    carritoContainer.innerHTML = contenidoCarrito;
    actualizarTotales();
};

// Función para actualizar la cantidad de un producto en el carrito
const actualizarCantidad = (productId, cantidad) => {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    carrito = carrito.map(item => {
        if (item.IdProducto === productId) {
            item.cantidad = parseInt(cantidad);
        }
        return item;
    });

    localStorage.setItem('carrito', JSON.stringify(carrito));
    cargarCarrito(); // Recargar el carrito para reflejar los cambios

    Swal.fire({
        icon: 'success',
        title: 'Cantidad actualizada',
        text: 'La cantidad del producto ha sido actualizada en el carrito.',
        timer: 1500,
        showConfirmButton: false
    });
};

// Función para eliminar un producto del carrito
const eliminarProducto = (productId) => {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito = carrito.filter(item => item.IdProducto !== productId);

    localStorage.setItem('carrito', JSON.stringify(carrito));
    cargarCarrito(); // Recargar el carrito para reflejar los cambios

    Swal.fire({
        icon: 'info',
        title: 'Producto eliminado',
        text: 'El producto ha sido eliminado del carrito.',
        timer: 1500,
        showConfirmButton: false
    });
};

// Función para calcular y mostrar los totales en la vista del carrito
const actualizarTotales = () => {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const totalAmountElement = document.querySelector('.total-amount span');
    const totalAPagar = carrito.reduce((total, item) => total + (item.PrecioProducto * item.cantidad), 0);
    totalAmountElement.textContent = `$${totalAPagar.toFixed(0)}`;
};

// Función para vaciar el carrito
const vaciarCarrito = () => {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¡Esta acción eliminará todos los productos del carrito!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, vaciar carrito',
        cancelButtonText:'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('carrito');
            cargarCarrito(); // Recargar el carrito para reflejar los cambios
            actualizarTotales(); // Actualizar el total a 0
            Swal.fire({
                icon: 'info',
                title: 'Carrito vaciado',
                text: 'Todos los productos han sido eliminados del carrito.',
                timer: 1500,
                showConfirmButton: false
            });
        }
    });
};

// Cargar el carrito cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    cargarCarrito();

    // Agregar evento al botón "Vaciar carrito"
    document.querySelector('.btn.vaciar-carrito').addEventListener('click', vaciarCarrito);
});
