function prellenarFormularioUsuario() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    if (usuario) {
        // Concatenar Nombres y Apellidos
        const nombreCompleto = `${usuario.Nombres} ${usuario.Apellidos}`;

        // Prellenar los campos del formulario
        document.getElementById('nombreCliente').value = nombreCompleto || '';
        document.getElementById('emailCliente').value = usuario.Correo || '';
        document.getElementById('telefonoCliente').value = usuario.Telefono || '';
        document.getElementById('direccionCliente').value = usuario.Direccion || '';
        document.getElementById('documentoCliente').value = usuario.Documento || '';
    } else {
        console.error('No se encontró la información del usuario en localStorage');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Prellenar el formulario cuando se carga la página
    prellenarFormularioUsuario();
});


const actualizarResumenCompra = () => {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const cartSummaryContainer = document.getElementById('cartSummary');
    const totalElement = document.getElementById('total');
    const siguientePasoContainer = document.querySelector('.price-table-btn.button'); // Selecciona el contenedor del botón "Siguiente paso"

    let contenidoResumen = '';
    let total = 0;
    let contieneMembresia = false;

    carrito.forEach(item => {
        const esMembresia = item.hasOwnProperty('IdMembresia');
        const totalProducto = item.PrecioProducto * item.cantidad;
        total += totalProducto;

        // Verifica si el item es una membresía
        if (esMembresia) {
            contieneMembresia = true;
        }

        contenidoResumen += `
            <li class="cart-summary-item mb-3 d-flex align-items-center">
                <div class="cart-img">
                    <a href="product-details.html?id=${esMembresia ? item.IdMembresia : item.IdProducto}">
                        <img src="${item.Imagen}" alt="${item.NombreProducto}" class="img-fluid" style="width: 50px; height: 50px;">
                    </a>
                </div>
                <div class="cart-summary-content ms-3">
                    <h6 class="mb-1">
                        <a href="product-details.html?id=${esMembresia ? item.IdMembresia : item.IdProducto}" class="text-dark">${item.NombreProducto}</a>
                    </h6>
                    <p class="mb-0">${item.cantidad}x - <span class="amount">$${item.PrecioProducto.toFixed(0)}</span></p>
                </div>
            </li>
        `;
    });

    cartSummaryContainer.innerHTML = contenidoResumen;

    // Actualizar total a pagar
    totalElement.textContent = `$${total.toFixed(0)}`;

    // Mostrar o ocultar el botón "Siguiente paso" según la presencia de membresías en el carrito
    if (contieneMembresia) {
        siguientePasoContainer.style.display = 'block'; // Muestra el botón si hay membresías
        siguientePasoContainer.querySelector('a').href = "ruta-a-la-configuracion"; // Asegúrate de definir la ruta adecuada
    } else {
        siguientePasoContainer.style.display = 'none'; // Oculta el botón si no hay membresías
    }
};

// Ejecutar la función al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    actualizarResumenCompra();
});
