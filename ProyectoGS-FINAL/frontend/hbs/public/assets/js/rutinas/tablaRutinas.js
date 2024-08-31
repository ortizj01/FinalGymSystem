const url = 'http://localhost:3000/api/rutinas/';

const listarRutinas = async () => {
    let ObjectId = document.getElementById('contenidoRutina'); 
    let contenido = ''; 
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = '/ingresar';
        return;
    }

    try {
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }

        const data = await response.json();
        console.log('Datos recibidos:', data);

        data.forEach(rutina => {
            console.log('Rutina:', rutina);
        
            if (rutina.NombreRutina && rutina.NombreCompletoUsuario && rutina.EstadoRutina !== undefined) {
                
                const estadoTexto = rutina.EstadoRutina === 1 ? 'ACTIVO' : 'INACTIVO';
        
                contenido += `
                    <tr>
                        <td>${rutina.NombreRutina}</td>
                        <td>${rutina.NombreCompletoUsuario}</td>
                        <td>${estadoTexto}</td>
                        <td style="text-align: center;">
                            <div class="centered-container">
                                <i class="fa-regular fa-pen-to-square fa-xl me-2"
                                    onclick="window.location.href='/nueva-rutina?rutinaId=${rutina.IdRutina}'"></i>
                            </div>
                        </td>
                    </tr>
                `;
            } else {
                console.error('Formato de datos incorrecto', rutina);
            }
        });
        

        ObjectId.innerHTML = contenido;

        $('#tablaRutina').DataTable().destroy();
        $('#tablaRutina').DataTable({
            language: {
                "decimal": "",
                "emptyTable": "No hay información",
                "info": "Mostrando _START_ a _END_ de _TOTAL_ Entradas",
                "infoEmpty": "Mostrando 0 to 0 of 0 Entradas",
                "infoFiltered": "(Filtrado de _MAX_ total entradas)",
                "infoPostFix": "",
                "thousands": ",",
                "lengthMenu": "Mostrar _MENU_ Entradas",
                "loadingRecords": "Cargando...",
                "processing": "Procesando...",
                "search": "Buscar:",
                "zeroRecords": "Sin resultados encontrados",
                "paginate": {
                    "first": "Primero",
                    "last": "Ultimo",
                    "next": "Siguiente",
                    "previous": "Anterior"
                }
            }, 
            lengthMenu: [5, 10, 25, 50],
            pageLength: 5 
        });

    } catch (error) {
        console.error('Error:', error);
    }
};

document.addEventListener('DOMContentLoaded', listarRutinas);
