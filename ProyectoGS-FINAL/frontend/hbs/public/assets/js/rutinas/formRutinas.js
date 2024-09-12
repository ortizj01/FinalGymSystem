$(document).ready(function() {
    let titlesAdded = {};
    const urlParams = new URLSearchParams(window.location.search);
    const rutinaId = urlParams.get('rutinaId');

    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = '/ingresar';
        return;
    }

    function fetchWithAuth(url, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        options.headers = { ...options.headers, ...headers };
        return fetch(url, options);
    }

    function fetchEjercicios(rutinaId, getAll = true) {
        let url = 'https://finalgymsystem.onrender.com/api/ejercicios';
        if (rutinaId && !getAll) {
            url = `https://finalgymsystem.onrender.com/api/rutinas/${rutinaId}/detallada`;
        }
        return fetchWithAuth(url)
            .then(response => response.json())
            .catch(error => console.error('Error al obtener ejercicios:', error));
    }

    function fetchUsuarios() {
        return fetchWithAuth('https://finalgymsystem.onrender.com/api/usuariosRutina')
            .then(response => response.json())
            .then(usuarios => {
                // Aquí no filtramos por IdRol, asumiendo que la API ya maneja esto
                console.log('Usuarios obtenidos:', usuarios);
                return usuarios;
            })
            .catch(error => console.error('Error al obtener usuarios:', error));
    }

    function populateUsuarios() {
        fetchUsuarios().then(usuarios => {
            const usuarioSelect = $('#idUsuario');
            usuarioSelect.empty(); // Limpiar las opciones actuales

            // Añadir una opción por defecto
            usuarioSelect.append(`<option value="">Seleccione un usuario</option>`);

            // Añadir opciones dinámicamente
            usuarios.forEach(usuario => {
                usuarioSelect.append(`<option value="${usuario.IdUsuario}">${usuario.NombreCompleto}</option>`);
            });

            // Inicializar select2 después de agregar las opciones
            usuarioSelect.select2({
                placeholder: "Buscar cliente por Nombres o Apellidos",
                allowClear: true,
                width: '100%'
            });
        }).catch(error => {
            console.error('Error al obtener usuarios:', error);
        });
    }

    populateUsuarios();

    $('.day-button').on('click', function() {
        const day = $(this).data('day');
        renderExerciseForm(day);
    });

    

    function renderExerciseForm(day) {
        console.log(`Renderizando formulario para el día: ${day}`);
        $('.day-form').hide();
    
        let form = $(`#form-${day}`);
        if (form.length === 0) {
            const exerciseFormHTML = `
                <form id="form-${day}" class="day-form">
                    <h3 class="text-center">Rutina del ${day.charAt(0).toUpperCase() + day.slice(1)}</h3>
                    </br>
                    <div class="exercise-list"></div>
                    <button type="button" class="btn btn-primary btn-sm add-exercise" data-day="${day}">Agregar Ejercicio</button>
                </form>
            `;
            $('.form-container').append(exerciseFormHTML);
        }
    
        $(`#form-${day}`).show();
    }


    $(document).on('click', '.add-exercise', async function() {
        const day = $(this).data('day');
        const exerciseList = $(`#form-${day} .exercise-list`);
        const exerciseCount = exerciseList.children('.exercise-form').length;

        const ejercicios = await fetchEjercicios();

        // Si los títulos no se han agregado aún para este día
        if (!titlesAdded[day]) {
            titlesAdded[day] = true; // Marcar que los títulos ya fueron agregados para este día
        }

        const newExerciseForm = `
        <div class="exercise-form">
            <div class="form-group row justify-content-center">
                <div class="col-4">
                    ${exerciseCount === 0 ? '<h6 class="mb-0 mr-2">Ejercicios</h6>' : ''}
                    <label for="exercise-${day}-${exerciseCount}"></label>
                    <select class="form-control form-control-sm mx-auto" id="exercise-${day}-${exerciseCount}">
                        <option value="">Seleccione un ejercicio</option>
                        ${ejercicios.map(ejercicio => `<option value="${ejercicio.IdEjercicio}">${ejercicio.NombreEjercicio}</option>`).join('')}
                    </select>
                </div>
                <div class="col-3">
                    ${exerciseCount === 0 ? '<h6 class="mb-0 mr-2">Series</h6>' : ''}
                    <label for="series-${day}-${exerciseCount}"></label>
                    <input type="number" class="form-control form-control-sm mx-auto" id="series-${day}-${exerciseCount}" placeholder="Número de Series">
                </div>
                <div class="col-auto mt-4">
                    <button type="button" class="btn btn-success btn-sm add-field" data-day="${day}">+</button>
                    <button type="button" class="btn btn-danger btn-sm remove-field" data-day="${day}">-</button>
                </div>
            </div>
        </div>
    `;
        exerciseList.append(newExerciseForm);
    });

    const diasSemana = {
        lunes: 1,
        martes: 2,
        miercoles: 3,
        jueves: 4,
        viernes: 5,
        sabado: 6,
        domingo: 7
    };

    $(document).on('click', '.add-field', function() {
        const day = $(this).data('day');
        const exerciseList = $(`#form-${day} .exercise-list`);
        const exerciseCount = exerciseList.children('.exercise-form').length;

        const lastExerciseForm = exerciseList.children('.exercise-form').last();
        const newExerciseForm = lastExerciseForm.clone();
        const newExerciseFormId = `exercise-${day}-${exerciseCount}`;
        const newSeriesFormId = `series-${day}-${exerciseCount}`;

        newExerciseForm.find('select').attr('id', newExerciseFormId).val('');
        newExerciseForm.find('input').attr('id', newSeriesFormId).val('');

        // Actualizar el botón de eliminar para tener el día correcto
        newExerciseForm.find('.remove-field').attr('data-day', day);

        exerciseList.append(newExerciseForm);
    });

    // Manejar el evento de clic en el botón de eliminar ejercicio
    $(document).on('click', '.remove-field', function() {
        const exerciseForm = $(this).closest('.exercise-form');
        const ejercicioId = exerciseForm.find('select').val();
        const day = $(this).data('day'); // Día de la semana en texto, tomado del data-day del botón
        const dayNumber = diasSemana[day]; // Obtener el número correspondiente al día
    
        console.log(`Day: ${day}, DayNumber: ${dayNumber}`); // Para depuración
    
        if (ejercicioId) {
            const rutinaId = urlParams.get('rutinaId');
    
            // Verificar que el día de la semana sea válido
            if (dayNumber !== undefined) {
                // Enviar solicitud DELETE para eliminar el ejercicio de la rutina
                fetchWithAuth(`https://finalgymsystem.onrender.com/api/rutinas/${rutinaId}/ejercicios/${ejercicioId}/${dayNumber}`, {
                    method: 'DELETE'
                })
                .then(response => {
                    if (response.ok) {
                        // Si la eliminación fue exitosa, remueve el formulario de ejercicio
                        exerciseForm.remove();
                        Swal.fire({
                            icon: 'success',
                            title: 'Ejercicio eliminado',
                            text: 'El ejercicio ha sido eliminado exitosamente de la rutina.',
                        });
                    } else {
                        return response.json().then(data => {
                            throw new Error(data.error || 'Error al eliminar el ejercicio');
                        });
                    }
                })
                .catch(error => {
                    console.error('Error al eliminar el ejercicio:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se pudo eliminar el ejercicio. Inténtalo nuevamente.',
                    });
                });
            } else {
                if (dayNumber === undefined) {
                    console.error('El día de la semana es indefinido.');
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'El día de la semana seleccionado es inválido. Inténtalo nuevamente.',
                    });
                    return;
                }
            }
        } else {
            // Si no hay un idEjercicio asociado (es un nuevo campo sin guardar), simplemente elimina el formulario
            exerciseForm.remove();
        }
    });
    
    let loadedExercises = {}; // Objeto para almacenar los ejercicios por día

function loadRoutineData(rutinaId) {
    fetchWithAuth(`https://finalgymsystem.onrender.com/api/rutinas/${rutinaId}`)
        .then(response => response.json())
        .then(async data => {
            console.log('Datos de la rutina recibidos:', data);

            $('input[name="nombreRutina"]').val(data.NombreRutina);
            $('select[name="idUsuario"]').val(data.IdUsuario).trigger('change');

            // Elimina la clase 'active' de todos los botones
            $('.day-button').removeClass('active');

            // Verifica el valor de DiaSemana
            console.log(`Día de la semana recibido: ${data.DiaSemana}`);
            
            // Activa el botón correspondiente al día seleccionado
            const dayButton = $(`#btn-dia-${data.DiaSemana}`);
            console.log('Botón a activar:', dayButton);

            $('#estadoRutinaContainer').show();
            $('select[name="estadoRutina"]').val(data.EstadoRutina);

            const ejercicios = await fetchEjercicios();
            console.log('Ejercicios obtenidos:', ejercicios);

            if (data.Ejercicios !== undefined) {
                data.Ejercicios.forEach(ejercicio => {
                    console.log('Ejercicio:', ejercicio);

                    const day = Object.keys(diasSemana).find(key => diasSemana[key] === ejercicio.DiaSemana);
                    if (day) {
                        if (!loadedExercises[day]) loadedExercises[day] = []; // Inicializar si no existe

                        // Evitar duplicación si el ejercicio ya fue cargado
                        if (loadedExercises[day].some(e => e.IdEjercicio === ejercicio.IdEjercicio)) {
                            return;
                        }

                        // Agregar el ejercicio a la lista de ejercicios cargados para este día
                        loadedExercises[day].push(ejercicio);

                        renderExerciseForm(day);
                        const exerciseList = $(`#form-${day} .exercise-list`);
                        const exerciseCount = exerciseList.children('.exercise-form').length;

                        const optionsHTML = ejercicios.map(e => `<option value="${e.IdEjercicio}" ${e.IdEjercicio === ejercicio.IdEjercicio ? 'selected' : ''}>${e.NombreEjercicio}</option>`).join('');

                        // Si los títulos no se han agregado aún para este día
                        if (!titlesAdded[day]) {
                            titlesAdded[day] = true;
                        }

                        const newExerciseForm = `
                            <div class="exercise-form">
                                <div class="form-group row justify-content-center">
                                    <div class="col-4">
                                        ${exerciseCount === 0 ? '<h6 class="mb-0 mr-2">Ejercicios</h6>' : ''}
                                        <label for="exercise-${day}-${exerciseCount}"></label>
                                        <select class="form-control form-control-sm mx-auto" id="exercise-${day}-${exerciseCount}">
                                            <option value="">Seleccione un ejercicio</option>
                                            ${optionsHTML}
                                        </select>
                                    </div>
                                    <div class="col-3">
                                        ${exerciseCount === 0 ? '<h6 class="mb-0 mr-2">Series</h6>' : ''}
                                        <label for="series-${day}-${exerciseCount}"></label>
                                        <input type="number" class="form-control form-control-sm mx-auto" id="series-${day}-${exerciseCount}" placeholder="Número de Series" value="${ejercicio.Series || 0}">
                                    </div>
                                    <div class="col-auto mt-4">
                                        <button type="button" class="btn btn-success btn-sm add-field" data-day="${day}">+</button>
                                        <button type="button" class="btn btn-danger btn-sm remove-field" data-day="${day}">-</button>
                                    </div>
                                </div>
                            </div>
                        `;
                        exerciseList.append(newExerciseForm);
                    } else {
                        console.error(`No se encontró un día correspondiente para el número ${ejercicio.DiaSemana}`);
                    }
                });
            }
        })
        .catch(error => console.error('Error al obtener la rutina:', error));
}

    

    if (rutinaId) {
        loadRoutineData(rutinaId);
    }

    function validateForm() {
        let isValid = true;

        // Validar nombreRutina
        const nombreRutina = $('input[name="nombreRutina"]').val().trim();
        if (nombreRutina === '') {
            isValid = false;
            $('#grupo__nombreRutina').addClass('formularioRegistro__grupo-incorrecto');
            $('#grupo__nombreRutina .formularioRegistro__input-error').show();
        } else {
            $('#grupo__nombreRutina').removeClass('formularioRegistro__grupo-incorrecto');
            $('#grupo__nombreRutina .formularioRegistro__input-error').hide();
        }

        // Validar idUsuario
        const idUsuario = $('select[name="idUsuario"]').val();
        if (idUsuario === '') {
            isValid = false;
            $('#grupo__idUsuario').addClass('formularioRegistro__grupo-incorrecto');
            $('#grupo__idUsuario .formularioRegistro__input-error').show();
        } else {
            $('#grupo__idUsuario').removeClass('formularioRegistro__grupo-incorrecto');
            $('#grupo__idUsuario .formularioRegistro__input-error').hide();
        }

        // Validar ejercicios
        $('.exercise-form').each(function() {
            const ejercicioId = $(this).find('select').val();
            const series = $(this).find('input').val().trim();

            if (ejercicioId === '') {
                isValid = false;
                $(this).find('select').addClass('is-invalid');
            } else {
                $(this).find('select').removeClass('is-invalid');
            }

            if (series === '' || isNaN(series) || series <= 0) {
                isValid = false;
                $(this).find('input').addClass('is-invalid');
            } else {
                $(this).find('input').removeClass('is-invalid');
            }
        });

        return isValid;
    }

    $('#formularioRegistro').on('submit', function(e) {
        e.preventDefault();
    
        if (!validateForm()) {
            Swal.fire({
                icon: 'error',
                title: 'Formulario inválido',
                text: 'Por favor, complete todos los campos requeridos correctamente.'
            });
            return;
        }
    
        const nombreRutina = $('input[name="nombreRutina"]').val();
        const idUsuario = $('select[name="idUsuario"]').val();
    
        const rutinaData = {
            NombreRutina: nombreRutina,
            EstadoRutina: 1,
            IdUsuario: idUsuario
        };
    
        const method = rutinaId ? 'PUT' : 'POST';
        const endpoint = rutinaId ? `https://finalgymsystem.onrender.com/api/rutinas/${rutinaId}` : 'https://finalgymsystem.onrender.com/api/rutinas';
    
        if (rutinaId) {
            const estadoRutina = $('select[name="estadoRutina"]').val();
            rutinaData['EstadoRutina'] = estadoRutina;
        }
    
        fetchWithAuth(endpoint, {
            method: method,
            body: JSON.stringify(rutinaData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const newRutinaId = data.id || rutinaId;
            const promises = [];
    
            // Obtener los ejercicios existentes en la rutina
            return fetchWithAuth(`https://finalgymsystem.onrender.com/api/rutinas/${newRutinaId}/ejercicios`)
            .then(response => response.json())
            .then(existingExercises => {
                const existingExerciseMap = {};
                existingExercises.forEach(exercise => {
                    existingExerciseMap[`${exercise.IdEjercicio}-${exercise.DiaSemana}`] = exercise.IdRutinaEjercicio; // Guarda el ID de la relación
                });
    
                // Manejo de ejercicios en el formulario
                const addedExercises = {};
    
                Object.keys(diasSemana).forEach(day => {
                    const dayNumber = diasSemana[day];
                    const exerciseList = $(`#form-${day} .exercise-form`);
    
                    exerciseList.each(function() {
                        const ejercicioId = $(this).find('select').val();
                        const series = $(this).find('input').val();
    
                        if (ejercicioId) {
                            const key = `${ejercicioId}-${dayNumber}`;
                            if (!addedExercises[key]) {
                                addedExercises[key] = true;
    
                                if (existingExerciseMap[key]) {
                                    // Si el ejercicio ya existe, actualizamos las series si son diferentes
                                    const promise = fetchWithAuth(`https://finalgymsystem.onrender.com/api/rutinas/${newRutinaId}/ejercicios/${existingExerciseMap[key]}/detalles`, {
                                        method: 'PUT',
                                        body: JSON.stringify({ Series: series })
                                    });
    
                                    promises.push(promise);
                                    delete existingExerciseMap[key]; // Quitamos este ejercicio del mapa ya que lo estamos manejando
                                } else {
                                    // Si el ejercicio no existe, lo agregamos
                                    const promise = fetchWithAuth(`https://finalgymsystem.onrender.com/api/rutinas/${newRutinaId}/ejercicios`, {
                                        method: 'POST',
                                        body: JSON.stringify({ IdEjercicio: ejercicioId })
                                    })
                                    .then(response => response.json())
                                    .then(data => {
                                        const detallePromise = fetchWithAuth(`https://finalgymsystem.onrender.com/api/rutinas/${newRutinaId}/ejercicios/${data.id}/detalles`, {
                                            method: 'POST',
                                            body: JSON.stringify({ DiaSemana: dayNumber, Series: series })
                                        });
    
                                        promises.push(detallePromise);
                                    });
    
                                    promises.push(promise);
                                }
                            }
                        }
                    });
                });
    
                // Eliminar los ejercicios que ya no están en el formulario
                Object.keys(existingExerciseMap).forEach(key => {
                    const rutinaEjercicioId = existingExerciseMap[key];
                    const deletePromise = fetchWithAuth(`https://finalgymsystem.onrender.com/api/rutinas/${newRutinaId}/ejercicios/${rutinaEjercicioId}`, {
                        method: 'DELETE'
                    });
                    promises.push(deletePromise);
                });
    
                return Promise.all(promises);
            });
        })
        .then(() => {
            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Rutina guardada exitosamente.'
            }).then(() => {
                window.location.href = '/rutinas';
            });
        })
        .catch(error => {
            console.error('Error al guardar la rutina:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un error al guardar la rutina.'
            });
        });
    });
    

   // Mostrar mensaje de error cuando cambian los campos
   $(document).on('change', '.exercise-form select, .exercise-form input', function() {
    const day = $(this).closest('form').attr('id').split('-')[1];
    const exerciseIndex = $(this).closest('.exercise-form').index();
    validateField($(this).closest('.exercise-form').find('select'), $(this).closest('.exercise-form').find('input'), exerciseIndex);
});

function validateField(select, input, index) {
    if (select.val() === '') {
        select.addClass('is-invalid');
    } else {
        select.removeClass('is-invalid');
    }

    if (input.val().trim() === '' || isNaN(input.val()) || input.val() <= 0) {
        input.addClass('is-invalid');
    } else {
        input.removeClass('is-invalid');
    }
}
});

document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.day-button');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
});