// Función para obtener productos del localStorage y mostrarlos en el catálogo
const listarProductosEnCatalogo = async () => {
    const productosCatalogo = JSON.parse(localStorage.getItem('productosCatalogo')) || [];
    const categorias = await obtenerCategorias();

    const contenedorProductos = document.getElementById('contenedorProductos');
    if (!contenedorProductos) {
        console.error('No se encontró el elemento con id "contenedorProductos"');
        return;
    }

    let contenidoProductos = '';

    productosCatalogo.forEach(producto => {
        const categoria = categorias.find(cat => cat.IdCategoriaProductos === producto.IdCategoriaProductos);
        const nombreCategoria = categoria ? categoria.NombreCategoriaProductos : 'Sin categoría';

        contenidoProductos += `
            <div class="col-lg-3 col-md-6 col-12">
                <div class="single-product">
                    <div class="product-image">
                        <img src="${producto.Imagen}" alt="${producto.NombreProducto}">
                        <div class="button">
                            ${producto.Stock > 0 ? 
                                `<a href="javascript:void(0)" class="btn agregar-al-carrito" data-id="${producto.IdProducto}"><i class="lni lni-cart"></i> Agregar al carrito</a>` :
                                `<span class="agotado">Agotado</span>`
                            }
                        </div>
                    </div>
                    <div class="product-info">
                        <span class="category">${nombreCategoria}</span>
                        <h4 class="title">
                            <a href="product-grids.html">${producto.NombreProducto}</a>
                        </h4>
                        <div class="price">
                            <span>$${producto.PrecioProducto}</span>
                            ${producto.PrecioOriginal ? `<span class="discount-price">$${producto.PrecioOriginal}</span>` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    contenedorProductos.innerHTML = contenidoProductos;

    document.querySelectorAll('.agregar-al-carrito').forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = event.currentTarget.getAttribute('data-id');
            const producto = productosCatalogo.find(prod => prod.IdProducto == productId);
            agregarAlCarrito(producto);
        });
    });
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

// Función para agregar un producto al carrito
const agregarAlCarrito = (producto) => {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    const productoExistente = carrito.find(item => item.IdProducto === producto.IdProducto);

    if (productoExistente) {
        if (productoExistente.cantidad < producto.Stock) {
            productoExistente.cantidad += 1;
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Stock insuficiente',
                text: `No se puede agregar más del producto ${producto.NombreProducto}. Stock disponible: ${producto.Stock}.`,
            });
            return;
        }
    } else {
        if (producto.Stock > 0) {
            carrito.push({ ...producto, cantidad: 1 });
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

    Swal.fire({
        icon: 'success',
        title: 'Producto agregado al carrito',
        text: `${producto.NombreProducto} se ha añadido al carrito.`,
    });

    actualizarCarrito();
};

// Función para actualizar la visualización del carrito
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
    totalAmount.textContent = `$${Math.round(total)}`;

    totalItems.textContent = cantidadTotalProductos;

    document.querySelectorAll('.remove').forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = event.currentTarget.getAttribute('data-id');
            eliminarProductoDelCarrito(productId);
        });
    });
};

// Función para eliminar producto del carrito
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
    listarProductosEnCatalogo();
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
