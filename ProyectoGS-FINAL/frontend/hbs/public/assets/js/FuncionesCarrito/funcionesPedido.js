function prellenarFormularioUsuario() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    if (usuario) {
        const nombreCompleto = `${usuario.Nombres} ${usuario.Apellidos}`;

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
    prellenarFormularioUsuario();
    actualizarResumenCompra();
});

const actualizarResumenCompra = () => {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const cartSummaryContainer = document.getElementById('cartSummary');
    const totalElement = document.getElementById('total');
    const siguientePasoBtn = document.getElementById('siguientePasoBtn');
    const volverBtn = document.getElementById('volverBtn');
    const acordeonPersonalData = document.getElementById('acordeonPersonalData');
    const acordeonMembresias = document.getElementById('acordeonMembresias');
    const membresiaContainer = document.getElementById('membresiaContainer');
    
    let contenidoResumen = '';
    let total = 0;
    let contieneMembresia = false;

    carrito.forEach(item => {
        const esMembresia = item.hasOwnProperty('IdMembresia');
        const totalProducto = item.PrecioProducto * item.cantidad;
        total += totalProducto;

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
    totalElement.textContent = `$${total.toFixed(0)}`;

    if (contieneMembresia) {
        siguientePasoBtn.classList.remove('disabled');
        siguientePasoBtn.addEventListener('click', () => {
            acordeonPersonalData.style.display = 'none';
            acordeonMembresias.style.display = 'block';
            document.getElementById('collapseMembresias').classList.add('show');
            mostrarMembresias(carrito);
        });
    } else {
        siguientePasoBtn.classList.add('disabled');
        siguientePasoBtn.removeEventListener('click', null);
        membresiaContainer.innerHTML = '';
    }

    volverBtn.addEventListener('click', () => {
        acordeonMembresias.style.display = 'none';
        acordeonPersonalData.style.display = 'block';
        document.getElementById('collapsePersonalData').classList.add('show');
    });
};

const mostrarMembresias = (carrito) => {
    const membresiaContainer = document.getElementById('membresiaContainer');
    let contenidoMembresias = '';

    carrito.forEach(item => {
        if (item.hasOwnProperty('IdMembresia')) {
            contenidoMembresias += `
                <div class="membresia-single-item mb-3 d-flex align-items-center">
                    <div class="col-lg-4 col-md-4 col-12">
                        <div class="membresia-img">
                            <img src="${item.Imagen}" alt="${item.NombreProducto}" class="img-fluid" style="width: 50px; height: 50px;">
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-4 col-12">
                        <div class="membresia-content ms-3">
                            <h6 class="mb-1">${item.NombreProducto}</h6>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-4 col-12">
                        <input type="text" class="form-control" placeholder="Documento del Beneficiario">
                    </div>
                </div>
            `;
        }
    });

    membresiaContainer.innerHTML = contenidoMembresias;
};
