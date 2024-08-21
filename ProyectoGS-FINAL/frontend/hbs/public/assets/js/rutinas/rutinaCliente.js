// Función para obtener el ID del usuario autenticado
async function obtenerIdUsuario() {
    try {
        const token = localStorage.getItem('token');
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
        return data.IdUsuario;
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
        if (Array.isArray(rutinaArray) && rutinaArray.length > 0) {
            return rutinaArray[0];
        }

        return null;
    } catch (error) {
        console.error(error.message);
        return null;
    }
}

// Función para convertir número de día a nombre del día en español
function obtenerNombreDia(numeroDia) {
    const diasSemana = {
        1: 'LUNES',
        2: 'MARTES',
        3: 'MIÉRCOLES',
        4: 'JUEVES',
        5: 'VIERNES',
        6: 'SÁBADO',
        7: 'DOMINGO'
    };
    return diasSemana[numeroDia] || 'Día desconocido';
}

// Función para mostrar la rutina en el frontend
function mostrarRutina(rutina) {
    const rutinaContainer = document.getElementById('rutina-container');

    if (rutinaContainer) {
        if (rutina) {
            let html = `<h2 class="text-center">Rutina Asignada - ${rutina.NombreRutina || 'Sin nombre'}</h2> <br>`;
            
            for (const dia in rutina.DiasSemana) {
                const nombreDia = obtenerNombreDia(dia); // Convertir número a nombre del día
                html += `
                    <div class="accordion text-center">${nombreDia}</div>
                    <div class="panel">
                        <ul class="ejercicio-list">
                `;
                
                rutina.DiasSemana[dia].forEach(ejercicio => {
                    html += `
                        <li>
                            <div class="ejercicio-info">
                                <strong>Ejercicio:</strong> ${ejercicio.NombreEjercicio || 'Sin nombre'}<br>
                                <strong>Descripción:</strong> ${ejercicio.DescripcionEjercicio || 'Sin descripción'}
                            </div>
                            <div class="ejercicio-series">
                                <strong>Series:</strong> ${ejercicio.Series || 'Sin series'}
                            </div>
                        </li>
                    `;
                });

                html += `</ul></div>`;
            }

            rutinaContainer.innerHTML = html;

            // Agregar funcionalidad de acordeón
            const accordions = document.querySelectorAll('.accordion');
            accordions.forEach(accordion => {
                accordion.addEventListener('click', function() {
                    this.classList.toggle('active');
                    const panel = this.nextElementSibling;
                    panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
                });
            });
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
        const rutina = await obtenerRutinaAsignada(idUsuario);
        mostrarRutina(rutina);
    } else {
        console.error('No se pudo obtener el ID del usuario');
    }
}

// Llamar a la función de inicialización cuando el documento esté listo
document.addEventListener('DOMContentLoaded', init);
