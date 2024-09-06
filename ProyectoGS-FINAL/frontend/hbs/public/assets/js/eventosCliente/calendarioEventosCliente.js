document.addEventListener('DOMContentLoaded', function() {
    // Obtener el token JWT almacenado en localStorage
    const token = localStorage.getItem('token');
    var calendarEl = document.getElementById('calendar1');

    if (calendarEl) {
        var calendar = new FullCalendar.Calendar(calendarEl, {
            locale: 'es',
            initialView: 'dayGridMonth',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
            },
            timeZone: 'local',
            eventTimeFormat: {
                hour: '2-digit',
                minute: '2-digit',
                meridiem: false
            },
            events: function(fetchInfo, successCallback, failureCallback) {
                if (!token) {
                    window.location.href = '/ingresar'; // Redirigir al inicio de sesión si no hay token
                    return;
                }

                // Cargar eventos desde la API utilizando el token JWT
                fetch('http://localhost:3000/api/eventos', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error en la solicitud');
                    }
                    return response.json();
                })
                .then(data => {
                    var eventos = data.map(evento => ({
                        id: evento.id,
                        title: evento.title,
                        start: evento.start,
                        end: evento.end,
                        description: evento.description,
                        serviceId: evento.serviceId,
                        employeeId: evento.employeeId,
                        isActive: evento.isActive
                    }));
                    successCallback(eventos);
                })
                .catch(error => {
                    console.error('Error al cargar los eventos:', error);
                    failureCallback(error);
                });
            },
           
            eventClick: function(info) {
                var today = new Date().toISOString().split('T')[0];
                var eventStartDate = info.event.startStr.split('T')[0];
                
                // Mostrar modal para editar un evento existente
                var modal = new bootstrap.Modal(document.getElementById('eventModal'));
                document.getElementById('eventId').value = info.event.id;
                document.getElementById('startDate').value = info.event.startStr.slice(0, 10); // Asignar fecha (YYYY-MM-DD)
                document.getElementById('endDate').value = info.event.endStr.slice(0, 10); // Asignar fecha (YYYY-MM-DD)
                document.getElementById('startTime').value = info.event.startStr.slice(11, 16); // Asignar hora (HH:mm)
                document.getElementById('endTime').value = info.event.endStr.slice(11, 16); // Asignar hora (HH:mm)
                document.getElementById('description').value = info.event.extendedProps.description;
                document.getElementById('estadoLabel').style.display = 'block';
                document.getElementById('isActive').style.display = 'block'; // Mostrar campo EstadoAgenda
                document.getElementById('eventModalLabel').textContent = 'Evento'; // Cambiar el título del modal
                
                    document.querySelectorAll('#eventForm input, #eventForm select, #eventForm textarea').forEach(el => {
                        el.disabled = true;
                     });
              

                loadSelectOptionsAndShowModal(modal, info); // Cargar opciones de select y luego mostrar el modal
            },
            datesSet: function() {
                console.log('Calendario completamente renderizado. Puedes interactuar con los eventos.');
            }
        });

        calendar.render();

         // Función para cambiar los nombres de los botones a español
    function cambiarTextoBotones(calendar) {
        calendar.setOption('buttonText', {
            prev: 'Anterior',
            next: 'Siguiente',
            today: 'Hoy',
            month: 'Mes',
            week: 'Semana',
            day: 'Día',
            list: 'Agenda'
        });
    }

      // Llamada a la función para cambiar los textos de los botones
      cambiarTextoBotones(calendar);


        // Lógica para guardar un evento (nuevo o editado)
        document.getElementById('saveEventButton').addEventListener('click', function() {
            var eventId = document.getElementById('eventId').value;
            var title = document.getElementById('serviceSelect').value;
            var employee = document.getElementById('employeeSelect').value;
            var startDate = document.getElementById('startDate').value;
            var endDate = document.getElementById('endDate').value;
            var startTime = document.getElementById('startTime').value;
            var endTime = document.getElementById('endTime').value;
            var description = document.getElementById('description').value;
            var isActive = document.getElementById('isActive').checked; // Usar checked para obtener el estado

            var isValid = true; // Bandera para validación

            // Validación de servicio
            if (!title) {
                document.getElementById('serviceSelect').classList.add('is-invalid');
                document.getElementById('serviceError').textContent = 'Seleccione un servicio.';
                isValid = false;
            } else {
                document.getElementById('serviceSelect').classList.remove('is-invalid');
                document.getElementById('serviceError').textContent = '';
            }

            // Validación de empleado
            if (!employee) {
                document.getElementById('employeeSelect').classList.add('is-invalid');
                document.getElementById('employeeError').textContent = 'Seleccione un empleado.';
                isValid = false;
            } else {
                document.getElementById('employeeSelect').classList.remove('is-invalid');
                document.getElementById('employeeError').textContent = '';
            }

            // Validación de fechas
            var today = new Date().toISOString().split('T')[0];
            if (!startDate || startDate < today) {
                document.getElementById('startDate').classList.add('is-invalid');
                document.getElementById('startDateError').textContent = 'Seleccione una fecha de inicio válida.';
                isValid = false;
            } else {
                document.getElementById('startDate').classList.remove('is-invalid');
                document.getElementById('startDateError').textContent = '';
            }

            if (!endDate || endDate < startDate) {
                document.getElementById('endDate').classList.add('is-invalid');
                document.getElementById('endDateError').textContent = 'Seleccione una fecha de fin válida.';
                isValid = false;
            } else {
                document.getElementById('endDate').classList.remove('is-invalid');
                document.getElementById('endDateError').textContent = '';
            }

            // Validación de horas
            if (!startTime) {
                document.getElementById('startTime').classList.add('is-invalid');
                document.getElementById('startTimeError').textContent = 'Seleccione una hora de inicio.';
                isValid = false;
            } else {
                document.getElementById('startTime').classList.remove('is-invalid');
                document.getElementById('startTimeError').textContent = '';
            }

            if (!endTime || endTime <= startTime) {
                document.getElementById('endTime').classList.add('is-invalid');
                document.getElementById('endTimeError').textContent = 'Seleccione una hora de fin válida.';
                isValid = false;
            } else {
                document.getElementById('endTime').classList.remove('is-invalid');
                document.getElementById('endTimeError').textContent = '';
            }

            // Validación de descripción
            if (!description.trim()) {
                document.getElementById('description').classList.add('is-invalid');
                document.getElementById('descriptionError').textContent = 'Ingrese una descripción.';
                isValid = false;
            } else {
                document.getElementById('description').classList.remove('is-invalid');
                document.getElementById('descriptionError').textContent = '';
            }

            if (isValid) {
                // Formato ISO 8601 para FechaInicio y FechaFin combinado con HoraInicio y HoraFin
                var startDateTime = startDate ? new Date(`${startDate}T${startTime}`) : null;
                var endDateTime = endDate ? new Date(`${endDate}T${endTime}`) : null;

                var eventData = {
                    IdServicio: parseInt(title),
                    IdUsuario: parseInt(employee),
                    FechaInicio: startDateTime ? startDateTime.toISOString().slice(0, 19).replace('T', ' ') : null, // Formato YYYY-MM-DD HH:mm:ss
                    FechaFin: endDateTime ? endDateTime.toISOString().slice(0, 19).replace('T', ' ') : null,     // Formato YYYY-MM-DD HH:mm:ss
                    HoraInicio: startTime,
                    HoraFin: endTime,
                    DescripcionEvento: description,
                    EstadoAgenda: isActive ? 1 : 0
                };

                var url = eventId ? `http://localhost:3000/api/eventos/${eventId}` : 'http://localhost:3000/api/eventos';
                var method = eventId ? 'PUT' : 'POST';

                // Enviar solicitud al servidor con JWT
                fetch(url, {
                    method: method,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(eventData)
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Respuesta del servidor:', data);

                    if (eventId) {
                        // Actualizar evento existente en el calendario
                        var existingEvent = calendar.getEventById(eventId);
                        if (existingEvent) {
                            existingEvent.setProp('title', data.title);
                            existingEvent.setStart(new Date(data.FechaInicio));
                            existingEvent.setEnd(new Date(data.FechaFin));
                            existingEvent.setExtendedProp('description', data.DescripcionEvento);
                            existingEvent.setExtendedProp('isActive', data.EstadoAgenda === 1 ? true : false);
                            existingEvent.setExtendedProp('serviceId', data.IdServicio);
                            existingEvent.setExtendedProp('employeeId', data.IdUsuario);
                        }
                    } else {
                        // Agregar nuevo evento al calendario
                        calendar.addEvent({
                            id: data.id,
                            title: data.title,
                            start: new Date(data.FechaInicio),
                            end: new Date(data.FechaFin),
                            description: data.DescripcionEvento,
                            isActive: data.EstadoAgenda === 1 ? true : false,
                            serviceId: data.IdServicio,
                            employeeId: data.IdUsuario
                        });
                    }

                    var modal = bootstrap.Modal.getInstance(document.getElementById('eventModal'));
                    modal.hide();

                    // Mostrar notificación de éxito y recargar la página
                    toastr.success('El evento se guardó correctamente.', 'Éxito', {
                        positionClass: 'toast-top-right',
                        timeOut: 3000, // Duración de la notificación en milisegundos
                        onHidden: function() {
                            location.reload(); // Recargar la página
                        }
                    });
                })
                .catch(error => {
                    console.error('Error al guardar el evento:', error);
                });
            }
        });

        // Función para cargar opciones del select y luego mostrar el modal
        function loadSelectOptionsAndShowModal(modal, info) {
            loadSelectOptions().then(() => {
                if (info) {
                    document.getElementById('serviceSelect').value = info.event.extendedProps.serviceId;
                    document.getElementById('employeeSelect').value = info.event.extendedProps.employeeId;
                }
                modal.show();
            });
        }

        // Cargar opciones del select para servicios y empleados con JWT
        function loadSelectOptions() {
            if (!token) {
                console.error('No se encontró token JWT en localStorage.');
                return;
            }

            return Promise.all([
                fetch('http://localhost:3000/api/servicios', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }).then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                }),
                fetch('http://localhost:3000/api/entrenadores', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }).then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
            ]).then(([servicios, empleados]) => {
                var serviceSelect = document.getElementById('serviceSelect');
                serviceSelect.innerHTML = '<option value="">Seleccione...</option>';
                servicios.forEach(service => {
                    var option = document.createElement('option');
                    option.value = service.IdServicio;
                    option.text = service.NombreClase;
                    serviceSelect.appendChild(option);
                });

                var employeeSelect = document.getElementById('employeeSelect');
                employeeSelect.innerHTML = '<option value="">Seleccione...</option>';
                empleados.forEach(employee => {
                    var option = document.createElement('option');
                    option.value = employee.IdUsuario;
                    option.text = employee.Nombres;
                    employeeSelect.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Error al cargar opciones de select:', error);
            });
        }
    } else {
        console.error('Elemento con ID "calendar1" no encontrado.');
    }
});
