const url1 = 'http://localhost:3000/api/devolucioncompras'
const url2 = 'http://localhost:3000/api/comprasproducto'
const url3 = 'http://localhost:3000/api/compras'

const precargarDatosCompraEnFormulario = async () => {
    var urlParams = new URLSearchParams(window.location.search);
    var compraId = urlParams.get('id');

    try {
        const response = await fetch(`${url3}/${compraId}`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }

        const compra = await response.json();

        // Precargar los datos de la compra en el formulario
        document.getElementById('Fecha_compra').value = compra.Fecha_RegistroCompra;
        document.getElementById('NumeroReciboCompra').value = compra.NumeroReciboCompra;

    } catch (error) {
        console.error('Error:', error);
    }
};



// Función para cargar datos de productos en el formulario
const precargarDatosproductosEnFormulario = async () => {
    var urlParams = new URLSearchParams(window.location.search);
    var compraId = urlParams.get('id');

    try {
        const response = await fetch(`http://localhost:3000/api/comprasproducto/${compraId}`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }

        const productos = await response.json();

        const productosContainer = document.getElementById('productosAgregados');
        productosContainer.innerHTML = '';

        productos.forEach(producto => {
            const tr = document.createElement('tr');
            tr.classList.add('productoRow');

            // Columna de producto (select)
            const tdProducto = document.createElement('td');
            const selectNombre = document.createElement('select');
            selectNombre.style.width = '300px';
            selectNombre.disabled = true;
            selectNombre.name = 'productos[]';

            const tdProductocmpra = document.createElement('td');
            const labelCantidad = document.createElement('label');
            labelCantidad.textContent = producto.CantidadProducto; // Mostrar la cantidad en el label
            labelCantidad.style.display = 'inline-block';
            labelCantidad.style.width = '50px';
            labelCantidad.style.textAlign = 'center';


            const optionNombre = document.createElement('option');
            optionNombre.value = producto.IdProducto;
            optionNombre.textContent = producto.NombreProducto;
            selectNombre.appendChild(optionNombre);

            tdProducto.appendChild(selectNombre);
            tr.appendChild(tdProducto);
            tdProductocmpra.appendChild(labelCantidad);
            tr.appendChild(tdProductocmpra);

            // Columna de valor
            const tdValor = document.createElement('td');
            tdValor.classList.add('valorProducto'); // Añadir clase para identificar el valor del producto
            tdValor.textContent = `$${producto.PrecioProducto}`;
            tr.appendChild(tdValor);

            // Columna de cantidad
            const tdCantidad = document.createElement('td');
            const inputCantidad = document.createElement('input');
            inputCantidad.type = 'number';
            inputCantidad.style.width = '50px';
            inputCantidad.min = 0;
            inputCantidad.max = producto.CantidadProducto;
            inputCantidad.value = 0;
            inputCantidad.name = 'cantidades[]';
            
            const validarCantidad = () => {
                let value = parseInt(inputCantidad.value, 10) || 0; // Convertir el valor a número entero
                if (value < 0) {
                    value = 0;
                } else if (value > producto.CantidadProducto) {
                    value = producto.CantidadProducto;
                }
                inputCantidad.value = value;
                calcularValorTotal(tr); // Recalcular el valor total
            };

            inputCantidad.addEventListener('input', validarCantidad);

            tdCantidad.appendChild(inputCantidad);
            tr.appendChild(tdCantidad);

            // Columna de valor total
            const tdValorTotal = document.createElement('td');
            const valorTotalText = document.createElement('span');
            valorTotalText.classList.add('valortotal'); // Añadir clase para identificar el valor total
            valorTotalText.textContent = `$${(producto.PrecioProducto * producto.CantidadProducto).toFixed(2)}`;
            tdValorTotal.appendChild(valorTotalText);
            tr.appendChild(tdValorTotal);

            // Evento para actualizar el valor total al cambiar la cantidad
            inputCantidad.addEventListener('input', () => {
                calcularValorTotal(tr);
            });

            // Columna de acciones
            const tdAcciones = document.createElement('td');
            const btnEliminar = document.createElement('button');
            btnEliminar.type = 'button';
            btnEliminar.className = 'btn btn-soft-danger';
            btnEliminar.textContent = 'Quitar de devolucion';
            btnEliminar.onclick = function() {
                tr.remove();
                calcularValorTotal(); // Recalcular el valor total después de eliminar un producto
            };

            tdAcciones.appendChild(btnEliminar);
            tr.appendChild(tdAcciones);

            productosContainer.appendChild(tr);
        });

        calcularValorTotal(); // Calcular el valor total al cargar los productos

    } catch (error) {
        console.error('Error:', error);
    }
};




async function enviarDevCompra() {
    const now = new Date();
    const FechaDevolucionCompra = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    var urlParams = new URLSearchParams(window.location.search);
    var compraId = urlParams.get('id');
    console.log(compraId);
    const Motivo = document.getElementById("MDevolucion").value;
    const ValorDevolucion = document.getElementById("ValorDev").value;

    if (Motivo === "" || ValorDevolucion === "") {
        Swal.fire({
            icon: 'warning',
            title: 'Error',
            text: 'Llene todos los campos',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    const devcompra = {
        Motivo,
        ValorDevolucion,
        EstadoDevolucion: 1,
        IdCompra: compraId,
        FechaDevolucionCompra
    };

    try {
        const responsedevcompra = await fetch('http://localhost:3000/api/devolucioncompras', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(devcompra)
        });

        if (!responsedevcompra.ok) {
            throw new Error(`Error en la compra: ${responsedevcompra.status} - ${responsedevcompra.statusText}`);
        }

        const devcompracompraData = await responsedevcompra.json();
        const IdDevolucionesCompra = devcompracompraData.id;

        const productosRows = document.querySelectorAll('.productoRow'); // Cambiado para seleccionar las filas

        const productoPromises = Array.from(productosRows).map(async (row) => {
            const productoSelect = row.querySelector('select[name="productos[]"]');
            const cantidadInput = row.querySelector('input[name="cantidades[]"]');
        
            if (productoSelect && cantidadInput) {
                const IdProducto = productoSelect.value;
                const CantidadProducto = cantidadInput.value;
        
                const productoCompra = {
                    IdDevolucionesCompra,
                    IdProducto,
                    CantidadProducto,
                    IdCompra: compraId,
                };
                console.log(productoCompra);

                const responseProducto = await fetch('http://localhost:3000/api/devolucioncomprasproducto', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(productoCompra)
                });

                if (!responseProducto.ok) {
                    throw new Error(`Error en la adición del producto: ${responseProducto.status} - ${responseProducto.statusText}`);
                }

                return responseProducto.json();
            } else {
                console.error('Error: No se encontró el elemento de producto o cantidad');
                return null;
            }
        });

        await Promise.all(productoPromises);

        Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Devolución agregada con éxito',
            confirmButtonText: 'Aceptar'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = '../Devolucioncom'; // Reemplaza esta URL con la ruta real
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

const listarDevCompras = async () => {
    let ObjectId = document.getElementById('contenidoDevCompras'); // obj donde se mostrara la info
    let contenido = ''; // contiene las filas y celdas que se mostraran en el tbody

    try {
        const response = await fetch(url1, {
            method: 'GET',
            mode: 'cors',
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }

        const data = await response.json();
        
        // Verificar datos recibidos
        console.log('Datos recibidos:', data);
        
        // Aquí asumimos que data es un array de objetos de rutinas
        data.forEach(compra => {
            // Verificar cada rutina
            console.log('compra:', compra);
            
            // Asegurarse de que las propiedades existan
            if (compra.NumeroReciboCompra && compra.Motivo && compra.ValorDevolucion && compra.Fecha_compraf && compra.estado_descripcion !== undefined) {
                contenido += `
                    <tr>
                        <td>${compra.NumeroReciboCompra}</td>
                        <td>${compra.Motivo}</td>
                        <td>$${compra.ValorDevolucion}</td>
                        <td>${compra.Fecha_compraf}</td>
                        <td>${compra.estado_descripcion}</td>
                        <td style="text-align: center;">
                            <div class="centered-container">
                            <a href="../visualizardevcompra?id=${compra.IdDevolucionesCompra}">
                                <i class="fa-regular fa-eye fa-xl me-2"></i>
                            </a>
                        </td>
                    </tr>
                `;
            } else {
                console.error('Formato de datos incorrecto', compra);
            }
        });

        ObjectId.innerHTML = contenido;
        $('#dataTable').DataTable().destroy();

        $('#dataTable').DataTable({
            language: {
                "decimal": "",
                "emptyTable": "No hay información",
                "info": "Mostrando _START_ a _END_ de _TOTAL_ Entradas",
                "infoEmpty": "Mostrando 0 to 0 of 0 Entradas",
                "infoFiltered": "(Filtrado de _MAX_ total entradas)",
                "infoPostFix": "",
                "thousands": ",",
                "lengthMenu": "Mostrar _MENU_ Entradas",
                "loadingRecords": "Cargando...",
                "processing": "Procesando...",
                "search": "Buscar:",
                "zeroRecords": "Sin resultados encontrados",
                "paginate": {
                    "first": "Primero",
                    "last": "Ultimo",
                    "next": "Siguiente",
                    "previous": "Anterior"
                }
            }, 
            lengthMenu: [5, 10, 25, 50], // Opciones de selección de registros por página
            pageLength: 5 
        });

    } catch (error) {
        console.error('Error:', error);
    }
}; 


function calcularValorTotal() {
    let sumaTotal = 0;

    document.querySelectorAll('.productoRow').forEach(container => {
        // Obtener el valor del producto
        let valorProductoText = container.querySelector('.valorProducto').textContent.trim();
        let valorProducto = parseFloat(valorProductoText.replace('$', '').replace(',', '').trim());
        
        // Obtener la cantidad
        let cantidad = parseInt(container.querySelector('input[name="cantidades[]"]').value);
        
        // Calcular el valor total
        let valorTotal = valorProducto * cantidad;
        
        // Actualizar el valor total en el DOM
        container.querySelector('.valortotal').textContent = `$${valorTotal.toFixed(2)}`;
        
        // Sumar el valor total a la suma total
        sumaTotal += valorTotal;
    });

    // Actualizar el valor de la compra en el input
    document.getElementById('ValorDev').value = sumaTotal.toFixed(2);
}












