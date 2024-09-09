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
        1: 'Lunes',
        2: 'Martes',
        3: 'Miércoles',
        4: 'Jueves',
        5: 'Viernes',
        6: 'Sábado',
        7: 'Domingo'
    };
    return diasSemana[numeroDia] || 'Día desconocido';
}

function toggleExerciseDisplay(button) {
    const targetId = button.getAttribute('data-target');
    const additionalExercises = document.getElementById(targetId);
    const card = button.closest('.card');

    if (additionalExercises.style.maxHeight === '0px' || additionalExercises.style.maxHeight === '') {
        additionalExercises.style.maxHeight = `${additionalExercises.scrollHeight}px`;
        card.classList.add('expanded');
        button.textContent = '-';
    } else {
        additionalExercises.style.maxHeight = '0px';
        card.classList.remove('expanded');
        button.textContent = '+';
    }
}



// Añadir eventos después de que el contenido esté listo
function attachToggleEvents() {
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            toggleExerciseDisplay(this);
        });
    });
}

// Modificar la función `mostrarRutina` para llamar a `attachToggleEvents`
function mostrarRutina(rutina) {
    const rutinaContainer = document.getElementById('rutina-container');

    if (rutinaContainer) {
        if (rutina) {
            let html = `<h2 class="text-center">Rutina Asignada - ${rutina.NombreRutina || 'Sin nombre'}</h2><br>`;
            html += '<div class="card-container">'; // Contenedor para flexbox
            
            let cardIndex = 0;
            for (const dia in rutina.DiasSemana) {
                const nombreDia = obtenerNombreDia(dia); // Convertir número a nombre del día
                const ejercicios = rutina.DiasSemana[dia];
                html += `
                    <div class="card">
                        <div class="card-header">
                            ${nombreDia}
                        </div>
                        <div class="card-body">
                            <div class="card-exercise">
                                <h5 class="card-title">${ejercicios[0].NombreEjercicio || 'Sin nombre'}</h5>
                                <p class="card-text">${ejercicios[0].DescripcionEjercicio || 'Sin descripción'}</p>
                                <p class="card-repeticiones"><strong>Repeticiones:</strong> ${ejercicios[0].RepeticionesEjercicio || 'Sin Repeticiones:'}</p>
                                <p class="card-series"><strong>Series:</strong> ${ejercicios[0].Series || 'Sin series'}</p>
                            </div>
                            ${ejercicios.length > 1 ? `
                                <div class="additional-exercises" id="exercises-${cardIndex}">
                                    ${ejercicios.slice(1).map(ejercicio => `
                                        <div class="card-exercise">
                                            <h5 class="card-title">${ejercicio.NombreEjercicio || 'Sin nombre'}</h5>
                                            <p class="card-text">${ejercicio.DescripcionEjercicio || 'Sin descripción'}</p>
                                            <p class="card-repeticiones"><strong>Repeticiones:</strong> ${ejercicio.RepeticionesEjercicio || 'Sin Repeticiones'}</p>
                                            <p class="card-series"><strong>Series:</strong> ${ejercicio.Series || 'Sin series'}</p>
                                        </div>
                                    `).join('')}
                                </div>
                                <button class="toggle-btn btn-show" data-target="exercises-${cardIndex}">+</button>
                            ` : ''}
                        </div>
                    </div>
                `;
                cardIndex++;
            }

            html += '</div>'; // Cerrar contenedor de tarjetas
            rutinaContainer.innerHTML = html;
            attachToggleEvents(); // Importante: esto debe ser llamado después de crear las tarjetas
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

document.addEventListener('DOMContentLoaded', init);
