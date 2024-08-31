$(document).ready(function() {
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
        let url = 'http://localhost:3000/api/ejercicios';
        if (rutinaId && !getAll) {
            url = `http://localhost:3000/api/rutinas/${rutinaId}/detallada`;
        }
        return fetchWithAuth(url)
            .then(response => response.json())
            .catch(error => console.error('Error al obtener ejercicios:', error));
    }

    function fetchUsuarios() {
        return fetchWithAuth('http://localhost:3000/api/usuariosRutina')
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

    const diasSemana = {
        lunes: 1,
        martes: 2,
        miercoles: 3,
        jueves: 4,
        viernes: 5,
        sabado: 6,
        domingo: 7
    };

    function renderExerciseForm(day) {
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

    let isTitleAdded = false; // Bandera para evitar repetición de títulos


    $(document).on('click', '.add-exercise', async function() {
        const day = $(this).data('day');
        const exerciseList = $(`#form-${day} .exercise-list`);
        const exerciseCount = exerciseList.children('.exercise-form').length;

        const ejercicios = await fetchEjercicios();

        const newExerciseForm = `
            <div class="exercise-form">
                <div class="form-group row justify-content-center">
                    <div class="col-4">
                    ${!isTitleAdded ? '<h6 class="mb-0 mr-2">Ejercicios</h6>' : ''}
                        <label for="exercise-${day}-${exerciseCount}"></label>
                        <select class="form-control form-control-sm mx-auto" id="exercise-${day}-${exerciseCount}">
                            <option value="">Seleccione un ejercicio</option>
                            ${ejercicios.map(ejercicio => `<option value="${ejercicio.IdEjercicio}">${ejercicio.NombreEjercicio}</option>`).join('')}
                        </select>
                    </div>
                    <div class="col-3">
                    ${!isTitleAdded ? '<h6 class="mb-0 mr-2">Series</h6>' : ''}
                        <label for="series-${day}-${exerciseCount}"></label>
                        <input type="number" class="form-control form-control-sm mx-auto" id="series-${day}-${exerciseCount}" placeholder="Número de Series">
                    </div>
                    <div class="col-auto mt-4">
                        <button type="button" class="btn btn-success btn-sm add-field" data-day="${day}">+</button>
                        <button type="button" class="btn btn-danger btn-sm remove-field">-</button>
                    </div>
                </div>
            </div>
        `;

        exerciseList.append(newExerciseForm);
        isTitleAdded = true; // Se establece la bandera para no repetir los títulos
    });

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

        exerciseList.append(newExerciseForm);
    });

    $(document).on('click', '.remove-field', function() {
        $(this).closest('.exercise-form').remove();
    });

    function loadRoutineData(rutinaId) {
        fetchWithAuth(`http://localhost:3000/api/rutinas/${rutinaId}`)
            .then(response => response.json())
            .then(async data => {
                console.log('Datos de la rutina recibidos:', data);
    
                $('input[name="nombreRutina"]').val(data.NombreRutina);
                $('select[name="idUsuario"]').val(data.IdUsuario);
    
                $('#estadoRutinaContainer').show();
                $('select[name="estadoRutina"]').val(data.EstadoRutina);
    
                const ejercicios = await fetchEjercicios();
    
                if (data.Ejercicios !== undefined) {
                    data.Ejercicios.forEach(ejercicio => {
                        console.log('Ejercicio:', ejercicio); // Depuración
    
                        const day = Object.keys(diasSemana).find(key => diasSemana[key] === ejercicio.DiaSemana);
                        renderExerciseForm(day);
    
                        const exerciseList = $(`#form-${day} .exercise-list`);
                        const exerciseCount = exerciseList.children('.exercise-form').length;
    
                        const optionsHTML = ejercicios.map(e => `<option value="${e.IdEjercicio}" ${e.IdEjercicio === ejercicio.IdEjercicio ? 'selected' : ''}>${e.NombreEjercicio}</option>`).join('');
    
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
                                        <button type="button" class="btn btn-danger btn-sm remove-field">-</button>
                                    </div>
                                </div>
                            </div>
                        `;
    
                        exerciseList.append(newExerciseForm);
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
        const endpoint = rutinaId ? `http://localhost:3000/api/rutinas/${rutinaId}` : 'http://localhost:3000/api/rutinas';

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

            const addedExercises = {};

            Object.keys(diasSemana).forEach(day => {
                const dayNumber = diasSemana[day];
                const exerciseList = $(`#form-${day} .exercise-form`);

                exerciseList.each(function() {
                    const ejercicioId = $(this).find('select').val();
                    const series = $(this).find('input').val();
                    if (ejercicioId) {
                        if (!addedExercises[dayNumber]) {
                            addedExercises[dayNumber] = new Set();
                        }
                        if (!addedExercises[dayNumber].has(ejercicioId)) {
                            const promise = fetchWithAuth(`http://localhost:3000/api/rutinas/${newRutinaId}/ejercicios`, {
                                method: 'POST',
                                body: JSON.stringify({ IdEjercicio: ejercicioId })
                            })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error(`HTTP error! status: ${response.status}`);
                                }
                                return response.json();
                            })
                            .then(data => {
                                const detallePromise = fetchWithAuth(`http://localhost:3000/api/rutinas/${newRutinaId}/ejercicios/${data.id}/detalles`, {
                                    method: 'POST',
                                    body: JSON.stringify({ DiaSemana: dayNumber, Series: series })
                                });

                                promises.push(detallePromise);
                                addedExercises[dayNumber].add(ejercicioId);
                            });

                            promises.push(promise);
                        }
                    }
                });
            });

            return Promise.all(promises);
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
// $(document).ready(function() {
//     const urlParams = new URLSearchParams(window.location.search);
//     const rutinaId = urlParams.get('rutinaId');

//     const token = localStorage.getItem('token');

//     if (!token) {
//         window.location.href = '/ingresar';
//         return;
//     }

//     function fetchWithAuth(url, options = {}) {
//         const headers = {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//         };
//         options.headers = { ...options.headers, ...headers };
//         return fetch(url, options);
//     }

//     function fetchEjercicios(rutinaId, getAll = true) {
//         let url = 'http://localhost:3000/api/ejercicios';
//         if (rutinaId && !getAll) {
//             url = `http://localhost:3000/api/rutinas/${rutinaId}/detallada`;
//         }
//         return fetchWithAuth(url)
//             .then(response => response.json())
//             .catch(error => console.error('Error al obtener ejercicios:', error));
//     }

//     function fetchUsuarios() {
//         return fetchWithAuth('http://localhost:3000/api/usuariosRutina')
//             .then(response => response.json())
//             .then(usuarios => {
//                 // Aquí no filtramos por IdRol, asumiendo que la API ya maneja esto
//                 console.log('Usuarios obtenidos:', usuarios);
//                 return usuarios;
//             })
//             .catch(error => console.error('Error al obtener usuarios:', error));
//     }

//     function populateUsuarios() {
//         fetchUsuarios().then(usuarios => {
//             const usuarioSelect = $('#idUsuario');
//             usuarioSelect.empty(); // Limpiar las opciones actuales
//             usuarios.forEach(usuario => {
//                 usuarioSelect.append(`<option value="${usuario.IdUsuario}">${usuario.NombreCompleto}</option>`);
//             });
//             usuarioSelect.select2({
//                 placeholder: "Buscar cliente por Nombres o Apellidos",
//                 allowClear: true,
//                 width: '100%',
//             });
//         });
//     }

//     populateUsuarios();

//     $('.day-button').on('click', function() {
//         const day = $(this).data('day');
//         renderExerciseForm(day);
//     });

//     const diasSemana = {
//         lunes: 1,
//         martes: 2,
//         miercoles: 3,
//         jueves: 4,
//         viernes: 5,
//         sabado: 6,
//         domingo: 7
//     };

//     function renderExerciseForm(day) {
//         $('.day-form').hide();

//         let form = $(`#form-${day}`);
//         if (form.length === 0) {
//             const exerciseFormHTML = `
//                 <form id="form-${day}" class="day-form">
//                     <h3 class="text-center">Rutina del ${day.charAt(0).toUpperCase() + day.slice(1)}</h3>
//                     </br>
//                     <div class="exercise-list"></div>
//                     <button type="button" class="btn btn-primary btn-sm add-exercise" data-day="${day}">Agregar Ejercicio</button>
//                 </form>
//             `;
//             $('.form-container').append(exerciseFormHTML);
//         }

//         $(`#form-${day}`).show();
//     }

//     let isTitleAdded = false; // Bandera para evitar repetición de títulos

//     $(document).on('click', '.add-exercise', async function() {
//         const day = $(this).data('day');
//         const exerciseList = $(`#form-${day} .exercise-list`);
//         const exerciseCount = exerciseList.children('.exercise-form').length;

//         const ejercicios = await fetchEjercicios();

//         const newExerciseForm = `
//             <div class="exercise-form">
//                 <div class="form-group row justify-content-center">
//                     <div class="col-4">
//                         ${!isTitleAdded ? '<h6 class="mb-0 mr-2">Ejercicios</h6>' : ''}
//                         <label for="exercise-${day}-${exerciseCount}"></label>
//                         <select class="form-control form-control-sm mx-auto" id="exercise-${day}-${exerciseCount}">
//                             <option value="">Seleccione un ejercicio</option>
//                             ${ejercicios.map(ejercicio => `<option value="${ejercicio.IdEjercicio}">${ejercicio.NombreEjercicio}</option>`).join('')}
//                         </select>
//                     </div>
//                     <div class="col-3">
//                         ${!isTitleAdded ? '<h6 class="mb-0 mr-2">Series</h6>' : ''}
//                         <label for="series-${day}-${exerciseCount}"></label>
//                         <input type="number" class="form-control form-control-sm mx-auto" id="series-${day}-${exerciseCount}" placeholder="Número de Series">
//                     </div>
//                     <div class="col-auto mt-4">
//                         <button type="button" class="btn btn-success btn-sm add-field" data-day="${day}">+</button>
//                         <button type="button" class="btn btn-danger btn-sm remove-field">-</button>
//                     </div>
//                 </div>
//             </div>
//         `;

//         exerciseList.append(newExerciseForm);
//         isTitleAdded = true; // Se establece la bandera para no repetir los títulos
//     });

//     $(document).on('click', '.add-field', function() {
//         const day = $(this).data('day');
//         const exerciseList = $(`#form-${day} .exercise-list`);
//         const exerciseCount = exerciseList.children('.exercise-form').length;

//         const lastExerciseForm = exerciseList.children('.exercise-form').last();
//         const newExerciseForm = lastExerciseForm.clone();
//         const newExerciseFormId = `exercise-${day}-${exerciseCount}`;
//         const newSeriesFormId = `series-${day}-${exerciseCount}`;
//         newExerciseForm.find('select').attr('id', newExerciseFormId).val('');
//         newExerciseForm.find('input').attr('id', newSeriesFormId).val('');

//         exerciseList.append(newExerciseForm);
//     });

//     $(document).on('click', '.remove-field', function() {
//         $(this).closest('.exercise-form').remove();
//     });

//     function loadRoutineData(rutinaId) {
//         fetchWithAuth(`http://localhost:3000/api/rutinas/${rutinaId}`)
//             .then(response => response.json())
//             .then(async data => {
//                 console.log('Datos de la rutina recibidos:', data);
    
//                 $('input[name="nombreRutina"]').val(data.NombreRutina);
//                 $('select[name="idUsuario"]').val(data.IdUsuario);
    
//                 $('#estadoRutinaContainer').show();
//                 $('select[name="estadoRutina"]').val(data.EstadoRutina);
    
//                 const ejercicios = await fetchEjercicios();
    
//                 if (data.Ejercicios !== undefined) {
//                     data.Ejercicios.forEach(ejercicio => {
//                         console.log('Ejercicio:', ejercicio); // Depuración
    
//                         const day = Object.keys(diasSemana).find(key => diasSemana[key] === ejercicio.DiaSemana);
//                         renderExerciseForm(day);
    
//                         const exerciseList = $(`#form-${day} .exercise-list`);
//                         const exerciseCount = exerciseList.children('.exercise-form').length;
    
//                         const optionsHTML = ejercicios.map(e => `<option value="${e.IdEjercicio}" ${e.IdEjercicio === ejercicio.IdEjercicio ? 'selected' : ''}>${e.NombreEjercicio}</option>`).join('');
    
//                         const newExerciseForm = `
//                             <div class="exercise-form">
//                                 <div class="form-group row justify-content-center">
//                                     <div class="col-4">
//                                         ${exerciseCount === 0 ? '<h6 class="mb-0 mr-2">Ejercicios</h6>' : ''}
//                                         <label for="exercise-${day}-${exerciseCount}"></label>
//                                         <select class="form-control form-control-sm mx-auto" id="exercise-${day}-${exerciseCount}">
//                                             <option value="">Seleccione un ejercicio</option>
//                                             ${optionsHTML}
//                                         </select>
//                                     </div>
//                                     <div class="col-3">
//                                         ${exerciseCount === 0 ? '<h6 class="mb-0 mr-2">Series</h6>' : ''}
//                                         <label for="series-${day}-${exerciseCount}"></label>
//                                         <input type="number" class="form-control form-control-sm mx-auto" id="series-${day}-${exerciseCount}" placeholder="Número de Series" value="${ejercicio.Series || 0}">
//                                     </div>
//                                     <div class="col-auto mt-4">
//                                         <button type="button" class="btn btn-success btn-sm add-field" data-day="${day}">+</button>
//                                         <button type="button" class="btn btn-danger btn-sm remove-field">-</button>
//                                     </div>
//                                 </div>
//                             </div>
//                         `;
    
//                         exerciseList.append(newExerciseForm);
//                     });
//                 }
//             })
//             .catch(error => console.error('Error al obtener la rutina:', error));
//     }
    
//     if (rutinaId) {
//         loadRoutineData(rutinaId);
//     }

//     function validateForm() {
//         let isValid = true;

//         // Validar nombreRutina
//         const nombreRutina = $('input[name="nombreRutina"]').val().trim();
//         if (nombreRutina === '') {
//             isValid = false;
//             $('#grupo__nombreRutina').addClass('formularioRegistro__grupo-incorrecto');
//             $('#grupo__nombreRutina .formularioRegistro__input-error').text('El nombre de la rutina es obligatorio.');
//         } else {
//             $('#grupo__nombreRutina').removeClass('formularioRegistro__grupo-incorrecto');
//             $('#grupo__nombreRutina .formularioRegistro__input-error').text('');
//         }

//         // Validar estadoRutina
//         const estadoRutina = $('select[name="estadoRutina"]').val();
//         if (estadoRutina === '') {
//             isValid = false;
//             $('#grupo__estadoRutina').addClass('formularioRegistro__grupo-incorrecto');
//             $('#grupo__estadoRutina .formularioRegistro__input-error').text('Debe seleccionar un estado para la rutina.');
//         } else {
//             $('#grupo__estadoRutina').removeClass('formularioRegistro__grupo-incorrecto');
//             $('#grupo__estadoRutina .formularioRegistro__input-error').text('');
//         }

//         // Validar ejercicios
//         $('.exercise-form').each(function() {
//             const exerciseId = $(this).find('select').val();
//             const series = $(this).find('input').val().trim();

//             if (exerciseId === '' || series === '') {
//                 isValid = false;
//                 $(this).addClass('formularioRegistro__grupo-incorrecto');
//             } else {
//                 $(this).removeClass('formularioRegistro__grupo-incorrecto');
//             }
//         });

//         return isValid;
//     }

//     $('#formularioRegistro').on('submit', function(event) {
//         event.preventDefault();

//         if (validateForm()) {
//             const nombreRutina = $('input[name="nombreRutina"]').val().trim();
//             const estadoRutina = $('select[name="estadoRutina"]').val();

//             const ejercicios = [];
//             $('.exercise-form').each(function() {
//                 const exerciseId = $(this).find('select').val();
//                 const series = $(this).find('input').val().trim();

//                 if (exerciseId !== '' && series !== '') {
//                     ejercicios.push({
//                         IdEjercicio: exerciseId,
//                         Series: series
//                     });
//                 }
//             });

//             const data = {
//                 NombreRutina: nombreRutina,
//                 EstadoRutina: estadoRutina,
//                 Ejercicios: ejercicios
//             };

//             fetchWithAuth(`http://localhost:3000/api/rutinas/${rutinaId}`, {
//                 method: 'PUT',
//                 body: JSON.stringify(data)
//             })
//             .then(response => {
//                 if (response.ok) {
//                     return response.json();
//                 } else {
//                     throw new Error('Error al actualizar la rutina.');
//                 }
//             })
//             .then(result => {
//                 Swal.fire({
//                     title: 'Éxito!',
//                     text: 'La rutina se actualizó correctamente.',
//                     icon: 'success',
//                     confirmButtonText: 'OK'
//                 });
//             })
//             .catch(error => {
//                 Swal.fire({
//                     title: 'Error!',
//                     text: error.message,
//                     icon: 'error',
//                     confirmButtonText: 'OK'
//                 });
//             });
//         }
//     });
// });
