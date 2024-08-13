

// Función para obtener el documento del cliente por su ID
const obtenerDocumentoCliente = async (idUsuario) => {
    try {
        const response = await fetch(`http://localhost:3000/api/usuarios/${idUsuario}`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener el documento del cliente');
        }

        const cliente = await response.json();
        return cliente.Documento || 'No encontrado';
    } catch (error) {
        console.error('Error:', error.message);
        return 'Error';
    }
};



// Función para formatear la fecha en DD/MM/AAAA
const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const anio = date.getFullYear();
    return `${dia}/${mes}/${anio}`;
};

// Función para formatear números como cantidades de dinero sin decimales con separadores de miles
const formatearDinero = (cantidad) => {
    return cantidad.toLocaleString('es-ES', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

// LISTAR PEDIDOS
const listarPedidos = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/pedidos', {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener los pedidos');
        }

        const pedidos = await response.json();
        let contenido = '';

        const estadoMap = {
            0: 'PENDIENTE DE PAGO',
            1: 'PAGADO',
            2: 'ENTREGADO',
            3: 'ANULADO'
        };

        for (const pedido of pedidos) {
            const documentoCliente = await obtenerDocumentoCliente(pedido.IdUsuario);
            const estadoTexto = estadoMap[pedido.EstadoPedido];
            const fechaFormateada = formatearFecha(pedido.FechaPedido);
            const totalFormateado = formatearDinero(pedido.Total);

            contenido += `<tr>` +
                `<td>${pedido.IdPedido}</td>` +
                `<td>${documentoCliente}</td>` +
                `<td>${fechaFormateada}</td>` +
                `<td>${totalFormateado}</td>` +
                `<td>${estadoTexto}</td>` +
                `<td style="text-align: center;">
                    <div class="centered-container">
                        <a href="editarPedido?id=${pedido.IdPedido}"><i class="fa-regular fa-pen-to-square fa-xl me-2"></i></a>
                        <a href="detallePedido?id=${pedido.IdPedido}"><i class="fa-regular fa-eye fa-xl me-2"></i></a>
                    </div>
                </td>` +
                `</tr>`;
        }

        const objectId = document.getElementById('contenido');
        if (objectId) {
            objectId.innerHTML = contenido;
        } else {
            console.error('No se encontró el elemento con id "contenido"');
        }

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


    } catch (error) {
        console.error('Error:', error.message);
    }
};

// Función para obtener los pedidos por ID de usuario
const obtenerPedidosPorUsuarioId = async (idUsuario) => {
    try {
        const response = await fetch(`http://localhost:3000/api/pedidos/${idUsuario}`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener los pedidos del usuario');
        }

        const pedidos = await response.json();
        return pedidos;
    } catch (error) {
        console.error('Error:', error.message);
        return [];
    }
};

// Función para listar los pedidos de un usuario en el acordeón
const listarPedidosUsuario = async (idUsuario) => {
    const pedidos = await obtenerPedidosPorUsuarioId(idUsuario);
    let contenido = '';

    const estadoMap = {
        0: 'PENDIENTE DE PAGO',
        1: 'PAGADO',
        2: 'ENTREGADO',
        3: 'ANULADO'
    };

    for (const pedido of pedidos) {
        const estadoTexto = estadoMap[pedido.EstadoPedido];
        const fechaFormateada = formatearFecha(pedido.FechaPedido);
        const totalFormateado = formatearDinero(pedido.Total);

        contenido += `<tr>` +
            `<td>${pedido.IdPedido}</td>` +
            `<td>${fechaFormateada}</td>` +
            `<td>${totalFormateado}</td>` +
            `<td>${estadoTexto}</td>` +
            `</tr>`;
    }

    const tablaPedidos = document.getElementById('tablaPedidos');
    if (tablaPedidos) {
        tablaPedidos.innerHTML = contenido;
    } else {
        console.error('No se encontró el elemento con id "tablaPedidos"');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    listarPedidos();
    const idUsuario = new URLSearchParams(window.location.search).get('id');
    if (idUsuario) {
        listarPedidosUsuario(idUsuario);
    }
});

async function cargarProductos() {
    const pedidoId = obtenerPedidoId();
    const productos = await obtenerProductosPedido(pedidoId);
    mostrarProductosEnTabla(productos);
}

function obtenerPedidoId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('pedidoId');
}

async function obtenerProductosPedido(pedidoId) {
    try {
        const response = await fetch(`/api/pedidos/${pedidoId}/productos`);
        if (!response.ok) {
            throw new Error('Error al obtener los productos del pedido');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

function mostrarProductosEnTabla(productos) {
    const tablaProductos = document.getElementById('tablaProductos');
    const totalProductos = document.getElementById('totalProductos');
    tablaProductos.innerHTML = ''; // Limpiar contenido previo

    let total = 0;
    productos.forEach(producto => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${producto.NombreProducto}</td>
            <td>${producto.PrecioUnitario}</td>
            <td>${producto.Iva}</td>
            <td>${producto.Cantidad}</td>
            <td>${producto.SubTotal}</td>
        `;
        total += parseFloat(producto.SubTotal);
        tablaProductos.appendChild(fila);
    });

    totalProductos.textContent = total.toFixed(2);
}
