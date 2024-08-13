
document.addEventListener('DOMContentLoaded', function() {
    Swal.fire({
        title: '¡Atención!',
        text: 'Debes tomar captura del comprobante de tu transacción, se necesitará para finalizar con tu pedido.',
        icon: 'info',
        confirmButtonText: 'Entendido',
        backdrop: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: true,
        width: '400px',
        padding: '20px',
        customClass: {
            popup: 'animated fadeInDown faster'
        }
    });
});

const actualizarTotalAPagar = () => {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const totalElement = document.getElementById('total');

    let total = 0;

    carrito.forEach(item => {
        const totalProducto = item.PrecioProducto * item.cantidad;
        total += totalProducto;
    });

    // Actualizar total a pagar en la tabla de precios
    totalElement.textContent = `$${total.toFixed(0)}`;
};

// Ejecutar la función al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    actualizarTotalAPagar();
});


//funcion para finalizar pedido

async function finalizarPedido() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    if (!carrito.length) {
        Swal.fire({
            icon: 'error',
            title: 'Carrito vacío',
            text: 'No hay productos en el carrito para procesar el pedido.',
        });
        return;
    }

    const FechaPedido = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const Total = carrito.reduce((total, item) => total + item.PrecioProducto * item.cantidad, 0);
    const EstadoPedido = 0;  // Estado pendiente de pago

    try {
        // Crear el pedido
        const responsePedido = await fetch('http://localhost:3000/api/pedidos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-token': localStorage.getItem('token')
            },
            body: JSON.stringify({
                IdUsuario: usuario.IdUsuario,
                FechaPedido: FechaPedido,
                PagoNeto: 0,  // Se establece en 0 como indicaste
                Iva: 0,       // Se establece en 0 como indicaste
                Total: Total,
                EstadoPedido: EstadoPedido
            })
        });

        if (!responsePedido.ok) {
            throw new Error('Error al crear el pedido');
        }

        const { id: IdPedido } = await responsePedido.json();

        // Insertar cada producto en PedidosProducto y actualizar el stock
        for (const item of carrito) {
            const responsePedidoProducto = await fetch('http://localhost:3000/api/pedidosProducto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-token': localStorage.getItem('token')
                },
                body: JSON.stringify({
                    IdPedido: IdPedido,
                    IdProducto: item.IdProducto,
                    Cantidad: item.cantidad,
                    Total: item.PrecioProducto * item.cantidad
                })
            });

            if (!responsePedidoProducto.ok) {
                throw new Error('Error al registrar el producto en el pedido');
            }

            // Actualizar el stock del producto
            const responseActualizarProducto = await fetch(`http://localhost:3000/api/productos/${item.IdProducto}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'x-token': localStorage.getItem('token')
                },
                body: JSON.stringify({
                    Stock: item.Stock - item.cantidad
                })
            });

            if (!responseActualizarProducto.ok) {
                throw new Error('Error al actualizar el stock del producto');
            }
        }

        // Mostrar la alerta de éxito
        Swal.fire({
            icon: 'success',
            title: 'Pedido registrado',
            text: 'Debes compartir el comprobante a nuestro Wapp.',
            timer: 3000,
            showConfirmButton: false
        });

        // Redirigir al usuario a WhatsApp para compartir el comprobante
        const mensaje = `Pedido registrado con Id: ${IdPedido}, Documento: ${usuario.Documento}, Total: ${Total.toFixed(2)}`;
        window.location.href = `https://api.whatsapp.com/send?phone=3135497455&text=${encodeURIComponent(mensaje)}`;

        // Limpiar el carrito
        localStorage.removeItem('carrito');

        // Redirigir al usuario al inicio después de 3 segundos
        setTimeout(() => {
            window.location.href = '/indexCarrito';
        }, 2000);

    } catch (error) {
        console.error('Error al registrar el pedido:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al registrar el pedido. Por favor, intenta de nuevo.',
        });
    }
}


