const urlVentas = 'http://localhost:3000/api/ventas'; 
const urlProductos = 'http://localhost:3000/api/productos';
const urlMembresias = 'http://localhost:3000/api/membresias';
const urlUsuarios = 'http://localhost:3000/api/usuarios';
const urlClientesBeneficiario = 'http://localhost:3000/api/clientesBeneficiarios';

let usuarios = [];

document.addEventListener('DOMContentLoaded', () => {
    const selectBeneficiario = document.getElementById('selectBeneficiario');

    // Establecer la fecha de venta con la fecha actual
    const fechaVentaInput = document.getElementById('fechaVenta');
    const today = new Date().toISOString().split('T')[0]; // Formato yyyy-mm-dd
    fechaVentaInput.value = today;

    cargarUsuarios();
    cargarProductos(document.getElementById('selectProducto'));
    cargarMembresias(document.getElementById('selectMembresia'));

    // Evento para mostrar el select de beneficiarios
    document.getElementById('idUsuarios').addEventListener('change', function() {
        const selectedUser = this.value;
        if (selectedUser) {
            const usuario = usuarios.find(u => u.IdUsuario == selectedUser);
            if (usuario && usuario.BeneficiarioNombres) {
                // Cargar beneficiarios en el select
                const idsBeneficiarios = usuario.IdBeneficiario.split(', ');
                const nombresBeneficiarios = usuario.BeneficiarioNombres.split(', ');
                selectBeneficiario.innerHTML = '<option selected="" disabled="">Selecciona el Beneficiario</option>';
                idsBeneficiarios.forEach((id, index) => {
                    const option = document.createElement('option');
                    option.value = id;
                    option.textContent = nombresBeneficiarios[index];
                    selectBeneficiario.appendChild(option);
                });
                selectBeneficiario.style.display = 'block'; // Mostrar el select
            } else {
                selectBeneficiario.style.display = 'none'; // Ocultar el select si no tiene beneficiarios
            }
        }
    });
});

async function cargarUsuarios() {
    try {
        console.log('Cargando usuarios...');
        const response = await fetch(urlClientesBeneficiario);
        console.log('Response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error en la respuesta del servidor:', errorText);
            throw new Error(`Error HTTP: ${response.status}`);
        }

        usuarios = await response.json(); // Asigna los usuarios globalmente
        console.log('Usuarios cargados:', usuarios);
        
        const selectUsuarios = document.getElementById('idUsuarios');
        const beneficiarioIcono = document.getElementById('beneficiarioIcono');
        
        if (selectUsuarios) {
            selectUsuarios.innerHTML = ''; // Limpiar las opciones previas
            usuarios.forEach(usuario => {
                if (usuario.NombreRol === 'Cliente') {
                    const option = document.createElement('option');
                    option.value = usuario.IdUsuario;
                    option.textContent = `${usuario.Nombres} ${usuario.Apellidos} - ${usuario.Documento}`;
                    selectUsuarios.appendChild(option);
                }
            });

            // Evento para mostrar u ocultar el ícono de beneficiario según la selección
            selectUsuarios.addEventListener('change', function() {
                const selectedUser = usuarios.find(u => u.IdUsuario == this.value);
                if (selectedUser && selectedUser.BeneficiarioNombres) {
                    beneficiarioIcono.style.display = 'inline'; // Mostrar el ícono si tiene beneficiarios
                } else {
                    beneficiarioIcono.style.display = 'none'; // Ocultar el ícono si no tiene beneficiarios
                }
            });
        } else {
            console.error('Elemento selectUsuarios no encontrado');
        }
    } catch (error) {
        console.error('Error al cargar los usuarios:', error);
    }
}

function cargarBeneficiariosModal(userId) {
    const usuario = usuarios.find(u => u.IdUsuario == userId);
    const selectBeneficiarioModal = document.getElementById('selectBeneficiarioModal');
    if (usuario && usuario.IdBeneficiario) {
        const idsBeneficiarios = usuario.IdBeneficiario.split(', ');
        const nombresBeneficiarios = usuario.BeneficiarioNombres.split(', ');
        
        selectBeneficiarioModal.innerHTML = '';
        idsBeneficiarios.forEach((id, index) => {
            const option = document.createElement('option');
            option.value = id;
            option.textContent = nombresBeneficiarios[index];
            selectBeneficiarioModal.appendChild(option);
        });
    }
}


async function cargarProductos(selectElement) {
    try {
        console.log('Cargando productos...');
        const response = await fetch(urlProductos);
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        const productos = await response.json();
        console.log('Productos cargados:', productos);
        selectElement.innerHTML = ''; // Limpiar opciones previas
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
        console.log('Cargando membresías...');
        const response = await fetch(urlMembresias);
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        const membresias = await response.json();
        console.log('Membresías cargadas:', membresias);
        selectElement.innerHTML = ''; // Limpiar opciones previas
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

    // Sumar los valores de venta de todos los productos
    document.querySelectorAll('.productoContainer').forEach(container => {
        const valorVenta = parseFloat(container.querySelector('.valorVenta').value.replace('$', '').trim());
        total += valorVenta;
    });

    // Sumar los valores de venta de todas las membresías
    document.querySelectorAll('.membresiaContainer').forEach(container => {
        const valorVenta = parseFloat(container.querySelector('.valorVenta').value.replace('$', '').trim());
        total += valorVenta;
    });

    // Actualizar el campo de total de venta
    document.getElementById('total').value = total.toFixed(2);
}

function actualizarValorProducto(select) {
    const idProducto = select.value;
    if (idProducto) {
        fetch(`${urlProductos}/${idProducto}`)
            .then(response => response.json())
            .then(data => {
                const container = select.closest('.productoContainer');
                const cantidadInput = container.querySelector('input[name="cantidades[]"]');
                const valorUnitarioInput = container.querySelector('.valorUnitario');
                const valorVentaInput = container.querySelector('.valorVenta');

                // Verificar si hay stock disponible
                if (data.Stock <= 0) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Stock insuficiente',
                        text: `El producto ${data.NombreProducto} no tiene stock disponible.`,
                    });
                    select.value = "";  // Resetea el select a su estado inicial
                    return;
                }

                // Establecer el valor unitario y calcular el valor de venta
                valorUnitarioInput.value = `$${data.PrecioProducto}`;
                const cantidad = parseInt(cantidadInput.value);
                valorVentaInput.value = `$${(data.PrecioProducto * cantidad).toFixed(2)}`;

                // Actualizar el valor total
                calcularValorTotal();
            })
            .catch(error => console.error('Error al obtener el valor del producto:', error));
    }
}


function actualizarValorMembresia(select) {
    const idMembresia = select.value;
    if (idMembresia) {
        fetch(`${urlMembresias}/${idMembresia}`)
            .then(response => response.json())
            .then(data => {
                const container = select.closest('.membresiaContainer');
                const cantidadInput = container.querySelector('input[name="cantidadesMembresia[]"]');
                const valorUnitarioInput = container.querySelector('.valorUnitario');
                const valorVentaInput = container.querySelector('.valorVenta');

                // Establecer el valor unitario y calcular el valor de venta
                valorUnitarioInput.value = `$${data.CostoVenta}`;
                const cantidad = parseInt(cantidadInput.value);
                valorVentaInput.value = `$${(data.CostoVenta * cantidad).toFixed(2)}`;

                // Actualizar el valor total
                calcularValorTotal();
            })
            .catch(error => console.error('Error al obtener el valor de la membresía:', error));
    }
}

function actualizarValorVenta(input) {
    const container = input.closest('tr');
    const valorUnitarioInput = container.querySelector('.valorUnitario');
    const valorVentaInput = container.querySelector('.valorVenta');
    const cantidad = parseInt(input.value);
    const valorUnitario = parseFloat(valorUnitarioInput.value.replace('$', '').trim());

    // Calcular el nuevo valor de venta
    valorVentaInput.value = `$${(valorUnitario * cantidad).toFixed(2)}`;

    // Actualizar el valor total
    calcularValorTotal();
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
            <input type="text" class="form-control valorUnitario" readonly value="$0">
        </td>
        <td>
            <input type="number" name="cantidades[]" value="1" min="1" class="form-control" required onchange="actualizarValorVenta(this)">
        </td>
        <td>
            <input type="text" class="form-control valorVenta" readonly value="$0">
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
            <input type="text" class="form-control valorUnitario" readonly value="$0">
        </td>
        <td>
            <input type="number" name="cantidadesMembresia[]" value="1" min="1" class="form-control" required onchange="actualizarValorVenta(this)">
        </td>
        <td>
            <input type="text" class="form-control valorVenta" readonly value="$0">
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
    const total = parseFloat(document.getElementById('total').value);

    const productos = Array.from(document.querySelectorAll('select[name="productos[]"]')).map((select, index) => {
        const idProducto = select.value;
        const cantidad = document.querySelectorAll('input[name="cantidades[]"]')[index].value;
        return idProducto && idProducto !== "Agregar producto a la venta" ? { IdProducto: idProducto, Cantidad: cantidad } : null;
    }).filter(producto => producto !== null);

    const membresias = Array.from(document.querySelectorAll('select[name="membresias[]"]')).map((select, index) => {
        const idMembresia = select.value;
        const cantidad = document.querySelectorAll('input[name="cantidadesMembresia[]"]')[index].value;
        return idMembresia && idMembresia !== "Agregar membresía a la venta" ? { IdMembresia: idMembresia, Cantidad: cantidad } : null;
    }).filter(membresia => membresia !== null);

    if (!idUsuario || !fechaVenta) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos incompletos',
            text: 'Por favor, complete todos los campos obligatorios.'
        });
        return;
    }

    if (productos.length === 0 && membresias.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Productos o membresías faltantes',
            text: 'Debe agregar al menos un producto o una membresía para crear la venta.'
        });
        return;
    }

    // Verificar stock si hay productos
    if (productos.length > 0 && !(await verificarStock(productos))) {
        return;
    }

    const venta = {
        IdUsuario: idUsuario,
        productos: productos,
        membresias: membresias,
        Total: total
    };

    try {
        console.log('Enviando datos de venta:', venta);
        const response = await fetch(urlVentas, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(venta)
        });

        console.log('Response status:', response.status);
        if (!response.ok) {
            const errorText = await response.text(); // Capturar el texto de error desde la respuesta
            throw new Error(`Error al crear la venta: ${response.statusText} - ${errorText}`);
        }

        Swal.fire({
            icon: 'success',
            title: 'Venta creada',
            text: 'Venta creada exitosamente'
        }).then(() => {
            window.location.href = '/GestionVentas';
        });
    } catch (error) {
        console.error('Error en enviarVenta:', error.message);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `Error al crear la venta: ${error.message}`
        });
    }
}