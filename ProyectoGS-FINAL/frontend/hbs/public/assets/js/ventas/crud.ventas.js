const urlVentas = 'http://localhost:3000/api/ventas';
const urlProductos = 'http://localhost:3000/api/productos';
const urlMembresias = 'http://localhost:3000/api/membresias';
const urlUsuarios = 'http://localhost:3000/api/usuarios';




document.addEventListener('DOMContentLoaded', () => {

     // Establecer la fecha de venta con la fecha actual
     const fechaVentaInput = document.getElementById('fechaVenta');
     fechaVentaInput.valueAsDate = new Date(); // Establece la fecha con la fecha actual

     
    cargarUsuarios();
    cargarProductos(document.getElementById('selectProducto'));
    cargarMembresias(document.getElementById('selectMembresia'));
    inicializarSelect2();
});

async function cargarUsuarios() {
    try {
        const response = await fetch(urlUsuarios);
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        const usuarios = await response.json();
        const selectUsuarios = document.getElementById('idUsuarios');
        if (selectUsuarios) {
            usuarios.forEach(usuario => {
                const option = document.createElement('option');
                option.value = usuario.IdUsuario;
                option.textContent = `${usuario.Nombres} ${usuario.Apellidos} - ${usuario.Documento}`;
                selectUsuarios.appendChild(option);
            });
        } else {
            console.error('Elemento selectUsuarios no encontrado');
        }
    } catch (error) {
        console.error('Error al cargar los usuarios:', error);
    }
}

async function cargarProductos(selectElement) {
    try {
        const response = await fetch(urlProductos);
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        const productos = await response.json();
        selectElement.innerHTML = ''; // Clear previous options
        const defaultOption = document.createElement('option');
        defaultOption.selected = true;
        defaultOption.disabled = true;
        defaultOption.textContent = 'Agregar producto a la venta';
        selectElement.appendChild(defaultOption);
        productos.forEach(producto => {
            const option = document.createElement('option');
            option.value = producto.IdProducto;
            option.textContent = `${producto.NombreProducto} - $${producto.PrecioProducto}`;
            selectElement.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar los productos:', error);
    }
}

async function cargarMembresias(selectElement) {
    try {
        const response = await fetch(urlMembresias);
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        const membresias = await response.json();
        selectElement.innerHTML = ''; // Clear previous options
        const defaultOption = document.createElement('option');
        defaultOption.selected = true;
        defaultOption.disabled = true;
        defaultOption.textContent = 'Agregar membresía a la venta';
        selectElement.appendChild(defaultOption);
        membresias.forEach(membresia => {
            const option = document.createElement('option');
            option.value = membresia.IdMembresia;
            option.textContent = `${membresia.NombreMembresia} - $${membresia.CostoVenta}`;
            selectElement.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar las membresías:', error);
    }
}

function calcularValorTotal() {
    let total = 0;

    document.querySelectorAll('.productoContainer').forEach(container => {
        const valor = parseFloat(container.querySelector('.valorProducto').textContent.replace('$', '').trim());
        const cantidad = parseInt(container.querySelector('input[name="cantidades[]"]').value);
        total += valor * cantidad;
    });

    document.querySelectorAll('.membresiaContainer').forEach(container => {
        const valor = parseFloat(container.querySelector('.valorMembresia').textContent.replace('$', '').trim());
        const cantidad = parseInt(container.querySelector('input[name="cantidadesMembresia[]"]').value);
        total += valor * cantidad;
    });

    document.getElementById('total').value = total.toFixed(2);
}

function actualizarValorProducto(select) {
    const idProducto = select.value;
    if (idProducto) {
        fetch(`${urlProductos}/${idProducto}`)
            .then(response => {
                if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
                return response.json();
            })
            .then(data => {
                const container = select.closest('.productoContainer');
                const cantidadInput = container.querySelector('input[name="cantidades[]"]');
                
                // Actualizar el valor del producto
                container.querySelector('.valorProducto').textContent = `$${data.PrecioProducto}`;
                
                // Establecer el máximo de cantidad según el stock disponible
                cantidadInput.max = data.Stock;

                // Verificar si la cantidad seleccionada excede el stock disponible
                if (data.Stock < cantidadInput.value) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Stock insuficiente',
                        text: `El producto ${data.NombreProducto} solo tiene ${data.Stock} unidades disponibles.`
                    });
                    cantidadInput.value = data.Stock; // Ajustar la cantidad al máximo disponible
                }

                calcularValorTotal();
            })
            .catch(error => console.error('Error al obtener el valor del producto:', error));
    }
}


function actualizarValorMembresia(select) {
    const idMembresia = select.value;
    if (idMembresia) {
        fetch(`${urlMembresias}/${idMembresia}`)
            .then(response => {
                if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
                return response.json();
            })
            .then(data => {
                const container = select.closest('.membresiaContainer');
                container.querySelector('.valorMembresia').textContent = `$${data.CostoVenta}`;
                calcularValorTotal();
            })
            .catch(error => console.error('Error al obtener el valor de la membresía:', error));
    }
}

function agregarProducto() {
    const container = document.createElement('tr');
    container.classList.add('productoContainer');
    container.innerHTML = `
        <td>
            <select name="productos[]" class="form-select" onchange="actualizarValorProducto(this)" required>
                <option selected="" disabled="">Agregar producto a la venta</option>
            </select>
        </td>
        <td>
            <input type="number" name="cantidades[]" value="1" min="1" class="form-control" required onchange="calcularValorTotal()">
        </td>
        <td>
            <label class="valorProducto">$0</label>
        </td>
        <td>
            <button type="button" class="btn btn-soft-danger" onclick="eliminarProducto(this)"><i class="fa-solid fa-minus fa-lg"></i></button>
        </td>
    `;
    document.getElementById('productosAgregados').appendChild(container);
    cargarProductos(container.querySelector('select[name="productos[]"]'));
}

function agregarMembresia() {
    const container = document.createElement('tr');
    container.classList.add('membresiaContainer');
    container.innerHTML = `
        <td>
            <select name="membresias[]" class="form-select" onchange="actualizarValorMembresia(this)" required>
                <option selected="" disabled="">Agregar membresía a la venta</option>
            </select>
        </td>
        <td>
            <input type="number" name="cantidadesMembresia[]" value="1" min="1" class="form-control" required onchange="calcularValorTotal()">
        </td>
        <td>
            <label class="valorMembresia">$0</label>
        </td>
        <td>
            <button type="button" class="btn btn-soft-danger" onclick="eliminarMembresia(this)"><i class="fa-solid fa-minus fa-lg"></i></button>
        </td>
    `;
    document.getElementById('membresiasAgregadas').appendChild(container);
    cargarMembresias(container.querySelector('select[name="membresias[]"]'));
}

function eliminarProducto(button) {
    button.closest('tr').remove();
    calcularValorTotal();
}

function eliminarMembresia(button) {
    button.closest('tr').remove();
    calcularValorTotal();
}

function actualizarValorProducto(select) {
    const idProducto = select.value;
    if (idProducto) {
        fetch(`${urlProductos}/${idProducto}`)
            .then(response => {
                if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
                return response.json();
            })
            .then(data => {
                const container = select.closest('.productoContainer');
                const cantidadInput = container.querySelector('input[name="cantidades[]"]');
                
                // Actualizar el valor del producto
                container.querySelector('.valorProducto').textContent = `$${data.PrecioProducto}`;
                
                // Establecer el máximo de cantidad según el stock disponible
                cantidadInput.max = data.Stock;

                // Verificar la cantidad actual al seleccionar el producto
                verificarCantidadProducto(cantidadInput, data.Stock, data.NombreProducto);

                // Agregar verificación al cambiar la cantidad
                cantidadInput.addEventListener('change', () => {
                    verificarCantidadProducto(cantidadInput, data.Stock, data.NombreProducto);
                });

                calcularValorTotal();
            })
            .catch(error => console.error('Error al obtener el valor del producto:', error));
    }
}



async function verificarStock(productos) {
    for (const producto of productos) {
        const response = await fetch(`${urlProductos}/${producto.IdProducto}`);
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        const data = await response.json();
        const stockDisponible = data.Stock;

        if (stockDisponible < producto.Cantidad) {
            Swal.fire({
                icon: 'error',
                title: 'Stock insuficiente',
                text: `El producto ${data.NombreProducto} no tiene suficiente stock. Disponible: ${stockDisponible}, Solicitado: ${producto.Cantidad}`
            });
            return false;
        }
    }
    return true;
}

async function enviarVenta() {
    const idUsuario = document.getElementById('idUsuarios').value;
    const fechaVenta = document.getElementById('fechaVenta').value;
    const total = document.getElementById('total').value;

    const productos = Array.from(document.querySelectorAll('select[name="productos[]"]')).map((select, index) => {
        const idProducto = select.value;
        const cantidad = document.querySelectorAll('input[name="cantidades[]"]')[index].value;
        return idProducto ? { IdProducto: idProducto, Cantidad: cantidad } : null;
    }).filter(producto => producto !== null);

    const membresias = Array.from(document.querySelectorAll('select[name="membresias[]"]')).map((select, index) => {
        const idMembresia = select.value;
        const cantidad = document.querySelectorAll('input[name="cantidadesMembresia[]"]')[index].value;
        return idMembresia ? { IdMembresia: idMembresia, Cantidad: cantidad } : null;
    }).filter(membresia => membresia !== null);

    if (!idUsuario || !fechaVenta || (!productos.length && !membresias.length)) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos incompletos',
            text: 'Por favor, complete todos los campos obligatorios y agregue al menos un producto o una membresía.'
        });
        return;
    }

    if (productos.length > 0 && !(await verificarStock(productos))) {
        return;
    }

    const venta = {
        IdUsuario: idUsuario,
        productos: productos,
        membresias: membresias
    };

    try {
        const response = await fetch(urlVentas, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(venta)
        });
        if (!response.ok) throw new Error('Error al crear la venta');
        Swal.fire({
            icon: 'success',
            title: 'Venta creada',
            text: 'Venta creada exitosamente'
        }).then(() => {
            window.location.href = '/GestionVentas';
        });
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al crear la venta'
        });
    }
}