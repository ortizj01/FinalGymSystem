
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

const finalizarPedido = async () => {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const configuracionesMembresias = JSON.parse(localStorage.getItem('configuracionesMembresias')) || [];
    const valoracionesMedicas = JSON.parse(localStorage.getItem('valoracionMedica')) || [];

    if (!carrito.length) {
        Swal.fire({
            icon: 'error',
            title: 'Carrito vacío',
            text: 'No hay productos en el carrito para procesar el pedido.',
        });
        return;
    }

    try {
        const ahora = new Date();
        const FechaPedido = ahora.toISOString().slice(0, 19).replace('T', ' ');
        const Total = carrito.reduce((total, item) => total + item.PrecioProducto * item.cantidad, 0);
        const EstadoPedido = 1;

        const responsePedido = await fetch('https://finalgymsystem.onrender.com/api/pedidos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-token': localStorage.getItem('token')
            },
            body: JSON.stringify({
                IdUsuario: usuario.IdUsuario,
                FechaPedido: FechaPedido,
                Total: Total,
                EstadoPedido: EstadoPedido
            })
        });

        if (!responsePedido.ok) {
            throw new Error('Error al crear el pedido');
        }

        const { id: IdPedido } = await responsePedido.json();

        for (const item of carrito) {
            if (item.IdProducto !== null) {
                await registrarProductoEnPedido(item, IdPedido);
            } else {
                await registrarMembresiaEnPedido(item, IdPedido, configuracionesMembresias);
            }
        }

        for (const valoracion of valoracionesMedicas) {
            await registrarValoracionMedica(valoracion);
        }

        Swal.fire({
            icon: 'success',
            title: 'Pedido registrado',
            text: 'Debes compartir el comprobante a nuestro Wapp.',
            timer: 3000,
            showConfirmButton: false
        });

        const mensaje = `Pedido registrado con Id: ${IdPedido}, Documento: ${usuario.Documento}, Total: ${Total.toFixed(2)}`;
        window.location.href = `https://api.whatsapp.com/send?phone=3135497455&text=${encodeURIComponent(mensaje)}`;

        localStorage.removeItem('carrito');

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
};


async function registrarProductoEnPedido(item, IdPedido) {
    try {
        const responsePedidoProducto = await fetch('https://finalgymsystem.onrender.com/api/pedidosProducto', {
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
        const responseActualizarProducto = await fetch(`https://finalgymsystem.onrender.com/api/productos/${item.IdProducto}`, {
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
    } catch (error) {
        console.error('Error al registrar producto:', error);
        throw error;
    }
}

async function registrarMembresiaEnPedido(item, IdPedido, configuracionesMembresias) {
    try {
        const configuracion = configuracionesMembresias.find(config => config.IdMembresia === item.IdMembresia);

        if (configuracion) {
            const responseMembresia = await fetch(`https://finalgymsystem.onrender.com/api/membresias/${item.IdMembresia}`);
            if (!responseMembresia.ok) {
                throw new Error('Error al obtener detalles de la membresía');
            }

            const membresia = await responseMembresia.json();
            const frecuencia = membresia.Frecuencia;

            const fechaInicio = new Date();
            const fechaFin = new Date(fechaInicio);
            fechaFin.setDate(fechaFin.getDate() + frecuencia);

            // Registrar cada membresía según la cantidad
            for (let i = 0; i < item.cantidad; i++) {
                const responsePedidoMembresia = await fetch('https://finalgymsystem.onrender.com/api/pedidosMembresia', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-token': localStorage.getItem('token')
                    },
                    body: JSON.stringify({
                        IdPedido: IdPedido,
                        IdMembresia: item.IdMembresia,
                        FechaInicio: fechaInicio.toISOString().slice(0, 10),
                        FechaFin: fechaFin.toISOString().slice(0, 10),
                        Total: item.PrecioProducto,
                        IdUsuario: configuracion.IdBeneficiario
                    })
                });

                if (!responsePedidoMembresia.ok) {
                    throw new Error('Error al registrar la membresía en el pedido');
                }
            }
        }
    } catch (error) {
        console.error('Error al registrar membresía:', error);
        throw error;
    }
}


async function registrarValoracionMedica(valoracion) {
    try {
        const responseValoracionMedica = await fetch('https://finalgymsystem.onrender.com/api/valoracionesMedicas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-token': localStorage.getItem('token')
            },
            body: JSON.stringify(valoracion)
        });

        if (!responseValoracionMedica.ok) {
            throw new Error('Error al registrar la valoración médica');
        }
    } catch (error) {
        console.error('Error al registrar valoración médica:', error);
        throw error;
    }
}
