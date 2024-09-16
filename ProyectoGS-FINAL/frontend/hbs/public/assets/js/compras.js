const url1 = 'https://finalgymsystem.onrender.com/api/compras'
const url2 = 'https://finalgymsystem.onrender.com/api/comprasproducto'

function calcularValorTotal(container) {
    // Obtener el valor del producto
    let valorProductoText = container.querySelector('.valorProducto').textContent.trim();
    let valorProducto = parseFloat(valorProductoText.replace('$', '').replace(',', '').trim());
    
    // Obtener la cantidad
    let cantidad = parseInt(container.querySelector('input[name="cantidades[]"]').value);
    
    // Calcular el valor total
    let valorTotal = valorProducto * cantidad;
    
    // Actualizar el valor total en el DOM
    container.querySelector('.valortotal').textContent = `$ ${valorTotal.toFixed(2)}`;

    // Recalcular la suma total de valores
    let sumaTotal = 0;
    document.querySelectorAll('.valortotal').forEach((element) => {
        sumaTotal += parseFloat(element.textContent.replace('$', ''));
    });

    // Actualizar el valor de la compra en el input
    document.getElementById('valorCompra').value = sumaTotal.toFixed(2);
}

// Resto del código...


function actualizarValorProducto1(select) {
    var idProducto = select.value;
    if (idProducto) {
        fetch(`https://finalgymsystem.onrender.com/api/productos/${idProducto}`)
            .then(response => response.json())
            .then(data => {
                document.getElementById("valorProducto").innerHTML = `$ ${data.PrecioProducto}`;
                // Actualizar el valor total
                calcularValorTotal(select.closest('.productoContainer'));
            })
            .catch(error => console.error('Error al obtener el valor del producto:', error));
    }
}

function actualizarValorProducto(select, labelValor) {
    var idProducto = select.value;
    if (idProducto === "") {
        labelValor.innerHTML = `$ 0`;
    } else {
        fetch(`https://finalgymsystem.onrender.com/api/productos/${idProducto}`)
            .then(response => response.json())
            .then(data => {
                labelValor.innerHTML = `$ ${data.PrecioProducto}`;
                // Actualizar el valor total
                calcularValorTotal(select.closest('.productoContainer'));
            })
            .catch(error => console.error('Error al obtener el valor del producto:', error));
    }
}

function agregarProducto() {
    var productosTable = document.getElementById("productosTable");

    var newRow = productosTable.insertRow();
    newRow.className = "productoRow";

    var selectCell = newRow.insertCell();
    var selectElement = document.createElement("select");
    selectElement.name = "productos[]";
    selectElement.className = "selectProducto";
    selectElement.style.width = "300px";
    selectElement.innerHTML = document.getElementById("selectProducto").innerHTML;
    selectElement.onchange = function() {
        actualizarValorProducto(selectElement, labelValorP);
    };
    selectCell.appendChild(selectElement);

    var valorCell = newRow.insertCell();
    var labelValorP = document.createElement("label");
    labelValorP.className = "valorProducto";
    labelValorP.innerHTML = "$ 0";
    valorCell.appendChild(labelValorP);

    var cantidadCell = newRow.insertCell();
    var nuevaCantidad = document.createElement("input");
    nuevaCantidad.type = "number";
    nuevaCantidad.style.width = "90px";
    nuevaCantidad.name = "cantidades[]";
    nuevaCantidad.value = "1";
    nuevaCantidad.min = "1";
    nuevaCantidad.required = true;
    nuevaCantidad.addEventListener('input', function() {
        calcularValorTotal(newRow);
    });
    cantidadCell.appendChild(nuevaCantidad);

    const validarCantidad = () => {
        let value = parseInt(nuevaCantidad.value, 10) || 0; // Convertir el valor a número entero
        if (value < 1) {
            value = 1;
        } 
        nuevaCantidad.value = value;
        calcularValorTotal(tr); // Recalcular el valor total
    };

    nuevaCantidad.addEventListener('input', validarCantidad);

    var valorTotalCell = newRow.insertCell();
    var labelValorT = document.createElement("label");
    labelValorT.className = "valortotal";
    labelValorT.innerHTML = "$ 0";
    valorTotalCell.appendChild(labelValorT);

    var accionesCell = newRow.insertCell();
    var btnEliminar = document.createElement("button");
    btnEliminar.type = "button";
    btnEliminar.className = "btn btn-soft-danger mt-2";
    btnEliminar.innerHTML = '<i class="fa-solid fa-minus fa-lg"></i>';
    btnEliminar.onclick = function () {
        productosTable.deleteRow(newRow.rowIndex);
    };
    accionesCell.appendChild(btnEliminar);

    actualizarValorProducto(selectElement, labelValorP);
}

document.addEventListener('DOMContentLoaded', (event) => {
    // Evento de escucha para el campo de cantidad inicial
    document.querySelector('input[name="cantidades[]"]').addEventListener('input', function() {
        calcularValorTotal(document.querySelector('.productoContainer'));
    });

    // Cargar los proveedores
    const selectProveedores = document.getElementById('idProveedores');
    fetch('https://finalgymsystem.onrender.com/api/proveedores')
        .then(response => response.json())
        .then(data => {
            data.forEach(proveedor => {
                const option = document.createElement('option');
                option.value = proveedor.IdProveedores;
                option.textContent = proveedor.NombreProveedor;
                selectProveedores.appendChild(option);
            });         
        })
        .catch(error => console.error('Error al cargar los proveedores:', error));


    // Cargar los productos

});


const listarCompras = async () => {
    let ObjectId = document.getElementById('contenidoCompras'); // obj donde se mostrara la info
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
            if (compra.FechaCompra && compra.ValorCompra && compra.FechaRegistroCompra && compra.NumeroReciboCompra && compra.EstadoCompra && compra.IdProveedores !== undefined) {
                contenido += `
                    <tr>
                        <td>${compra.NumeroReciboCompra}</td>
                        <td>${compra.Fecha_compraf}</td>
                        <td>$${compra.ValorCompra}</td>
                        <td>${compra.Fecha_RegistroCompra}</td>
                        <td>${compra.estado_descripcion}</td>
                        <td>${compra.NombreProveedor}</td>
                        <td style="text-align: center;">
                            <div class="centered-container">
                            <a href="../visualizarcompra?id=${compra.IdCompra}">
                                <i class="fa-regular fa-eye fa-xl me-2"></i>
                            </a>
                            <a href="../formDevolucioncom?id=${compra.IdCompra}">
                                <i class="fa fa-undo  fa-xl me-2"></i>
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




async function enviarCompra() {
    const now = new Date();
    const FechaRegistroCompra = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    
    const FechaCompra = document.getElementById("fechaCompra").value;
    const ValorCompra = document.getElementById("valorCompra").value;
    const NumeroReciboCompra = document.getElementById("numeroReciboCompra").value;
    const IdProveedores = document.getElementById("idProveedores").value;

    if (FechaCompra === "" || ValorCompra === "" || NumeroReciboCompra === "" || IdProveedores === "") {
        Swal.fire({
            icon: 'warning',
            title: 'Error',
            text: 'Llene todos los campos',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    const compra = {
        FechaCompra,
        ValorCompra,
        FechaRegistroCompra,
        NumeroReciboCompra,
        EstadoCompra: 1,
        IdProveedores
    };

    try {
        const responseCompra = await fetch(url1, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(compra)
        });

        if (!responseCompra.ok) {
            throw new Error(`Error en la compra: ${responseCompra.status} - ${responseCompra.statusText}`);
        }

        const compraData = await responseCompra.json();
        const IdCompra = compraData.id;

        const productoRows = document.querySelectorAll('#productosTable .productoRow');

        const productoPromises = Array.from(productoRows).map(async (row) => {
            const productoSelect = row.querySelector('select[name="productos[]"]');
            const cantidadInput = row.querySelector('input[name="cantidades[]"]');

            if (productoSelect && cantidadInput) {
                const IdProducto = productoSelect.value;
                const CantidadProducto = cantidadInput.value;

                const productoCompra = {
                    IdCompra,
                    IdProducto,
                    CantidadProducto
                };

                const responseProducto = await fetch(url2, {
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
            text: 'Compra agregada con éxito',
            confirmButtonText: 'Aceptar'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = '../Compras'; // Reemplaza esta URL con la ruta real
            }
        });
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al agregar la compra',
            confirmButtonText: 'Aceptar'
        });
    }
}






document.addEventListener('DOMContentLoaded', function () {
    const selectElement = document.getElementById('selectProducto');

    fetch('https://finalgymsystem.onrender.com/api/productos')
        .then(response => response.json())
        .then(data => {
            data.forEach(producto => {
                const option = document.createElement('option');
                option.value = producto.IdProducto;
                option.textContent = producto.NombreProducto;
                selectElement.appendChild(option);
            });
        })
        .catch(error => console.error('Error al cargar los productos:', error));
});


const precargarDatosCompraEnFormulario = async () => {

    
    // Buscar el parámetro 'id' en la URL
    var urlParams = new URLSearchParams(window.location.search);
    var compraId = urlParams.get('id');
    console.log(compraId);
    try {
        const response = await fetch(`${url1}/${compraId}`, {
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

        // Precargar los datos de la compra en el formulario en label
        document.getElementById('Fechacompra').textContent = compra.Fecha_compraf;
        document.getElementById('Valorcompra').textContent = '$'+compra.ValorCompra;
        document.getElementById('Fecharegistrocompra').textContent = compra.Fecha_RegistroCompra;
        document.getElementById('Numerorecibocompra').textContent =compra.NumeroReciboCompra;
        document.getElementById('Proveedor').textContent = compra.NombreProveedor;



    } catch (error) {
        console.error('Error:', error);
    }
};

const precargarDatosCompraproductoEnFormulario = async () => {

    
    // Buscar el parámetro 'id' en la URL
    var urlParams = new URLSearchParams(window.location.search);
    var compraId = urlParams.get('id');
    console.log(compraId);
    try {
        const response = await fetch(`${url2}/${compraId}`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }


        const compraproducto = await response.json();

          // Crear o hacer referencia a la tabla HTML objetivo
        const compraProductoTable = document.getElementById('compraProductoTable');

        // Limpiar las filas de la tabla existentes
        compraProductoTable.innerHTML = '';

        // Recorrer los objetos de productos de compra
        compraproducto.forEach(producto => {
            // Crear una nueva fila de tabla
            const tableRow = compraProductoTable.insertRow();

            // Crear y completar celdas de tabla para cada punto de datos
            const NombreProductoCell = tableRow.insertCell();
            NombreProductoCell.textContent = producto.NombreProducto;

            const PrecioProductoCell = tableRow.insertCell();
            PrecioProductoCell.textContent ='$'+ producto.PrecioProducto;

            
            const cantidadProductoCell = tableRow.insertCell();
            cantidadProductoCell.textContent = producto.CantidadProducto;
        
            const ValortotalCell = tableRow.insertCell();
            ValortotalCell.textContent ='$'+  producto.Valortotal;});





    } catch (error) {
        console.error('Error:', error);
    }
};

