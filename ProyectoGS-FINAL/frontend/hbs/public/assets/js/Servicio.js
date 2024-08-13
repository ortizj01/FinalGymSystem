function agregarProducto() {
    // Crear contenedor del nuevo producto
    var nuevoProductoContainer = document.createElement("div");
    nuevoProductoContainer.className = "productoContainer";

    // Crear select de servicios
    var nuevoSelect = document.createElement("select");
    nuevoSelect.name = "productos[]";
    nuevoSelect.style.width = "300px";

    // Copiar las opciones del select original
    var opciones = document.getElementById("selectProducto").innerHTML;
    nuevoSelect.innerHTML = opciones;

    // Crear botón de eliminar
    var btnEliminar = document.createElement("button");
    btnEliminar.type = "button";
    btnEliminar.className = "btn btn-soft-danger mt-2";
    btnEliminar.innerHTML = '<i class="fa-solid fa-minus fa-lg"></i>';
    btnEliminar.style.marginLeft = "50px";
    btnEliminar.onclick = function () {
        // Eliminar elementos al hacer clic en el botón eliminar
        document.getElementById("productosAgregados").removeChild(nuevoProductoContainer);
    };

    // Agregar elementos al contenedor del nuevo producto
    nuevoProductoContainer.appendChild(nuevoSelect);
    nuevoProductoContainer.appendChild(btnEliminar);

    // Agregar el nuevo producto al contenedor principal
    document.getElementById("productosAgregados").appendChild(nuevoProductoContainer);
}

// Nota: Asegúrate de que el contenedor principal (productosAgregados) ya esté presente en tu HTML.
