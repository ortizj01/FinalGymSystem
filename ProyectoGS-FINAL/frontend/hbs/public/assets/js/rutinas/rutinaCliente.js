// Función para obtener el ID del usuario autenticado
async function obtenerIdUsuario() {
    try {
        const token = localStorage.getItem('token');
        console.log('Token:', token);
        const response = await fetch('http://localhost:3000/api/auth/usuario-autenticado', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-token': token 
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener el ID del usuario');
        }

        const data = await response.json();
        console.log('Datos del usuario:', data); // Verifica la estructura de la respuesta
        return data.IdUsuario; // Asegúrate de que el ID esté en la propiedad correcta
    } catch (error) {
        console.error(error.message);
        return null;
    }
}

// Función para obtener la rutina asignada al cliente
async function obtenerRutinaAsignada(idUsuario) {
    try {
        const response = await fetch(`http://localhost:3000/api/rutinas/completa/${idUsuario}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener la rutina asignada');
        }

        const rutinaArray = await response.json();
        console.log('Datos de la rutina:', rutinaArray); // Verifica la estructura de la respuesta

        // Verifica si el array tiene al menos un elemento
        if (Array.isArray(rutinaArray) && rutinaArray.length > 0) {
            return rutinaArray[0]; // Devuelve la primera rutina en el array
        }

        return null; // Devuelve null si no hay rutinas
    } catch (error) {
        console.error(error.message);
        return null;
    }
}

// Función para mostrar la rutina en el frontend
function mostrarRutina(rutina) {
    const rutinaContainer = document.getElementById('rutina-container');

    if (rutinaContainer) {
        if (rutina) {
            let html = `<h1>Rutina: ${rutina.NombreRutina || 'Sin nombre'}</h1>`;
            
            for (const dia in rutina.DiasSemana) {
                html += `<h2>Día: ${dia}</h2><ul>`;
                
                rutina.DiasSemana[dia].forEach(ejercicio => {
                    html += `<li>
                                <strong>Ejercicio:</strong> ${ejercicio.NombreEjercicio || 'Sin nombre'} - 
                                <strong>Series:</strong> ${ejercicio.Series || 'Sin series'}
                            </li>`;
                });

                html += `</ul>`;
            }

            rutinaContainer.innerHTML = html;
        } else {
            rutinaContainer.innerHTML = '<h1>No hay rutinas asignadas</h1>';
        }
    } else {
        console.error('Elemento con id "rutina-container" no encontrado');
    }
}

// Inicializar la visualización de la rutina
async function init() {
    const idUsuario = await obtenerIdUsuario();
    if (idUsuario) {
        console.log('ID Usuario:', idUsuario);
        const rutina = await obtenerRutinaAsignada(idUsuario);
        console.log('Rutina:', rutina);
        mostrarRutina(rutina);
    } else {
        console.error('No se pudo obtener el ID del usuario');
    }
}

// Llamar a la función de inicialización cuando el documento esté listo
document.addEventListener('DOMContentLoaded', init);
