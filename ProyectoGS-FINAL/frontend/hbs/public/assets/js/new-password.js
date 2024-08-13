document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector('form');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Evitar el envío del formulario por defecto

        const newPassword = document.getElementById('pw-nueva').value;
        const confirmPassword = document.getElementById('pw-confirma').value;

        // Validación de contraseña: al menos 8 caracteres
        if (newPassword.length < 8) {
            alert('La contraseña debe tener al menos 8 caracteres');
            return; // Detener la ejecución si la validación falla
        }

        // Validación de coincidencia de contraseñas
        if (newPassword !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return; // Detener la ejecución si la validación falla
        }

        // Aquí podrías incluir la lógica para verificar si la contraseña ha sido utilizada anteriormente
        // Esta verificación normalmente se haría mediante una llamada a una base de datos o un servicio

        // Si todo está validado, podrías enviar el formulario aquí o realizar otras acciones necesarias
        // form.submit(); // Envía el formulario si todas las validaciones son exitosas
    });
});
