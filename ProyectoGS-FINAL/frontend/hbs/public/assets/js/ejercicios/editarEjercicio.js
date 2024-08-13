// JavaScript para manejar la carga y edición de ejercicios
document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');

    if (!token) {
        console.error('No se encontró el token');
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const ejercicioId = urlParams.get('id');

    const formulario = document.getElementById('formularioRegistro');

    if (ejercicioId) {
        try {
            const response = await fetch(`${url}/${ejercicioId}`, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-type': 'application/json; charset=UTF-8'
                }
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Error en la solicitud: ${response.statusText} - ${errorMessage}`);
            }

            const data = await response.json();
            const ejercicio = data.ejercicio;

            // Llenar los campos del formulario con los datos del ejercicio
            formulario.nombreEjercicio.value = ejercicio.NombreEjercicio || '';
            formulario.descripcionEjercicio.value = ejercicio.DescripcionEjercicio || '';
            formulario.repeticiones.value = ejercicio.RepeticionesEjercicio || '';
            formulario.estado.value = ejercicio.EstadoEjercicio || '1'; // Valor por defecto activo

            // Establecer el ID del ejercicio en un campo oculto
            document.getElementById('ejercicioId').value = ejercicio.IdEjercicio || '';

        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Manejar el envío del formulario de edición
    formulario.addEventListener('submit', async (event) => {
        event.preventDefault();

        const nombreEjercicio = formulario.nombreEjercicio.value;
        const descripcionEjercicio = formulario.descripcionEjercicio.value;
        const repeticiones = formulario.repeticiones.value;
        const estado = formulario.estado.value;
        const ejercicioId = formulario.ejercicioId.value;

        const ejercicioActualizado = {
            NombreEjercicio: nombreEjercicio,
            DescripcionEjercicio: descripcionEjercicio,
            RepeticionesEjercicio: repeticiones,
            EstadoEjercicio: estado
        };

        try {
            const response = await fetch(`${url}/${ejercicioId}`, {
                method: 'PUT',
                mode: 'cors',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-type': 'application/json; charset=UTF-8'
                },
                body: JSON.stringify(ejercicioActualizado)
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Error en la solicitud: ${response.statusText} - ${errorMessage}`);
            }

            const result = await response.json();
            console.log('Resultado:', result);

            // Cerrar el modal después de enviar el formulario
            const modal = new bootstrap.Modal(document.getElementById('registroModal'));
            modal.hide();

            // Redirigir a la lista de ejercicios después de actualizar
            window.location.href = 'ejercicios'; // Ajustar según la URL correcta de tu lista de ejercicios

        } catch (error) {
            console.error('Error:', error);
        }
    });
});
