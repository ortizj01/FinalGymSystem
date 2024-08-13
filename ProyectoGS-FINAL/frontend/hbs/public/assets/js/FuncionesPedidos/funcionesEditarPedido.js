//FUNCIONES PARA ESTADO Y FECHA
// Función para calcular el total del pedido
const calcularTotalPedido = () => {
    const totalProductos = parseFloat(document.getElementById('totalProductos').dataset.valor) || 0;
    const totalServicios = parseFloat(document.getElementById('totalServicios').dataset.valor) || 0;
    const totalPedido = totalProductos + totalServicios;

    document.getElementById('totalPedido').value = formatearCOP(totalPedido);
    document.getElementById('totalPedido').dataset.valor = totalPedido;
}

// Función para formatear valores en pesos colombianos
const formatearCOP = (valor) => {
    return '$' + Math.round(valor).toLocaleString('es-CO');
}

// Función para formatear valores sin decimales
const formatearValor = (valor) => {
    return Math.round(valor).toLocaleString('es-CO');
}

// Función para guardar cambios en el pedido
const guardarCambios = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const pedidoId = urlParams.get('id');

    if (!pedidoId) {
        console.error('ID del pedido no encontrado en la URL');
        return;
    }

    const fechaPedido = document.querySelector('input[name="fechaPedido"]').value;
    const estadoPedido = document.querySelector('select[name="estadoPedido"]').value;

    // Convertir el estadoPedido a su valor numérico correspondiente
    const estadoPedidoMap = {
        "PENDIENTE DE PAGO": 0,
        "PAGADO": 1,
        "ENTREGADO": 2,
        "ANULADO": 3
    };

    const estadoPedidoValor = estadoPedidoMap[estadoPedido];
    const totalPedido = parseFloat(document.getElementById('totalPedido').dataset.valor);

    const pedidoData = {
        FechaPedido: fechaPedido,
        EstadoPedido: estadoPedidoValor,
        Total: totalPedido
    };

    try {
        const response = await fetch(`http://localhost:3000/api/pedidos/estado-fecha/${pedidoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pedidoData)
        });

        if (!response.ok) {
            throw new Error('Error al actualizar el pedido');
        }

        Swal.fire({
            title: "¡Excelente!",
            text: "Pedido actualizado correctamente",
            icon: "success",
        }).then(() => {
            window.location.href = '/pedidos';
        });
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "¡Oops...",
            text: "Error al guardar los cambios: " + error.message
        });
    }
};

//FUNCIONES PARA PRODUCTOS

// Función para cargar datos del pedido y del cliente
const cargarDatosPedido = async () => {
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

        // Llenar datos del pedido en el formulario
        document.querySelector('input[name="fechaPedido"]').value = new Date(pedido.FechaPedido).toISOString().split('T')[0];
        const estadoPedidoSelect = document.querySelector('select[name="estadoPedido"]');
        estadoPedidoSelect.value = ["PENDIENTE DE PAGO", "PAGADO", "ENTREGADO", "ANULADO"][pedido.EstadoPedido];

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

        // Obtener productos del pedido
        const productosPedidoResponse = await fetch(`http://localhost:3000/api/pedidos/${pedidoId}/productos`);
        if (!productosPedidoResponse.ok) throw new Error('Error al obtener productos del pedido');
        const productosPedido = await productosPedidoResponse.json();

        // Obtener todos los productos y categorías
        const todosProductosResponse = await fetch(`http://localhost:3000/api/productos`);
        todosProductos = await todosProductosResponse.json();
        const categoriasResponse = await fetch(`http://localhost:3000/api/categorias`);
        const categorias = await categoriasResponse.json();

        const productosContainer = document.getElementById('productosContainer');
        productosContainer.innerHTML = ''; // Limpiar contenedor de productos

        productosIniciales = productosPedido; // Guardar los productos iniciales para el manejo de cambios

        // Inicializar productos en el pedido actual
        productosPedidoActual = {};

        for (const productoPedido of productosPedido) {
            const producto = todosProductos.find(p => p.IdProducto === productoPedido.IdProducto);
            if (producto) {
                const categoria = categorias.find(cat => cat.IdCategoriaProductos === producto.IdCategoriaProductos);
                const productoElemento = document.createElement('div');
                productoElemento.classList.add('productoItem', 'col-12');
                productoElemento.dataset.idProductoPedido = productoPedido.IdPedidoProducto;
                productoElemento.dataset.productoId = producto.IdProducto;
                productoElemento.dataset.cantidad = productoPedido.Cantidad; // Guardar cantidad inicial

                // Almacenar la cantidad actual de productos en el pedido
                if (!productosPedidoActual[producto.IdProducto]) {
                    productosPedidoActual[producto.IdProducto] = 0;
                }
                productosPedidoActual[producto.IdProducto] += productoPedido.Cantidad;

                productoElemento.innerHTML = `
                    <div class="form-group formularioRegistro2__grupo">
                        <label for="categoriaProducto_${producto.IdProducto}" class="formularioRegistro2__label">Categoría:</label>
                        <select id="categoriaProducto_${producto.IdProducto}" class="form-select" onchange="filtrarProductos(this, ${producto.IdProducto})">
                            ${categorias.map(cat => `<option value="${cat.IdCategoriaProductos}" ${cat.IdCategoriaProductos === producto.IdCategoriaProductos ? 'selected' : ''}>${cat.NombreCategoriaProductos}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group formularioRegistro2__grupo">
                        <label for="selectProducto_${producto.IdProducto}" class="formularioRegistro2__label">Producto:</label>
                        <select id="selectProducto_${producto.IdProducto}" name="productos[]" class="form-select" onchange="actualizarDatosProducto(this, ${producto.IdProducto})">
                            ${todosProductos.filter(p => p.IdCategoriaProductos === producto.IdCategoriaProductos).map(p => `<option value="${p.IdProducto}" ${p.IdProducto === producto.IdProducto ? 'selected' : ''}>${p.NombreProducto}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group formularioRegistro2__grupo">
                        <label for="cantidadProducto_${producto.IdProducto}" class="formularioRegistro2__label">Cantidad:</label>
                        <input type="number" id="cantidadProducto_${producto.IdProducto}" class="form-control" name="cantidades[]" value="${productoPedido.Cantidad}" min="1" max="${producto.Stock}" style="width: 90px;" onchange="actualizarSubTotalProducto(this, ${producto.IdProducto})">
                    </div>
                    <div class="form-group formularioRegistro2__grupo">
                        <label for="valorProducto_${producto.IdProducto}" class="formularioRegistro2__label">Valor:</label>
                        <input type="text" id="valorProducto_${producto.IdProducto}" class="form-control" value="${producto.PrecioProducto}" style="width: 90px;" readonly>
                    </div>
                    <div class="form-group formularioRegistro2__grupo">
                        <label for="subTotalProducto_${producto.IdProducto}" class="formularioRegistro2__label">Sub Total:</label>
                        <input type="text" id="subTotalProducto_${producto.IdProducto}" class="form-control" value="${formatearValor(productoPedido.Cantidad * producto.PrecioProducto)}" data-valor="${productoPedido.Cantidad * producto.PrecioProducto}" style="width: 90px;" readonly>
                    </div>
                    <button type="button" class="btn btn-danger mt-2" onclick="eliminarProducto(this)">
                        <i class="fa-solid fa-minus fa-lg"></i>
                    </button>
                `;
                productosContainer.appendChild(productoElemento);
            }
        }

        // Calcular el total general
        calcularTotalGeneralProductos();
        calcularTotalPedido();

    } catch (error) {
        console.error('Error al cargar datos del pedido:', error);
    }
};

// Función para agregar un producto al pedido
const agregarProducto = async () => {
    const productosContainer = document.getElementById('productosContainer');
    const productoElemento = document.createElement('div');
    const uniqueId = Date.now(); // Generar un ID único basado en el timestamp
    productoElemento.classList.add('productoItem', 'col-12');
    productoElemento.dataset.idProductoPedido = `nuevo-${uniqueId}`;
    productoElemento.innerHTML = `
        <div class="form-group formularioRegistro2__grupo">
            <label for="categoriaProducto_${uniqueId}" class="formularioRegistro2__label">Categoría:</label>
            <select id="categoriaProducto_${uniqueId}" class="form-select" onchange="filtrarProductos(this, '${uniqueId}')">
                <option selected disabled>Seleccione una categoría</option>
                <!-- Aquí se añadirán las categorías disponibles -->
            </select>
        </div>
        <div class="form-group formularioRegistro2__grupo">
            <label for="selectProducto_${uniqueId}" class="formularioRegistro2__label">Producto:</label>
            <select id="selectProducto_${uniqueId}" name="productos[]" class="form-select" disabled onchange="actualizarDatosProducto(this, '${uniqueId}')">
                <option selected disabled>Seleccione un producto</option>
            </select>
        </div>
        <div class="form-group formularioRegistro2__grupo">
            <label for="cantidadProducto_${uniqueId}" class="formularioRegistro2__label">Cantidad:</label>
            <input type="number" id="cantidadProducto_${uniqueId}" class="form-control" name="cantidades[]" value="1" min="1" style="width: 90px;" onchange="actualizarSubTotalProducto(this, '${uniqueId}')">
        </div>
        <div class="form-group formularioRegistro2__grupo">
            <label for="valorProducto_${uniqueId}" class="formularioRegistro2__label">Valor:</label>
            <input type="text" id="valorProducto_${uniqueId}" class="form-control" style="width: 90px;" readonly>
        </div>
        <div class="form-group formularioRegistro2__grupo">
            <label for="subTotalProducto_${uniqueId}" class="formularioRegistro2__label">Sub Total:</label>
            <input type="text" id="subTotalProducto_${uniqueId}" class="form-control" style="width: 90px;" readonly>
        </div>
        <button type="button" class="btn btn-danger mt-2" onclick="eliminarProducto(this)">
            <i class="fa-solid fa-minus fa-lg"></i> Eliminar
        </button>
    `;
    productosContainer.appendChild(productoElemento);

    // Obtener categorías disponibles y llenar el select
    try {
        const categoriasResponse = await fetch(`http://localhost:3000/api/categorias`);
        const categorias = await categoriasResponse.json();
        const selectCategoria = document.getElementById(`categoriaProducto_${uniqueId}`);
        categorias.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria.IdCategoriaProductos;
            option.text = categoria.NombreCategoriaProductos;
            selectCategoria.appendChild(option);
        });
    } catch (error) {
        console.error('Error al obtener categorías:', error);
    }
};

// Función para filtrar productos según la categoría seleccionada
const filtrarProductos = async (selectCategoria, idProducto) => {
    const categoriaId = selectCategoria.value;
    const selectProducto = document.getElementById(`selectProducto_${idProducto}`);

    try {
        const productosResponse = await fetch(`http://localhost:3000/api/productos`);
        const productos = await productosResponse.json();
        const productosFiltrados = productos.filter(producto => producto.IdCategoriaProductos === parseInt(categoriaId));

        selectProducto.innerHTML = '<option selected disabled>Seleccione un producto</option>'; // Limpiar opciones previas
        productosFiltrados.forEach(producto => {
            const option = document.createElement('option');
            option.value = producto.IdProducto;
            option.text = producto.NombreProducto;
            selectProducto.appendChild(option);
        });
        selectProducto.disabled = false;
    } catch (error) {
        console.error('Error al obtener productos:', error);
    }
};

// Función para actualizar datos del producto seleccionado
const actualizarDatosProducto = async (selectProducto, idProducto) => {
    const productoId = selectProducto.value;
    const cantidadInput = document.getElementById(`cantidadProducto_${idProducto}`);
    const valorInput = document.getElementById(`valorProducto_${idProducto}`);

    try {
        const productoResponse = await fetch(`http://localhost:3000/api/productos/${productoId}`);
        const producto = await productoResponse.json();

        if (verificarStockProducto(productoId, producto.Stock)) {
            cantidadInput.max = producto.Stock;
            valorInput.value = producto.PrecioProducto;

            // Verificar si el producto ya existe en el pedido
            if (productoYaEnPedido(productoId)) {
                Swal.fire({
                    icon: 'error',
                    title: 'Producto ya en pedido',
                    text: `El producto ${producto.NombreProducto} ya está en el pedido. Por favor, actualice la cantidad del producto existente.`,
                });
                selectProducto.value = ''; // Limpiar selección
                cantidadInput.value = '1'; // Resetear la cantidad
                valorInput.value = ''; // Resetear el valor
                return;
            }

            actualizarSubTotalProducto(cantidadInput, idProducto); // Actualizar el subtotal cuando se selecciona un producto
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Stock insuficiente',
                text: `El stock disponible de ${producto.NombreProducto} es ${producto.Stock}`,
            });
            selectProducto.value = ''; // Limpiar selección
        }
    } catch (error) {
        console.error('Error al obtener datos del producto:', error);
    }
};

// Función para verificar si el producto ya está en el pedido
const productoYaEnPedido = (productoId) => {
    const productosItems = document.querySelectorAll('.productoItem');
    for (const item of productosItems) {
        const selectProducto = item.querySelector('.form-select[name="productos[]"]');
        if (selectProducto && selectProducto.value === productoId.toString()) {
            return true;
        }
    }
    return false;
};

// Función para verificar el stock del producto
const verificarStockProducto = (productoId, stockDisponible) => {
    const productosItems = document.querySelectorAll('.productoItem');
    let cantidadTotal = 0;

    productosItems.forEach(item => {
        const selectProducto = item.querySelector('.form-select[name="productos[]"]');
        const cantidadInput = item.querySelector('input[name="cantidades[]"]');
        if (selectProducto && selectProducto.value === productoId.toString()) {
            cantidadTotal += parseInt(cantidadInput.value) || 0;
        }
    });

    return cantidadTotal <= stockDisponible;
};

// Función para actualizar el subtotal del producto basado en la cantidad
const actualizarSubTotalProducto = (cantidadInput, idProducto) => {
    const cantidad = cantidadInput.value;
    const valorInput = document.getElementById(`valorProducto_${idProducto}`);
    const subTotalInput = document.getElementById(`subTotalProducto_${idProducto}`);
    const valor = parseFloat(valorInput.value);

    const subTotal = valor * cantidad;
    subTotalInput.value = formatearValor(subTotal);
    subTotalInput.dataset.valor = subTotal;

    // Calcular el total general
    calcularTotalGeneralProductos();
    calcularTotalPedido();
};

// Función para eliminar un producto del pedido
const eliminarProducto = (btn) => {
    const productoItem = btn.closest('.productoItem');
    const productoId = productoItem.dataset.productoId;
    const cantidadEliminada = parseInt(productoItem.querySelector('input[name="cantidades[]"]').value);

    // Restituir cantidad eliminada al stock
    if (productosPedidoActual[productoId]) {
        productosPedidoActual[productoId] -= cantidadEliminada;
    }

    productoItem.remove();

    // Calcular el total general
    calcularTotalGeneralProductos();
    calcularTotalPedido();
};

// Función para calcular el total general de todos los productos
const calcularTotalGeneralProductos = () => {
    const subTotalInputs = document.querySelectorAll('input[id^="subTotalProducto_"]');
    let totalGeneral = 0;
    subTotalInputs.forEach(input => {
        totalGeneral += parseFloat(input.dataset.valor) || 0;
    });

    document.getElementById('totalProductos').value = formatearCOP(totalGeneral);
    document.getElementById('totalProductos').dataset.valor = totalGeneral;
};

// Función para guardar cambios en los productos del pedido
const guardarCambiosProductos = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const pedidoId = urlParams.get('id');

    if (!pedidoId) {
        console.error('ID del pedido no encontrado en la URL');
        return;
    }

    const productosContainer = document.getElementById('productosContainer');
    const productosItems = productosContainer.querySelectorAll('.productoItem');
    const productosNuevos = [];
    const productosEliminados = [];

    // Recorrer los productos iniciales para identificar los eliminados
    productosIniciales.forEach(productoInicial => {
        const item = Array.from(productosItems).find(item => parseInt(item.dataset.idProductoPedido) === productoInicial.IdPedidoProducto);
        if (!item) {
            productosEliminados.push(productoInicial.IdPedidoProducto);
        }
    });

    // Recorrer los productos actuales para identificar los nuevos y actualizados
    productosItems.forEach(item => {
        const idProductoPedido = item.dataset.idProductoPedido;
        const categoriaSelect = item.querySelector('.form-select[id^="categoriaProducto_"]');
        const productoSelect = item.querySelector('.form-select[id^="selectProducto_"]');
        const cantidadInput = item.querySelector('input[id^="cantidadProducto_"]');
        const valorInput = item.querySelector('input[id^="valorProducto_"]');

        const productoData = {
            IdPedido: pedidoId,
            IdProducto: productoSelect.value,
            Cantidad: cantidadInput.value,
            Total: valorInput.value
        };

        if (idProductoPedido.startsWith('nuevo-')) {
            productosNuevos.push(productoData);
        } else {
            const productoInicial = productosIniciales.find(p => p.IdPedidoProducto === parseInt(idProductoPedido));
            if (productoInicial) {
                if (
                    productoInicial.IdProducto !== productoData.IdProducto ||
                    productoInicial.Cantidad !== productoData.Cantidad ||
                    productoInicial.Total !== productoData.Total
                ) {
                    // Producto actualizado
                    productoData.IdPedidoProducto = productoInicial.IdPedidoProducto;
                    productosNuevos.push(productoData); // Usar productosNuevos para mantener todo junto
                }
            }
        }
    });

    try {
        // Eliminar productos
        for (const idProductoPedido of productosEliminados) {
            await fetch(`http://localhost:3000/api/pedidosProducto/${idProductoPedido}`, {
                method: 'DELETE'
            });
        }

        // Agregar o actualizar productos
        for (const productoData of productosNuevos) {
            if (productoData.IdPedidoProducto) {
                // Actualizar producto
                await fetch(`http://localhost:3000/api/pedidosProducto/${productoData.IdPedidoProducto}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(productoData)
                });
            } else {
                // Agregar producto
                await fetch('http://localhost:3000/api/pedidosProducto', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(productoData)
                });
            }
        }

        Swal.fire({
            title: "¡Excelente!",
            text: "Productos Actualizados Correctamente!",
            icon: "success",
        }).then(() => {
            window.location.reload();
        });

    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "¡Oops...",
            text: "Error al guardar los cambios: " + error.message
        });
    }
};


//FUNCIONES PARA SERVICIOS

// Función para cargar datos de servicios (membresías)
const cargarDatosServicios = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const pedidoId = urlParams.get('id');

    if (!pedidoId) {
        console.error('ID del pedido no encontrado en la URL');
        return;
    }

    try {
        // Obtener servicios del pedido
        const serviciosPedidoResponse = await fetch(`http://localhost:3000/api/pedidosMembresia`);
        if (!serviciosPedidoResponse.ok) throw new Error('Error al obtener servicios del pedido');
        const serviciosPedido = await serviciosPedidoResponse.json();
        const serviciosPedidoFiltrados = serviciosPedido.filter(s => s.IdPedido == pedidoId);

        // Obtener todas las membresías
        const todasMembresiasResponse = await fetch(`http://localhost:3000/api/membresias`);
        const todasMembresias = await todasMembresiasResponse.json();

        const serviciosContainer = document.getElementById('serviciosContainer');
        serviciosContainer.innerHTML = ''; // Limpiar contenedor de servicios

        serviciosIniciales = serviciosPedidoFiltrados; // Guardar los servicios iniciales para el manejo de cambios

        for (const servicioPedido of serviciosPedidoFiltrados) {
            const membresia = todasMembresias.find(m => m.IdMembresia === servicioPedido.IdMembresia);
            if (membresia) {
                const servicioElemento = document.createElement('div');
                servicioElemento.classList.add('servicioItem', 'col-12');
                servicioElemento.dataset.idServicioPedido = servicioPedido.IdPedidoMembresia;
                servicioElemento.innerHTML = `
                    <div class="form-group formularioRegistro2__grupo">
                        <label for="selectMembresia_${servicioPedido.IdPedidoMembresia}" class="formularioRegistro2__label">Membresía:</label>
                        <select id="selectMembresia_${servicioPedido.IdPedidoMembresia}" name="membresias[]" class="form-select" onchange="actualizarDatosMembresia(this, ${servicioPedido.IdPedidoMembresia})">
                            ${todasMembresias.map(m => `<option value="${m.IdMembresia}" ${m.IdMembresia === membresia.IdMembresia ? 'selected' : ''}>${m.NombreMembresia}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group formularioRegistro2__grupo">
                        <label for="docBeneficiario_${servicioPedido.IdPedidoMembresia}" class="formularioRegistro2__label">Documento Beneficiario:</label>
                        <input type="text" id="docBeneficiario_${servicioPedido.IdPedidoMembresia}" class="form-control" oninput="buscarBeneficiarioServicio(${servicioPedido.IdPedidoMembresia})" pattern="\\d*" value="${await obtenerDocumentoBeneficiario(servicioPedido.IdUsuario)}">
                        <input type="hidden" id="beneficiarioId_${servicioPedido.IdPedidoMembresia}" value="${servicioPedido.IdUsuario}">
                        <label for="nombreBeneficiario_${servicioPedido.IdPedidoMembresia}" class="formularioRegistro2__label">Nombre Beneficiario:</label>
                        <input type="text" id="nombreBeneficiario_${servicioPedido.IdPedidoMembresia}" class="form-control" readonly value="${await obtenerNombreBeneficiario(servicioPedido.IdUsuario)}">
                    </div>
                    <div id="resultadosBusqueda_${servicioPedido.IdPedidoMembresia}" class="list-group mt-2"></div>
                    <div class="form-group formularioRegistro2__grupo">
                        <label for="fechaInicio_${servicioPedido.IdPedidoMembresia}" class="formularioRegistro2__label">Fecha Inicio:</label>
                        <input type="date" id="fechaInicio_${servicioPedido.IdPedidoMembresia}" class="form-control" name="fechasInicio[]" value="${new Date(servicioPedido.FechaInicio).toISOString().split('T')[0]}">
                    </div>
                    <div class="form-group formularioRegistro2__grupo">
                        <label for="fechaFin_${servicioPedido.IdPedidoMembresia}" class="formularioRegistro2__label">Fecha Fin:</label>
                        <input type="date" id="fechaFin_${servicioPedido.IdPedidoMembresia}" class="form-control" name="fechasFin[]" value="${new Date(servicioPedido.FechaFin).toISOString().split('T')[0]}">
                    </div>
                    <div class="form-group formularioRegistro2__grupo">
                        <label for="totalServicio_${servicioPedido.IdPedidoMembresia}" class="formularioRegistro2__label">Total:</label>
                        <input type="text" id="totalServicio_${servicioPedido.IdPedidoMembresia}" class="form-control" value="${servicioPedido.Total}" data-valor="${servicioPedido.Total}" style="width: 90px;" readonly>
                    </div>
                    <button type="button" class="btn btn-danger mt-2" onclick="eliminarServicio(this)">
                        <i class="fa-solid fa-minus fa-lg"></i>
                    </button>
                `;
                serviciosContainer.appendChild(servicioElemento);

                // Crear acordeón de beneficiario
                const beneficiarioElemento = document.createElement('li');
                beneficiarioElemento.innerHTML = `
                    <h6 class="title" data-bs-toggle="collapse" data-bs-target="#collapseBeneficiarioAcc_${servicioPedido.IdPedidoMembresia}"
                        aria-expanded="true" aria-controls="collapseBeneficiarioAcc_${servicioPedido.IdPedidoMembresia}">Datos Beneficiario (${await obtenerNombreBeneficiario(servicioPedido.IdUsuario)})</h6>
                    <section class="checkout-steps-form-content collapse" id="collapseBeneficiarioAcc_${servicioPedido.IdPedidoMembresia}"
                        aria-labelledby="headingBeneficiarioAcc_${servicioPedido.IdPedidoMembresia}" data-bs-parent="#accordionBeneficiario">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="single-form form-default">
                                    <label for="docBeneficiarioAcc_${servicioPedido.IdPedidoMembresia}">Documento</label>
                                    <div class="form-input form">
                                        <input type="text" id="docBeneficiarioAcc_${servicioPedido.IdPedidoMembresia}" value="${await obtenerDocumentoBeneficiario(servicioPedido.IdUsuario)}" readonly>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="single-form form-default">
                                    <label for="nombreBeneficiarioAcc_${servicioPedido.IdPedidoMembresia}">Nombre</label>
                                    <div class="form-input form">
                                        <input type="text" id="nombreBeneficiarioAcc_${servicioPedido.IdPedidoMembresia}" value="${await obtenerNombreBeneficiario(servicioPedido.IdUsuario)}" readonly>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="single-form form-default">
                                    <label for="emailBeneficiarioAcc_${servicioPedido.IdPedidoMembresia}">Correo electrónico</label>
                                    <div class="form-input form">
                                        <input type="email" id="emailBeneficiarioAcc_${servicioPedido.IdPedidoMembresia}" value="${await obtenerCorreoBeneficiario(servicioPedido.IdUsuario)}" readonly>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="single-form form-default">
                                    <label for="telBeneficiarioAcc_${servicioPedido.IdPedidoMembresia}">Teléfono</label>
                                    <div class="form-input form">
                                        <input type="text" id="telBeneficiarioAcc_${servicioPedido.IdPedidoMembresia}" value="${await obtenerTelefonoBeneficiario(servicioPedido.IdUsuario)}" readonly>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="single-form form-default">
                                    <label for="dirBeneficiarioAcc_${servicioPedido.IdPedidoMembresia}">Dirección</label>
                                    <div class="form-input form">
                                        <input type="text" id="dirBeneficiarioAcc_${servicioPedido.IdPedidoMembresia}" value="${await obtenerDireccionBeneficiario(servicioPedido.IdUsuario)}" readonly>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="single-form form-default">
                                    <label for="estadoBeneficiarioAcc_${servicioPedido.IdPedidoMembresia}">Estado</label>
                                    <div class="form-input form">
                                        <input type="text" id="estadoBeneficiarioAcc_${servicioPedido.IdPedidoMembresia}" value="${await obtenerEstadoBeneficiario(servicioPedido.IdUsuario)}" readonly>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                `;
                document.getElementById('accordionBeneficiario').appendChild(beneficiarioElemento);
            }
        }

        // Calcular el total general de servicios
        calcularTotalGeneralServicios();
        calcularTotalPedido();

    } catch (error) {
        console.error('Error al cargar datos de los servicios:', error);
    }
};

// Función para obtener el documento del beneficiario
async function obtenerDocumentoBeneficiario(idUsuario) {
    try {
        const response = await fetch(`http://localhost:3000/api/usuarios/${idUsuario}`);
        const usuario = await response.json();
        return `${usuario.Documento}`;
    } catch (error) {
        console.error('Error al obtener el documento del beneficiario:', error);
        return '';
    }
}

// Función para obtener el correo del beneficiario
async function obtenerCorreoBeneficiario(idUsuario) {
    try {
        const response = await fetch(`http://localhost:3000/api/usuarios/${idUsuario}`);
        const usuario = await response.json();
        return `${usuario.Correo}`;
    } catch (error) {
        console.error('Error al obtener el correo del beneficiario:', error);
        return '';
    }
}

// Función para obtener el teléfono del beneficiario
async function obtenerTelefonoBeneficiario(idUsuario) {
    try {
        const response = await fetch(`http://localhost:3000/api/usuarios/${idUsuario}`);
        const usuario = await response.json();
        return `${usuario.Telefono}`;
    } catch (error) {
        console.error('Error al obtener el teléfono del beneficiario:', error);
        return '';
    }
}

// Función para obtener la dirección del beneficiario
async function obtenerDireccionBeneficiario(idUsuario) {
    try {
        const response = await fetch(`http://localhost:3000/api/usuarios/${idUsuario}`);
        const usuario = await response.json();
        return `${usuario.Direccion}`;
    } catch (error) {
        console.error('Error al obtener la dirección del beneficiario:', error);
        return '';
    }
}

// Función para obtener el estado del beneficiario
async function obtenerEstadoBeneficiario(idUsuario) {
    try {
        const response = await fetch(`http://localhost:3000/api/usuarios/${idUsuario}`);
        const usuario = await response.json();
        return usuario.Estado === 0 ? 'ACTIVO' : 'INACTIVO';
    } catch (error) {
        console.error('Error al obtener el estado del beneficiario:', error);
        return '';
    }
}

// Función para agregar un servicio al pedido
const agregarServicio = async () => {
    const serviciosContainer = document.getElementById('serviciosContainer');
    const servicioElemento = document.createElement('div');
    const uniqueId = Date.now(); // Generar un ID único basado en el timestamp
    servicioElemento.classList.add('servicioItem', 'col-12');
    servicioElemento.dataset.idServicioPedido = `nuevo-${uniqueId}`;
    servicioElemento.innerHTML = `
        <div class="form-group formularioRegistro2__grupo">
            <label for="selectMembresia_${uniqueId}" class="formularioRegistro2__label">Membresía:</label>
            <select id="selectMembresia_${uniqueId}" name="membresias[]" class="form-select" onchange="actualizarDatosMembresia(this, '${uniqueId}')">
                <option selected disabled>Seleccione una membresía</option>
                <!-- Aquí se añadirán las membresías disponibles -->
            </select>
        </div>
        <div class="form-group formularioRegistro2__grupo">
            <label for="docBeneficiario_${uniqueId}" class="formularioRegistro2__label">Documento Beneficiario:</label>
            <input type="text" id="docBeneficiario_${uniqueId}" class="form-control" oninput="buscarBeneficiarioActivo('${uniqueId}')" pattern="\\d*">
            <input type="hidden" id="beneficiarioId_${uniqueId}">
            <label for="nombreBeneficiario_${uniqueId}" class="formularioRegistro2__label">Nombre Beneficiario:</label>
            <input type="text" id="nombreBeneficiario_${uniqueId}" class="form-control" readonly>
        </div>
        <div id="resultadosBusqueda_${uniqueId}" class="list-group mt-2"></div>

        <div class="form-group formularioRegistro2__grupo">
            <label for="fechaInicio_${uniqueId}" class="formularioRegistro2__label">Fecha Inicio:</label>
            <input type="date" id="fechaInicio_${uniqueId}" class="form-control" name="fechasInicio[]" value="${new Date().toISOString().split('T')[0]}">
        </div>
        <div class="form-group formularioRegistro2__grupo">
            <label for="fechaFin_${uniqueId}" class="formularioRegistro2__label">Fecha Fin:</label>
            <input type="date" id="fechaFin_${uniqueId}" class="form-control" name="fechasFin[]" value="${new Date().toISOString().split('T')[0]}">
        </div>
        <div class="form-group formularioRegistro2__grupo">
            <label for="totalServicio_${uniqueId}" class="formularioRegistro2__label">Total:</label>
            <input type="text" id="totalServicio_${uniqueId}" class="form-control" style="width: 90px;" readonly>
        </div>
        <button type="button" class="btn btn-danger mt-2" onclick="eliminarServicio(this)">
            <i class="fa-solid fa-minus fa-lg"></i> Eliminar
        </button>
    `;
    serviciosContainer.appendChild(servicioElemento);

    // Obtener membresías disponibles y llenar el select
    try {
        const membresiasResponse = await fetch(`http://localhost:3000/api/membresias`);
        const membresias = await membresiasResponse.json();
        const selectMembresia = document.getElementById(`selectMembresia_${uniqueId}`);
        membresias.forEach(membresia => {
            const option = document.createElement('option');
            option.value = membresia.IdMembresia;
            option.text = membresia.NombreMembresia;
            selectMembresia.appendChild(option);
        });
    } catch (error) {
        console.error('Error al obtener membresías:', error);
    }
};

// Función para buscar beneficiario activo en los servicios
async function buscarBeneficiarioActivo(id) {
    const documento = document.getElementById(`docBeneficiario_${id}`).value;
    const resultadosBusqueda = document.getElementById(`resultadosBusqueda_${id}`);
    resultadosBusqueda.innerHTML = ''; // Limpiar resultados anteriores

    if (documento.length >= 3) { // Realizar la búsqueda si hay al menos 3 caracteres
        try {
            const response = await fetch(`http://localhost:3000/api/beneficiarios/activos/buscar/${documento}`);
            const usuarios = await response.json();
            console.log('Usuarios encontrados:', usuarios); // Para depuración

            if (response.ok && usuarios.length > 0) {
                usuarios.forEach(usuario => {
                    const item = document.createElement('a');
                    item.classList.add('list-group-item', 'list-group-item-action');
                    item.textContent = `${usuario.Documento} - ${usuario.Nombres} ${usuario.Apellidos}`;
                    item.addEventListener('click', () => {
                        document.getElementById(`beneficiarioId_${id}`).value = usuario.IdUsuario;
                        document.getElementById(`docBeneficiario_${id}`).value = usuario.Documento;
                        document.getElementById(`nombreBeneficiario_${id}`).value = `${usuario.Nombres} ${usuario.Apellidos}`;
                        resultadosBusqueda.innerHTML = '';
                    });
                    resultadosBusqueda.appendChild(item);
                });
            } else {
                const item = document.createElement('div');
                item.classList.add('list-group-item');
                item.textContent = 'No se encontraron coincidencias';
                resultadosBusqueda.appendChild(item);
            }
        } catch (error) {
            console.error('Error al realizar la búsqueda:', error);
        }
    } else {
        document.getElementById(`nombreBeneficiario_${id}`).value = '';
        document.getElementById(`beneficiarioId_${id}`).value = '';
    }
}

// Modifica los elementos del DOM para usar la nueva función buscarBeneficiarioActivo
document.querySelectorAll('input[id^="docBeneficiario_"]').forEach(input => {
    input.addEventListener('input', () => {
        const id = input.id.split('_')[1];
        buscarBeneficiarioActivo(id);
    });
});



// Función para actualizar datos de la membresía seleccionada
const actualizarDatosMembresia = async (selectMembresia, idMembresia) => {
    const membresiaId = selectMembresia.value;
    const fechaInicioInput = document.getElementById(`fechaInicio_${idMembresia}`);
    const fechaFinInput = document.getElementById(`fechaFin_${idMembresia}`);
    const totalInput = document.getElementById(`totalServicio_${idMembresia}`);

    try {
        const membresiaResponse = await fetch(`http://localhost:3000/api/membresias/${membresiaId}`);
        const membresia = await membresiaResponse.json();

        // Calcular las fechas de inicio y fin
        const fechaInicio = new Date(fechaInicioInput.value);
        const fechaFin = new Date(fechaInicio);
        fechaFin.setDate(fechaFin.getDate() + membresia.Frecuencia);

        fechaFinInput.value = fechaFin.toISOString().split('T')[0];
        const total = Math.round(membresia.CostoVenta);
        totalInput.value = formatearValor(total);
        totalInput.dataset.valor = total;

        // Calcular el total general de servicios
        calcularTotalGeneralServicios();
        calcularTotalPedido();
    } catch (error) {
        console.error('Error al obtener datos de la membresía:', error);
    }
};

// Función para eliminar un servicio del pedido
const eliminarServicio = (btn) => {
    const servicioItem = btn.closest('.servicioItem');
    servicioItem.remove();

    // Calcular el total general de servicios
    calcularTotalGeneralServicios();
    calcularTotalPedido();
};

// Función para calcular el total general de todos los servicios
const calcularTotalGeneralServicios = () => {
    const totalInputs = document.querySelectorAll('input[id^="totalServicio_"]');
    let totalGeneralServicios = 0;
    totalInputs.forEach(input => {
        totalGeneralServicios += parseFloat(input.dataset.valor) || 0;
    });

    document.getElementById('totalServicios').value = formatearCOP(totalGeneralServicios);
    document.getElementById('totalServicios').dataset.valor = totalGeneralServicios;
};

// Función para guardar cambios en los servicios del pedido
const guardarCambiosServicios = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const pedidoId = urlParams.get('id');

    if (!pedidoId) {
        console.error('ID del pedido no encontrado en la URL');
        return;
    }

    const serviciosContainer = document.getElementById('serviciosContainer');
    const serviciosItems = serviciosContainer.querySelectorAll('.servicioItem');
    const serviciosNuevos = [];
    const serviciosEliminados = [];

    // Recorrer los servicios iniciales para identificar los eliminados
    serviciosIniciales.forEach(servicioInicial => {
        const item = Array.from(serviciosItems).find(item => parseInt(item.dataset.idServicioPedido) === servicioInicial.IdPedidoMembresia);
        if (!item) {
            serviciosEliminados.push(servicioInicial.IdPedidoMembresia);
        }
    });

    // Recorrer los servicios actuales para identificar los nuevos y actualizados
    serviciosItems.forEach(item => {
        const idServicioPedido = item.dataset.idServicioPedido;
        const membresiaSelect = item.querySelector('.form-select[id^="selectMembresia_"]');
        const beneficiarioId = item.querySelector('input[id^="beneficiarioId_"]').value;
        const fechaInicioInput = item.querySelector('input[id^="fechaInicio_"]');
        const fechaFinInput = item.querySelector('input[id^="fechaFin_"]');
        const totalInput = item.querySelector('input[id^="totalServicio_"]');

        const servicioData = {
            IdPedido: pedidoId,
            IdMembresia: membresiaSelect.value,
            IdUsuario: beneficiarioId,
            FechaInicio: fechaInicioInput.value,
            FechaFin: fechaFinInput.value,
            Total: parseFloat(totalInput.dataset.valor)
        };

        if (idServicioPedido.startsWith('nuevo-')) {
            serviciosNuevos.push(servicioData);
        } else {
            const servicioInicial = serviciosIniciales.find(s => s.IdPedidoMembresia === parseInt(idServicioPedido));
            if (servicioInicial) {
                if (
                    servicioInicial.IdMembresia !== parseInt(servicioData.IdMembresia) ||
                    servicioInicial.IdUsuario !== parseInt(servicioData.IdUsuario) ||
                    new Date(servicioInicial.FechaInicio).toISOString().split('T')[0] !== servicioData.FechaInicio ||
                    new Date(servicioInicial.FechaFin).toISOString().split('T')[0] !== servicioData.FechaFin ||
                    servicioInicial.Total !== parseFloat(servicioData.Total)
                ) {
                    // Servicio actualizado
                    servicioData.IdPedidoMembresia = servicioInicial.IdPedidoMembresia;
                    serviciosNuevos.push(servicioData); // Usar serviciosNuevos para mantener todo junto
                }
            }
        }
    });

    try {
        // Eliminar servicios
        for (const idServicioPedido of serviciosEliminados) {
            await fetch(`http://localhost:3000/api/pedidosMembresia/${idServicioPedido}`, {
                method: 'DELETE'
            });
        }

        // Agregar o actualizar servicios
        for (const servicioData of serviciosNuevos) {
            if (servicioData.IdPedidoMembresia) {
                // Actualizar servicio
                await fetch(`http://localhost:3000/api/pedidosMembresia/${servicioData.IdPedidoMembresia}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(servicioData)
                });
            } else {
                // Agregar servicio
                await fetch('http://localhost:3000/api/pedidosMembresia', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(servicioData)
                });
            }
        }

        Swal.fire({
            title: "¡Excelente!",
            text: "Servicios Actualizados Correctamente!",
            icon: "success",
        }).then(() => {
            window.location.reload();
        });

    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "¡Oops...",
            text: "Error al guardar los cambios: " + error.message
        });
    }
};

// Función para obtener el nombre del beneficiario
async function obtenerNombreBeneficiario(idUsuario) {
    try {
        const response = await fetch(`http://localhost:3000/api/usuarios/${idUsuario}`);
        const usuario = await response.json();
        return `${usuario.Nombres} ${usuario.Apellidos}`;
    } catch (error) {
        console.error('Error al obtener el nombre del beneficiario:', error);
        return '';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    cargarDatosPedido();
    cargarDatosServicios();
    calcularTotalPedido(); // Llamar esta función al cargar los datos inicialmente
});
