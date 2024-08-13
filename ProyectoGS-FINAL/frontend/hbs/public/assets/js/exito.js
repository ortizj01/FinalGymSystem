document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('confirmDeleteButton').addEventListener('click', () => {
        const alertContainer = document.querySelector('.alert-container');

        // Verificar si se encontró el contenedor
        if(alertContainer) {
            // Crear elemento de alerta
            const alert = document.createElement('div');
            alert.className = 'alert alert-primary d-flex align-items-center';
            alert.setAttribute('role', 'alert');

            // Contenido del elemento de alerta
            alert.innerHTML = `
                <svg class="bi flex-shrink-0 me-2" width="24" height="24">
                    <use xlink:href="#info-fill" />
                </svg>
                <div>
                    Elemento eliminado correctamente
                </div>
            `;

            // Agregar alerta al contenedor
            alertContainer.appendChild(alert);
        } else {
            console.error('No se encontró el contenedor de alertas');
        }
    });
});
