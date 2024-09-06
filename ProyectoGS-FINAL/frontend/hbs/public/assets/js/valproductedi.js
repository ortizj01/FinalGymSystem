document.addEventListener('DOMContentLoaded', function() {
    const nombreProducto = document.getElementById('Nombreproducto');
    const precioProducto = document.getElementById('Precioproducto');
    const ivaProducto = document.getElementById('ivaproducto');

    const nombrePattern = /^[a-zA-Z0-9\s]{3,50}$/; // Ejemplo de validación para el nombre del producto
    const precioPattern = /^\d+(\.\d{1,2})?$/; // Ejemplo de validación para precio con hasta dos decimales
    const ivaPattern = /^\d{1,2}(\.\d{1,2})?$/; // Ejemplo de validación para IVA en porcentaje

    function validateInput(input, pattern) {
        if (!pattern.test(input.value)) {
            input.classList.add('input-error');
        } else {
            input.classList.remove('input-error');
        }
    }

    nombreProducto.addEventListener('keyup', function() {
        validateInput(nombreProducto, nombrePattern);
    });

    precioProducto.addEventListener('keyup', function() {
        validateInput(precioProducto, precioPattern);
    });

    ivaProducto.addEventListener('keyup', function() {
        validateInput(ivaProducto, ivaPattern);
    });

    nombreProducto.addEventListener('blur', function() {
        validateInput(nombreProducto, nombrePattern);
    });

    precioProducto.addEventListener('blur', function() {
        validateInput(precioProducto, precioPattern);
    });

    ivaProducto.addEventListener('blur', function() {
        validateInput(ivaProducto, ivaPattern);
    });
});
