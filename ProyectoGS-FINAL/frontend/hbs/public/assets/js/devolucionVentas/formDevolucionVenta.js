const url1 = 'http://localhost:3000/api/devolucionventas';
const url2 = 'http://localhost:3000/api/ventasproducto';
const url3 = 'http://localhost:3000/api/ventas';

// Función para cargar los productos de la venta seleccionada
async function precargarDatosVentaEnFormulario(ventaId) {
    try {
        const response = await fetch(`${url3}/${ventaId}`);
        if (!response.ok) throw new Error('Error al obtener los datos de la venta');

        const venta = await response.json();

        // Pree-llenar los campos con los datos de la venta
        document.getElementById('valorDevolucionVenta').value = venta.Total;
        
        // Mostrar datos del cliente
        document.getElementById('nombreCliente').textContent = `${venta.NombreCliente} ${venta.ApellidosCliente}`;
        document.getElementById('documentoCliente').textContent = venta.DocumentoCliente;

        // Cargar y mostrar los productos de la venta en la tabla
        await cargarProductosDeVenta(ventaId);
    } catch (error) {
        console.error('Error al precargar los datos de la venta:', error);
    }
}

// Función para cargar los productos de la venta seleccionada
const cargarProductosDeVenta = async (ventaId) => {
    try {
        const response = await fetch(`${url2}/${ventaId}`, {
            method: 'GET',
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }

        const productos = await response.json();
        const productosContainer = document.getElementById('productosDeVentaTable');
        productosContainer.innerHTML = ''; // Limpiar la tabla antes de agregar los nuevos productos

        productos.forEach(producto => {
            const tr = document.createElement('tr');
            tr.classList.add('productoRow');

            const tdProducto = document.createElement('td');
            const selectNombre = document.createElement('select');
            selectNombre.style.width = '300px';
            selectNombre.disabled = true;
            selectNombre.name = 'productos[]';

            const optionNombre = document.createElement('option');
            optionNombre.value = producto.IdProducto;
            optionNombre.textContent = producto.NombreProducto;
            selectNombre.appendChild(optionNombre);

            tdProducto.appendChild(selectNombre);
            tr.appendChild(tdProducto);

            const tdValor = document.createElement('td');
            tdValor.classList.add('valorProducto');
            tdValor.textContent = `$${producto.PrecioProducto}`;
            tr.appendChild(tdValor);

            const tdCantidad = document.createElement('td');
            const inputCantidad = document.createElement('input');
            inputCantidad.type = 'number';
            inputCantidad.style.width = '50px';
            inputCantidad.min = 0;
            inputCantidad.max = producto.CantidadProducto; // Permite devoluciones parciales
            inputCantidad.value = producto.CantidadProducto;
            inputCantidad.name = 'cantidades[]';

            tdCantidad.appendChild(inputCantidad);
            tr.appendChild(tdCantidad);

            const tdValorTotal = document.createElement('td');
            const valorTotalText = document.createElement('span');
            valorTotalText.classList.add('valortotal');
            valorTotalText.textContent = `$${(producto.PrecioProducto * producto.CantidadProducto).toFixed(2)}`;
            tdValorTotal.appendChild(valorTotalText);
            tr.appendChild(tdValorTotal);

            inputCantidad.addEventListener('input', () => {
                calcularValorTotal(tr);
            });

            const tdAcciones = document.createElement('td');
            const btnEliminar = document.createElement('button');
            btnEliminar.type = 'button';
            btnEliminar.className = 'btn btn-soft-danger';
            btnEliminar.textContent = 'Eliminar';
            btnEliminar.onclick = function() {
                tr.remove();
                calcularValorTotal();
            };

            tdAcciones.appendChild(btnEliminar);
            tr.appendChild(tdAcciones);

            productosContainer.appendChild(tr);
        });

        calcularValorTotal();

    } catch (error) {
        console.error('Error al cargar los productos de la venta:', error);
    }
};

// Cargar los datos al cargar la página
document.addEventListener('DOMContentLoaded', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const ventaId = urlParams.get('id');

    if (ventaId) {
        // Cargar los datos de la venta y prellenar el formulario
        await precargarDatosVentaEnFormulario(ventaId);
    }

    document.getElementById('fechaDevolucion').valueAsDate = new Date(); // Establece la fecha de devolución con la fecha actual
});

async function enviarDevVenta() {
    const now = new Date();
    const FechaDevolucion = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    const urlParams = new URLSearchParams(window.location.search);
    const ventaId = urlParams.get('id');
    const Motivo = document.getElementById("motivo").value;
    const ValorDevolucionVenta = document.getElementById("valorDevolucionVenta").value;

    if (Motivo === "" || ValorDevolucionVenta === "") {
        Swal.fire({
            icon: 'warning',
            title: 'Error',
            text: 'Llene todos los campos',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    const productos = Array.from(document.querySelectorAll('.productoRow')).map(row => ({
        IdProducto: row.querySelector('select[name="productos[]"]').value,
        CantidadProducto: row.querySelector('input[name="cantidades[]"]').value,
        PrecioProducto: parseFloat(row.querySelector('.valorProducto').textContent.replace('$', '').trim())
    }));

    const devventa = {
        Motivo,
        ValorDevolucionVenta,
        EstadoDevolucion: 1,
        IdVenta: ventaId,
        FechaDevolucion,
        productos
    };

    try {
        const responsedevventa = await fetch(url1, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(devventa)
        });

        if (!responsedevventa.ok) {
            throw new Error(`Error en la venta: ${responsedevventa.status} - ${responsedevventa.statusText}`);
        }

        await responsedevventa.json();

        Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Devolución agregada con éxito',
            confirmButtonText: 'Aceptar'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = '../Devolucionven'; // Redirigir a la página de gestión de devoluciones
            }
        });
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al agregar la devolución',
            confirmButtonText: 'Aceptar'
        });
    }
}

function calcularValorTotal() {
    let sumaTotal = 0;

    document.querySelectorAll('.productoRow').forEach(container => {
        let valorProductoText = container.querySelector('.valorProducto').textContent.trim();
        let valorProducto = parseFloat(valorProductoText.replace('$', '').replace(',', '').trim());
        
        let cantidad = parseInt(container.querySelector('input[name="cantidades[]"]').value);
        
        let valorTotal = valorProducto * cantidad;
        
        container.querySelector('.valortotal').textContent = `$${valorTotal.toFixed(2)}`;
        
        sumaTotal += valorTotal;
    });

    document.getElementById('valorDevolucionVenta').value = sumaTotal.toFixed(2);
}
