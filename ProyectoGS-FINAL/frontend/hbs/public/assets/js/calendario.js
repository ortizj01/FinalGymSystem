
document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      dateClick: function(info){
        
        limpiarFormulario()
        $('#botonEditar').hide()
        $('#botonEliminar').hide()

        if (info.allDay) {
          $('#fechaInicio').val(info.dateStr)
          $('#fechaFin').val(info.dateStr)
        }else{
          let fechaHora = info.dateStr.split("T")
          $('#fechaInicio').val(fechaHora[0])
          $('#fechaFin').val(fechaHora[0])
          $('#horaInicio').val(fechaHora[1].substring(0,5))
        }
        
        $("#formularioEventos").modal('show');

        calendar.addEvent({
          title: 'Ejemplo de evento',
          start: info.dateStr,
          end: info.dateStr,
          backgroundColor: '#151824',
          borderColor: '#151824',
          color: 'white', // Cambia el color del texto del título del evento
          editable: false,
          display: 'background',
          allDay: info.allDay,
      });
      
        
      }
    });
    
    calendar.render();

    //fucniones para interacturar con el calendario

  });

  function limpiarFormulario (){
    $('#serviciosAgenda').val('')
    $('#fechaInicio').val('')
    $('#fechaFin').val('')
    $('#horaInicio').val('')
    $('#horaFin').val('')
    $('#descripcionAgenda').val('')
    $('#nombreEmpleado').val('')
  }

