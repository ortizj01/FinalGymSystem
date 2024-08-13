const formulario = document.getElementById('FormularioDevolucion');

if (formulario) {
    formulario.addEventListener("submit", function (event) {
        event.preventDefault();
        validateForm();
    });
}

document.addEventListener("DOMContentLoaded", function () {
    function validateNombreVenta (input) {
        const regex = /^[a-zA-Z\s]*$/;
        return regex.test(input.value.trim());
    }

    function validateIdVenta(input) {
        const regex = /^\d+$/;
        return regex.test(input.value.trim());
    }

    function validateMotivo(input) {
        const regex = /^[a-zA-Z\s]{8,70}$/;
        return regex.test(input.value.trim());
    }

    function updateErrorMessage(id, isValid, message) {
        const errorSpan = document.getElementById(id);
        errorSpan.textContent = isValid ? '' : message;
    }

    function validateForm() {
        const nombreInput = document.querySelector('input[name="NombreVenta"]');
        const productoInput = document.querySelector('select[name="productos"]');
        const idVentaInput = document.querySelector('input[name="IdVenta"]');
        const motivoInput = document.querySelector('textarea[name="Motivo"]');
    
        const isValidNombre = validateNombreVenta(nombreInput); // Corregir aquí
        const isValidProducto = productoInput.value !== "";
        const isValidIdVenta = validateIdVenta(idVentaInput);
        const isValidMotivo = validateMotivo(motivoInput);
    
        updateErrorMessage('nombre-error', isValidNombre, 'Solo se permiten letras y espacios en el nombre');
        updateErrorMessage('producto-error', isValidProducto, 'Seleccione un producto');
        updateErrorMessage('IdVenta-error', isValidIdVenta, 'Ingrese un ID de venta válido');
        updateErrorMessage('Motivo-error', isValidMotivo, 'Ingrese un motivo válido');
    
        if (isValidNombre && isValidProducto && isValidIdVenta && isValidMotivo) {
            alert('Formulario válido. Guardar información.');
        } else {
            alert('El formulario no es válido. Por favor, revisa los campos.');
        }
    }

    const guardarButton = document.querySelector('button[name="Guardar"]');
    if (guardarButton) {
        guardarButton.addEventListener("click", validateForm);
    }
});
