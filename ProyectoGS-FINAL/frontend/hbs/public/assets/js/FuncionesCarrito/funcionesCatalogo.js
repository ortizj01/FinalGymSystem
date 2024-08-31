
// Función para obtener productos y membresías del catálogo
const listarItemsEnCatalogo = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/carrito/catalogo', {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener los elementos del catálogo');
        }

        const itemsCatalogo = await response.json();
        const categorias = await obtenerCategorias();
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

        const contenedorProductos = document.getElementById('contenedorProductos');
        const contenedorMembresias = document.getElementById('contenedorMembresias');
        
        if (!contenedorProductos || !contenedorMembresias) {
            console.error('No se encontraron los elementos necesarios para mostrar los productos o membresías.');
            return;
        }

        let contenidoProductos = '';
        let contenidoMembresias = '';

        for (let item of itemsCatalogo) {
            if (item.tipo === 'producto') {
                if (!item.hasOwnProperty('IdCategoriaProductos')) {
                    const productoResponse = await fetch(`http://localhost:3000/api/productos/${item.IdProducto}`, {
                        method: 'GET',
                        mode: 'cors',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    if (productoResponse.ok) {
                        const productoDetalles = await productoResponse.json();
                        item.IdCategoriaProductos = productoDetalles.IdCategoriaProductos;
                    } else {
                        console.error(`Error al obtener detalles del producto con IdProducto: ${item.IdProducto}`);
                    }
                }

                const categoria = categorias.find(cat => cat.IdCategoriaProductos === item.IdCategoriaProductos);
                const nombreCategoria = categoria ? categoria.NombreCategoriaProductos : 'Sin categoría';

                const productoEnCarrito = carrito.find(prod => prod.IdProducto === item.IdProducto);
                const cantidadSeleccionada = productoEnCarrito ? productoEnCarrito.cantidad : 1;

                contenidoProductos += `
                    <div class="col-lg-3 col-md-6 col-12">
                        <div class="single-product">
                            <div class="product-image">
                                <img src="${item.Imagen}" alt="${item.NombreProducto}">
                                <div class="button">
                                    ${item.Stock > 0 ? 
                                        `<a href="javascript:void(0)" class="btn agregar-al-carrito" data-id="${item.IdProducto}"><i class="lni lni-cart"></i> ${productoEnCarrito ? 'Actualizar carrito' : 'Agregar al carrito'}</a>` :
                                        `<span class="agotado">Agotado</span>`
                                    }
                                </div>
                            </div>
                            <div class="product-info">
                                <div class="d-flex justify-content-between align-items-center">
                                    <h4 class="title">
                                        <a href="product-grids.html">${item.NombreProducto}</a>
                                    </h4>
                                    <span class="stock">Stock: ${item.Stock}</span>
                                </div>
                                <span class="category">Categoría: ${nombreCategoria}</span>
                                <div class="price d-flex justify-content-between align-items-center">
                                    <span>$${item.PrecioProducto}</span>
                                    ${item.PrecioOriginal ? `<span class="discount-price">$${item.PrecioOriginal}</span>` : ''}
                                    <select class="form-control cantidad-select" data-id="${item.IdProducto}">
                                        ${[...Array(item.Stock).keys()].map(i => 
                                            `<option value="${i+1}" ${cantidadSeleccionada === i + 1 ? 'selected' : ''}>${i+1}</option>`
                                        ).join('')}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            } else if (item.tipo === 'membresia') {
                const numMembresiasAgregadas = contenedorMembresias.querySelectorAll('.single-banner').length;
                const imagenMembresia = numMembresiasAgregadas === 0 
                    ? '/themes-envio/shopgrids/assets/images/logo/5.jpg' 
                    : '/themes-envio/shopgrids/assets/images/logo/6.jpg';
            
                contenidoMembresias += `
                    <div class="col-lg-6 col-md-6 col-12 mb-4"> <!-- Clase mb-4 para margen inferior -->
                        <div class="single-banner" style="background-image:url('${imagenMembresia}')">
                            <div class="content">
                                <h2 class="titulo">${item.NombreProducto}</h2>
                                <p><br> </p>
                                <div class="button">
                                    <a href="detalleMembresiaCarrito?IdMembresia=${item.IdProducto}" class="btn">Ver detalle</a>

                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }
        }

        contenedorProductos.innerHTML = contenidoProductos;
        contenedorMembresias.innerHTML = contenidoMembresias;

        // Asignar eventos para productos
        document.querySelectorAll('.agregar-al-carrito').forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = event.currentTarget.getAttribute('data-id');
                const cantidad = document.querySelector(`.cantidad-select[data-id="${productId}"]`).value;
                const producto = itemsCatalogo.find(item => item.IdProducto == productId);
                agregarAlCarrito(producto, cantidad);
            });
        });

        document.querySelectorAll('.cantidad-select').forEach(select => {
            select.addEventListener('change', (event) => {
                const productId = event.currentTarget.getAttribute('data-id');
                const cantidad = event.currentTarget.value;
                const producto = itemsCatalogo.find(item => item.IdProducto == productId);
                actualizarCantidadDirectamente(producto, cantidad);
            });
        });

    } catch (error) {
        console.error('Error al listar productos y membresías en el catálogo:', error.message);
    }
};



// Función para obtener las categorías de la API
const obtenerCategorias = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/categorias', {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener las categorías');
        }

        const categorias = await response.json();
        return categorias;
    } catch (error) {
        console.error('Error:', error.message);
        return [];
    }
};

// Función para agregar un producto al carrito o actualizar la cantidad
const agregarAlCarrito = (producto, cantidadSeleccionada) => {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let cantidad = parseInt(cantidadSeleccionada, 10);

    const productoExistente = carrito.find(item => item.IdProducto === producto.IdProducto);

    if (productoExistente) {
        if (productoExistente.cantidad + 1 <= producto.Stock) {
            productoExistente.cantidad += 1;
            cantidad = productoExistente.cantidad;
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Stock insuficiente',
                text: `No se puede agregar más del producto ${producto.NombreProducto}. Stock disponible: ${producto.Stock}.`,
            });
            return;
        }
    } else {
        if (producto.Stock >= cantidad) {
            carrito.push({ ...producto, cantidad });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Stock insuficiente',
                text: `El producto ${producto.NombreProducto} está agotado.`,
            });
            return;
        }
    }

    // Actualizar la cantidad seleccionada en el select
    document.querySelector(`.cantidad-select[data-id="${producto.IdProducto}"]`).value = cantidad;

    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarCarrito();

    Swal.fire({
        icon: 'success',
        title: 'Producto actualizado en el carrito',
        text: `${producto.NombreProducto} se ha actualizado en el carrito.`,
    });
};

// Función para actualizar la cantidad directamente desde el selector
const actualizarCantidadDirectamente = (producto, cantidadSeleccionada) => {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const cantidad = parseInt(cantidadSeleccionada, 10);

    const productoExistente = carrito.find(item => item.IdProducto === producto.IdProducto);

    if (productoExistente) {
        if (cantidad <= producto.Stock) {
            productoExistente.cantidad = cantidad;
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Stock insuficiente',
                text: `No puedes agregar más del producto ${producto.NombreProducto}. Stock disponible: ${producto.Stock}.`,
            });
            return;
        }
    } else {
        if (producto.Stock >= cantidad) {
            carrito.push({ ...producto, cantidad });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Stock insuficiente',
                text: `El producto ${producto.NombreProducto} está agotado.`,
            });
            return;
        }
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarCarrito();

    Swal.fire({
        icon: 'success',
        title: 'Cantidad actualizada',
        text: `La cantidad de ${producto.NombreProducto} se ha actualizado en el carrito.`,
    });
};



const actualizarCarrito = () => {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const shoppingList = document.querySelector('.shopping-list');
    const cartHeader = document.querySelector('.dropdown-cart-header span');
    const totalAmount = document.querySelector('.total-amount');
    const totalItems = document.querySelector('.total-items');

    let contenidoCarrito = '';
    let total = 0;
    let cantidadTotalProductos = 0;

    carrito.forEach(item => {
        total += item.PrecioProducto * item.cantidad;
        cantidadTotalProductos += item.cantidad;
        contenidoCarrito += `
            <li>
                <a href="javascript:void(0)" class="remove" data-id="${item.IdProducto}" title="Eliminar este articulo">
                    <i class="lni lni-trash-can icon-trash-large"></i>
                </a>
                <div class="cart-img-head">
                    <a class="cart-img" href="product-details.html"><img src="${item.Imagen}" alt="${item.NombreProducto}"></a>
                </div>
                <div class="content">
                    <h4><a href="product-details.html">${item.NombreProducto}</a></h4>
                    <p class="quantity">${item.cantidad}x - <span class="amount">$${item.PrecioProducto}</span></p>
                </div>
            </li>
        `;
    });

    shoppingList.innerHTML = contenidoCarrito;
    cartHeader.textContent = `${carrito.length} artículos`;
    totalAmount.textContent = `$${total.toFixed(2)}`;
    totalItems.textContent = cantidadTotalProductos;

    document.querySelectorAll('.remove').forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = event.currentTarget.getAttribute('data-id');
            eliminarProductoDelCarrito(productId);
        });
    });

    // Actualizar el catálogo para reflejar el estado actual del carrito
    listarItemsEnCatalogo();
};

const eliminarProductoDelCarrito = (productId) => {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito = carrito.filter(item => item.IdProducto != productId);

    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarCarrito();

    Swal.fire({
        icon: 'info',
        title: 'Producto eliminado',
        text: 'El producto ha sido eliminado del carrito.',
    });
};


// Inicializar catálogo y carrito
document.addEventListener('DOMContentLoaded', () => {
    listarItemsEnCatalogo();
    actualizarCarrito();
});

// Hero Slider
tns({
    container: '.hero-slider',
    slideBy: 'page',
    autoplay: true,
    autoplayButtonOutput: false,
    mouseDrag: true,
    gutter: 0,
    items: 1,
    nav: false,
    controls: true,
    controlsText: ['<i class="lni lni-chevron-left"></i>', '<i class="lni lni-chevron-right"></i>'],
});

// Brand Slider
tns({
    container: '.brands-logo-carousel',
    autoplay: true,
    autoplayButtonOutput: false,
    mouseDrag: true,
    gutter: 15,
    nav: false,
    controls: false,
    responsive: {
        0: {
            items: 1,
        },
        540: {
            items: 3,
        },
        768: {
            items: 5,
        },
        992: {
            items: 6,
        }
    }
});
