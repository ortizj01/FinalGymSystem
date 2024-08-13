
async function cargarDatosPedido() {
    const urlParams = new URLSearchParams(window.location.search);
    const pedidoId = urlParams.get('id');

    if (!pedidoId) {
        console.error('ID del pedido no encontrado en la URL');
        return;
    }

    try {
        // Obtener datos del pedido
        const pedidoResponse = await fetch(`http://localhost:3000/api/pedidos/${pedidoId}`);
        if (!pedidoResponse.ok) throw new Error('Error al obtener datos del pedido');
        const pedido = await pedidoResponse.json();

        // Obtener datos del cliente
        const clienteResponse = await fetch(`http://localhost:3000/api/usuarios/${pedido.IdUsuario}`);
        if (!clienteResponse.ok) throw new Error('Error al obtener datos del cliente');
        const cliente = await clienteResponse.json();

        // Llenar datos del cliente en el formulario
        document.getElementById('docCliente').value = cliente.Documento;
        document.getElementById('nombreCliente').value = cliente.Nombres;
        document.getElementById('emailCliente').value = cliente.Correo;
        document.getElementById('telCliente').value = cliente.Telefono;
        document.getElementById('dirCliente').value = cliente.Direccion;
        document.getElementById('estadoCliente').value = cliente.Estado === 0 ? 'ACTIVO' : 'INACTIVO';

        // Llenar datos del pedido en campos independientes
        document.getElementById('fechaPedido').value = new Date(pedido.FechaPedido).toISOString().split('T')[0];
        const estadoPedidoMap = ["PENDIENTE DE PAGO", "PAGADO", "ENTREGADO", "ANULADO"];
        document.getElementById('estadoPedido').value = estadoPedidoMap[pedido.EstadoPedido];

        // Cargar productos y servicios del pedido
        await cargarProductosPedido(pedidoId);
        await cargarServiciosPedido(pedidoId);

        calcularTotalPedido();

    } catch (error) {
        console.error('Error al cargar datos del pedido:', error);
    }
}

async function cargarProductosPedido(pedidoId) {
    try {
        const productosPedidoResponse = await fetch(`http://localhost:3000/api/pedidos/${pedidoId}/productos`);
        if (!productosPedidoResponse.ok) throw new Error('Error al obtener productos del pedido');
        const productosPedido = await productosPedidoResponse.json();

        const tablaProductos = document.getElementById('tablaProductos');
        tablaProductos.innerHTML = ''; // Limpiar contenido previo

        let total = 0;
        for (const producto of productosPedido) {
            const productoResponse = await fetch(`http://localhost:3000/api/productos/${producto.IdProducto}`);
            const productoData = await productoResponse.json();
            
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${productoData.NombreProducto}</td>
                <td>${formatearCOP(productoData.PrecioProducto)}</td>
                <td>${producto.Cantidad}</td>
                <td>${formatearCOP(productoData.PrecioProducto * producto.Cantidad)}</td>
            `;
            total += productoData.PrecioProducto * producto.Cantidad;
            tablaProductos.appendChild(fila);
        }

        document.getElementById('totalProductos').textContent = formatearCOP(total);
        document.getElementById('totalProductos').dataset.valor = total;
    } catch (error) {
        console.error('Error al cargar productos del pedido:', error);
    }
}

async function cargarServiciosPedido(pedidoId) {
    try {
        const serviciosPedidoResponse = await fetch(`http://localhost:3000/api/pedidosMembresia`);
        if (!serviciosPedidoResponse.ok) throw new Error('Error al obtener servicios del pedido');
        const serviciosPedido = await serviciosPedidoResponse.json();
        const serviciosPedidoFiltrados = serviciosPedido.filter(s => s.IdPedido == pedidoId);

        const tablaServicios = document.getElementById('tablaServicios');
        tablaServicios.innerHTML = ''; // Limpiar contenido previo

        let total = 0;
        for (const servicioPedido of serviciosPedidoFiltrados) {
            const membresiaResponse = await fetch(`http://localhost:3000/api/membresias/${servicioPedido.IdMembresia}`);
            const membresia = await membresiaResponse.json();
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${membresia.NombreMembresia}</td>
                <td>${formatearCOP(membresia.CostoVenta)}</td>
                <td>1</td>
                <td>${formatearCOP(servicioPedido.Total)}</td>
            `;
            total += parseFloat(servicioPedido.Total);
            tablaServicios.appendChild(fila);

            // Mostrar información de todos los beneficiarios
            const beneficiarioResponse = await fetch(`http://localhost:3000/api/usuarios/${servicioPedido.IdUsuario}`);
            const beneficiario = await beneficiarioResponse.json();

            // Crear acordeón para cada beneficiario
            const beneficiarioElemento = document.createElement('li');
            beneficiarioElemento.innerHTML = `
                <h6 class="title" data-bs-toggle="collapse" data-bs-target="#collapseBeneficiarioAcc_${servicioPedido.IdPedidoMembresia}"
                    aria-expanded="true" aria-controls="collapseBeneficiarioAcc_${servicioPedido.IdPedidoMembresia}">Datos Beneficiario (${beneficiario.Nombres} ${beneficiario.Apellidos})</h6>
                <section class="checkout-steps-form-content collapse" id="collapseBeneficiarioAcc_${servicioPedido.IdPedidoMembresia}"
                    aria-labelledby="headingBeneficiarioAcc_${servicioPedido.IdPedidoMembresia}" data-bs-parent="#accordionBeneficiario">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="single-form form-default">
                                <label for="docBeneficiarioAcc_${servicioPedido.IdPedidoMembresia}">Documento</label>
                                <div class="form-input form">
                                    <input type="text" id="docBeneficiarioAcc_${servicioPedido.IdPedidoMembresia}" value="${beneficiario.Documento}" readonly>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="single-form form-default">
                                <label for="nombreBeneficiarioAcc_${servicioPedido.IdPedidoMembresia}">Nombre</label>
                                <div class="form-input form">
                                    <input type="text" id="nombreBeneficiarioAcc_${servicioPedido.IdPedidoMembresia}" value="${beneficiario.Nombres} ${beneficiario.Apellidos}" readonly>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="single-form form-default">
                                <label for="emailBeneficiarioAcc_${servicioPedido.IdPedidoMembresia}">Correo electrónico</label>
                                <div class="form-input form">
                                    <input type="email" id="emailBeneficiarioAcc_${servicioPedido.IdPedidoMembresia}" value="${beneficiario.Correo}" readonly>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="single-form form-default">
                                <label for="telBeneficiarioAcc_${servicioPedido.IdPedidoMembresia}">Teléfono</label>
                                <div class="form-input form">
                                    <input type="text" id="telBeneficiarioAcc_${servicioPedido.IdPedidoMembresia}" value="${beneficiario.Telefono}" readonly>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="single-form form-default">
                                <label for="dirBeneficiarioAcc_${servicioPedido.IdPedidoMembresia}">Dirección</label>
                                <div class="form-input form">
                                    <input type="text" id="dirBeneficiarioAcc_${servicioPedido.IdPedidoMembresia}" value="${beneficiario.Direccion}" readonly>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="single-form form-default">
                                <label for="estadoBeneficiarioAcc_${servicioPedido.IdPedidoMembresia}">Estado</label>
                                <div class="form-input form">
                                    <input type="text" id="estadoBeneficiarioAcc_${servicioPedido.IdPedidoMembresia}" value="${beneficiario.Estado === 0 ? 'ACTIVO' : 'INACTIVO'}" readonly>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            `;
            document.getElementById('accordionBeneficiario').appendChild(beneficiarioElemento);
        }

        document.getElementById('totalServicios').textContent = formatearCOP(total);
        document.getElementById('totalServicios').dataset.valor = total;
    } catch (error) {
        console.error('Error al cargar servicios del pedido:', error);
    }
}

// Función para calcular el total del pedido
const calcularTotalPedido = () => {
    const totalProductos = parseFloat(document.getElementById('totalProductos').dataset.valor) || 0;
    const totalServicios = parseFloat(document.getElementById('totalServicios').dataset.valor) || 0;
    const totalPedido = totalProductos + totalServicios;

    document.getElementById('totalPedido').textContent = formatearCOP(totalPedido);
    document.getElementById('totalPedido').dataset.valor = totalPedido;
}

// Función para formatear valores en pesos colombianos
const formatearCOP = (valor) => {
    return '$' + Math.round(valor).toLocaleString('es-CO');
}


document.addEventListener('DOMContentLoaded', () => {
    cargarDatosPedido();
});
