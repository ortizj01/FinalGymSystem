function agregarServicio(contenedor) {
    var nuevoServicioContainer = document.createElement("div");
    nuevoServicioContainer.className = "servicioContainer d-flex align-items-center";

    // Crear el nuevo campo de selección para Beneficiario
    var nuevoSelectBeneficiario = document.createElement("select");
    nuevoSelectBeneficiario.name = "Beneficiario[]";
    nuevoSelectBeneficiario.className = "form-select";
    nuevoSelectBeneficiario.style.width = "300px";

    // Clonar las opciones desde el select original de Beneficiario
    var opcionesBeneficiario = document.getElementById("selectBeneficiario").innerHTML;
    nuevoSelectBeneficiario.innerHTML = opcionesBeneficiario;

    // Crear el botón para agregar Beneficiario
    var btnAgregarBeneficiario = document.createElement("button");
    btnAgregarBeneficiario.type = "button";
    btnAgregarBeneficiario.className = "btn btn-soft-info btn mt-2 ms-2";
    btnAgregarBeneficiario.innerHTML = '<a href="formularioBeneficiario"><i class="fa-solid fa-plus fa-lg"></i> Beneficiario</a>';

    // Crear el nuevo campo de selección para Servicio
    var nuevoSelectServicio = document.createElement("select");
    nuevoSelectServicio.name = "servicios[]";
    nuevoSelectServicio.className = "form-select";
    nuevoSelectServicio.style.width = "300px";

    // Clonar las opciones desde el select original de Servicio
    var opcionesServicio = document.getElementById("selectServicio").innerHTML;
    nuevoSelectServicio.innerHTML = opcionesServicio;

    var labelCantidad = document.createElement("label");
    labelCantidad.innerHTML = "Cantidad:";
    labelCantidad.className = "ms-3";

    var nuevaCantidad = document.createElement("input");
    nuevaCantidad.type = "number";
    nuevaCantidad.className = "form-control";
    nuevaCantidad.style.width = "90px";
    nuevaCantidad.value = "1";
    nuevaCantidad.min = "1";

    var labelValor = document.createElement("label");
    labelValor.innerHTML = "Valor:";
    labelValor.className = "ms-3";

    var labelValorP = document.createElement("label");
    labelValorP.innerHTML = "$23.000"; 
    labelValorP.className = "ms-2";

    var btnEliminar = document.createElement("button");
    btnEliminar.type = "button";
    btnEliminar.className = "btn btn-soft-danger mt-2 ms-3";
    btnEliminar.innerHTML = '<i class="fa-solid fa-minus fa-lg"></i>';
    btnEliminar.onclick = function () {
        contenedor.removeChild(nuevoServicioContainer);
        contenedor.removeChild(btnEliminar);
    };

    // Agregar los elementos al contenedor
    nuevoServicioContainer.appendChild(nuevoSelectBeneficiario);
    nuevoServicioContainer.appendChild(btnAgregarBeneficiario);
    nuevoServicioContainer.appendChild(nuevoSelectServicio);
    nuevoServicioContainer.appendChild(labelCantidad);
    nuevoServicioContainer.appendChild(nuevaCantidad);
    nuevoServicioContainer.appendChild(labelValor);
    nuevoServicioContainer.appendChild(labelValorP);
    nuevoServicioContainer.appendChild(btnEliminar);

    contenedor.appendChild(nuevoServicioContainer);
}
function agregarProducto(contenedor) {
    var nuevoProductoContainer = document.createElement("div");
    nuevoProductoContainer.className = "productoContainer d-flex align-items-center";

    // Crear el nuevo campo de selección para Producto
    var nuevoSelectProducto = document.createElement("select");
    nuevoSelectProducto.name = "productos[]";
    nuevoSelectProducto.className = "form-select";

    // Clonar las opciones desde el select original de Producto
    var opcionesProducto = document.getElementById("selectProducto").innerHTML;
    nuevoSelectProducto.innerHTML = opcionesProducto;

    // Crear el nuevo campo de cantidad
    var labelCantidad = document.createElement("label");
    labelCantidad.innerHTML = "Cantidad:";
    labelCantidad.className = "ms-3";

    var nuevaCantidad = document.createElement("input");
    nuevaCantidad.type = "number";
    nuevaCantidad.className = "form-control";
    nuevaCantidad.style.width = "90px";
    nuevaCantidad.value = "1";
    nuevaCantidad.min = "1";

    // Crear el nuevo campo de valor
    var labelValor = document.createElement("label");
    labelValor.innerHTML = "Valor:";
    labelValor.className = "ms-3";

    var nuevaValor = document.createElement("input");
    nuevaValor.type = "text";
    nuevaValor.className = "form-control";
    nuevaValor.placeholder = "250.000";
    nuevaValor.style.width = "90px";
    nuevaValor.readOnly = true;

    // Crear el botón para eliminar producto
    var btnEliminar = document.createElement("button");
    btnEliminar.type = "button";
    btnEliminar.className = "btn btn-soft-danger mt-2 ms-3";
    btnEliminar.innerHTML = '<i class="fa-solid fa-minus fa-lg"></i>';
    btnEliminar.onclick = function () {
        contenedor.removeChild(nuevoProductoContainer);
        contenedor.removeChild(btnEliminar);
    };

    // Agregar los elementos al contenedor
    nuevoProductoContainer.appendChild(nuevoSelectProducto);
    nuevoProductoContainer.appendChild(labelCantidad);
    nuevoProductoContainer.appendChild(nuevaCantidad);
    nuevoProductoContainer.appendChild(labelValor);
    nuevoProductoContainer.appendChild(nuevaValor);
    nuevoProductoContainer.appendChild(btnEliminar);

    contenedor.appendChild(nuevoProductoContainer);
}

function mostrarMensajeExito() {
    // Puedes personalizar el mensaje según tus necesidades
    Swal.fire({
        title: "¡Pedido actualizado!",
        text: "El pedido se ha actualizado de manera correcta.",
        icon: "success",
        confirmButtonText: "Aceptar"
    }).then((result) => {
        // Recarga la página después de cerrar la alerta
        if (result.isConfirmed) {
            location.reload();
        }
    });
}