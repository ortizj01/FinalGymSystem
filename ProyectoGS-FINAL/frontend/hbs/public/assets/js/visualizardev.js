const url1 = 'http://localhost:3000/api/devolucioncompras'
const url2 = 'http://localhost:3000/api/devolucioncomprasproducto'



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
        console.log(compraproducto);

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
        document.getElementById('Fechacompra').textContent = compra.FechaDevolucionCompra;
        document.getElementById('Valorcompra').textContent = '$'+compra.ValorDevolucion;
        document.getElementById('Fecharegistrocompra').textContent = compra.Fecha_RegistroCompra;
        document.getElementById('Numerorecibocompra').textContent =compra.NumeroReciboCompra;
        document.getElementById('Proveedor').textContent = compra.NombreProveedor;



    } catch (error) {
        console.error('Error:', error);
    }
};