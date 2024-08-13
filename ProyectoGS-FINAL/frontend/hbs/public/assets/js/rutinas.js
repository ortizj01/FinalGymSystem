
document.addEventListener("DOMContentLoaded", function() {
    const botonesDia = document.querySelectorAll('.dia-btn');

    botonesDia.forEach(function(boton) {
        boton.addEventListener('click', function() {
            const dia = this.getAttribute('data-dia');
            const formDia = document.querySelector(`.form-dia[data-dia="${dia}"]`);

            // Si el formulario del día está abierto, lo cierra
            if (formDia.style.display === 'block') {
                formDia.style.display = 'none';
            } else {
                // Oculta todos los formularios excepto el del día clicado
                document.querySelectorAll('.form-dia').forEach(function(form) {
                    if (form !== formDia) {
                        form.style.display = 'none';
                    }
                });

                // Muestra el formulario del día clicado
                formDia.style.display = 'block';
            }
        });
    });
});

$(document).ready(function() {
    $('.add-field').click(function() {
        var newField = `
            <div class="added-field mb-3">
                <div class="row mb-3">
                <div class="col-md-4">
                    <label for="ejercicio" class="col-form-label">Ejercicio</label>
                    <select class="form-select" id="ejercicio">
                        <option value="pecho">Seleccione el ejercicio</option>
                        <option value="pecho">Pecho</option>
                        <option value="espalda">Espalda</option>
                        <option value="piernas">Piernas</option>
                        <!-- Agrega más opciones según sea necesario -->
                    </select>
                </div>
                <div class="col-md-4">
                    <div class="form-group formularioRegistro__grupo" id="grupo__tipoEjercicio">
                        <div class="formularioRegistro__grupo-input" >
                        <label class="tipoEjercicio" class="formularioRegistro__label">Tipo Ejercicio</label>
                        <input type="text" class="form-control" name="tipoEjercicio" placeholder="Nombre" />
                        <i class="formularioRegistro__validacion-estado fas fa-times-circle "></i>
                        </div>
                            <p class="formularioRegistro__input-error">Ingrese el nombre del Tipo Ejercicio correctamente</p>
                    </div>
                </div>
                <div class="col-md-4 d-flex align-items-center">
                    <div class="form-group formularioRegistro__grupo" id="grupo__repeticiones">
                        <div class="formularioRegistro__grupo-input" >
                        <label class="repeticiones" class="formularioRegistro__label">Repeticiones</label>
                        <input type="number" class="form-control" name="repeticiones" style="width: 100px;"/>
                        <i class="formularioRegistro__validacion-estado fas fa-times-circle "></i>
                        </div>
                            <p class="formularioRegistro__input-error">Ingrese el dato correctamente</p>
                    </div>

                    <button type="button" class="btn btn-soft-danger ms-2 delete-field">
                        <i class="fa-solid fa-minus fa-lg"></i>
                    </button>
                </div>
            </div>
            </div>`;
            


        $('.form-dia form').append(newField);
        
    });

    // Función para eliminar el campo al hacer clic en el botón de eliminar ("-")
    $(document).on('click', '.delete-field', function() {
        $(this).closest('.added-field').remove();
    });
});