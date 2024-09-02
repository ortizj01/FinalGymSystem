document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const IdMembresia = urlParams.get('IdMembresia');
    
    if (IdMembresia) {
        try {
            const response = await fetch(`http://localhost:3000/api/membresias/${IdMembresia}`);
            if (!response.ok) throw new Error('Error al obtener los detalles de la membresía');
            
            const membresia = await response.json();
            
            document.getElementById('nombreMembresia').textContent = membresia.NombreMembresia;
            document.getElementById('frecuenciaMembresia').textContent = membresia.Frecuencia;
            document.getElementById('costoMembresia').textContent = membresia.CostoVenta.toFixed(0);
            document.getElementById('estadoMembresia').textContent = membresia.Estado === 1 ? 'Activo' : 'Inactivo';

            // Aquí podrías ajustar el video si fuese dinámico
            // document.getElementById('videoMembresia').src = membresia.VideoUrl;

            document.getElementById('agregarCarrito').addEventListener('click', () => {
                agregarAlCarrito({
                    IdProducto: null, // No es un producto, es una membresía
                    IdMembresia: membresia.IdMembresia,
                    NombreProducto: membresia.NombreMembresia,
                    PrecioProducto: membresia.CostoVenta,
                    cantidad: 1,
                    Imagen: '/themes-envio/shopgrids/assets/images/logo/membresia.png' // Puedes usar una imagen genérica
                });
            });

            // Manejo de comentarios
            const comentarios = JSON.parse(localStorage.getItem('comentariosMembresia' + IdMembresia)) || [];
            const listaComentarios = document.getElementById('listaComentarios');

            comentarios.forEach(comentario => {
                const li = document.createElement('li');
                li.innerHTML = `<strong>${comentario.nombre}</strong>: ${comentario.texto}`;
                listaComentarios.appendChild(li);
            });

            document.getElementById('btnAgregarComentario').addEventListener('click', () => {
                const nombre = document.getElementById('nombreUsuario').value;
                const texto = document.getElementById('comentarioUsuario').value;

                if (nombre && texto) {
                    const comentario = { nombre, texto };
                    comentarios.push(comentario);
                    localStorage.setItem('comentariosMembresia' + IdMembresia, JSON.stringify(comentarios));

                    const li = document.createElement('li');
                    li.innerHTML = `<strong>${nombre}</strong>: ${texto}`;
                    listaComentarios.appendChild(li);

                    document.getElementById('nombreUsuario').value = '';
                    document.getElementById('comentarioUsuario').value = '';
                }
            });

        } catch (error) {
            console.error('Error al cargar los detalles de la membresía:', error);
        }
    } else {
        console.error('No se encontró IdMembresia en la URL');
    }
});

const agregarAlCarrito = (item, cantidadSeleccionada = 1) => {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let cantidad = parseInt(cantidadSeleccionada, 10);

    const esMembresia = item.hasOwnProperty('IdMembresia');
    const itemExistente = carrito.find(i => esMembresia ? i.IdMembresia === item.IdMembresia : i.IdProducto === item.IdProducto);

    if (itemExistente) {
        itemExistente.cantidad += cantidad;
    } else {
        const nuevoItem = {
            ...item,
            cantidad,
            Imagen: esMembresia ? '/themes-envio/shopgrids/assets/images/logo/Membresia.jpg' : item.Imagen,
            IdProducto: esMembresia ? null : item.IdProducto, // Asegura que IdProducto solo sea asignado si es un producto
            IdMembresia: esMembresia ? item.IdMembresia : null // Asegura que IdMembresia solo sea asignado si es una membresía
        };
        carrito.push(nuevoItem);
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarCarrito();

    Swal.fire({
        icon: 'success',
        title: esMembresia ? 'Membresía agregada al carrito' : 'Producto agregado al carrito',
        text: `${esMembresia ? item.NombreProducto : item.NombreProducto} se ha añadido al carrito.`,
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
        const esMembresia = item.hasOwnProperty('IdMembresia');
        const nombreItem = esMembresia ? item.NombreProducto : item.NombreProducto;

        total += item.PrecioProducto * item.cantidad;
        cantidadTotalProductos += item.cantidad;
        contenidoCarrito += `
            <li class="${esMembresia ? 'membresia-item' : ''}">
                <a href="javascript:void(0)" class="remove" data-id="${esMembresia ? item.IdMembresia : item.IdProducto}" data-tipo="${esMembresia ? 'membresia' : 'producto'}" title="Eliminar este artículo">
                    <i class="lni lni-trash-can icon-trash-large"></i>
                </a>
                <div class="cart-img-head">
                    <a class="cart-img" href="product-details.html"><img src="${item.Imagen}" alt="${nombreItem}"></a>
                </div>
                <div class="content">
                    <h4><a href="product-details.html">${item.NombreProducto}</a></h4>
                    ${esMembresia ? '<span class="badge-membresia">Membresía</span>' : ''}
                    <p class="quantity">${item.cantidad}x - <span class="amount">$${item.PrecioProducto}</span></p>
                </div>
            </li>
        `;
    });

    shoppingList.innerHTML = contenidoCarrito;
    cartHeader.textContent = `${carrito.length} artículos`;
    totalAmount.textContent = `$${total.toFixed(0)}`;
    totalItems.textContent = cantidadTotalProductos;

    document.querySelectorAll('.remove').forEach(button => {
        button.addEventListener('click', (event) => {
            const id = event.currentTarget.getAttribute('data-id');
            const tipo = event.currentTarget.getAttribute('data-tipo');
            eliminarItemDelCarrito(id, tipo);
        });
    });

};


const eliminarItemDelCarrito = (id, tipo) => {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito = carrito.filter(item => tipo === 'membresia' ? item.IdMembresia != id : item.IdProducto != id);

    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarCarrito();

    Swal.fire({
        icon: 'info',
        title: `${tipo === 'membresia' ? 'Membresía eliminada' : 'Producto eliminado'}`,
        text: `El ${tipo === 'membresia' ? 'membresía' : 'producto'} ha sido eliminado del carrito.`,
    });
};


document.querySelectorAll('.agregar-al-carrito').forEach(button => {
    button.addEventListener('click', (event) => {
        const id = event.currentTarget.getAttribute('data-id');
        const tipo = event.currentTarget.getAttribute('data-tipo');
        const item = itemsCatalogo.find(i => tipo === 'membresia' ? i.IdMembresia == id : i.IdProducto == id);
        agregarAlCarrito(item, 1);
    });
});

// Inicializar carrito
document.addEventListener('DOMContentLoaded', () => {
    actualizarCarrito();
});
