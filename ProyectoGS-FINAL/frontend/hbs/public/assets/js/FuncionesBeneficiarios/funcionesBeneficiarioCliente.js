// funcionesBeneficiarioCliente.js

async function cargarDatosCliente() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (id) {
        try {
            const response = await fetch(`http://localhost:3000/api/usuarios/${id}`, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error al obtener los datos del cliente');
            }

            const cliente = await response.json();

            // Crear acordeón para el cliente
            const accordionCliente = document.getElementById('accordionCliente');
            accordionCliente.innerHTML = ''; // Limpiar contenido previo

            const estadoClienteTexto = cliente.Estado === 0 ? 'Activo' : 'Inactivo';
            const fechaCliente = new Date(cliente.FechaDeNacimiento);
            const diaCliente = String(fechaCliente.getDate()).padStart(2, '0');
            const mesCliente = String(fechaCliente.getMonth() + 1).padStart(2, '0');
            const anioCliente = fechaCliente.getFullYear();
            const fechaFormateadaCliente = `${diaCliente}/${mesCliente}/${anioCliente}`;

            const li = document.createElement('li');
            li.innerHTML = `
                <h6 class="title" data-bs-toggle="collapse" data-bs-target="#collapseCliente"
                    aria-expanded="true" aria-controls="collapseCliente">${cliente.Nombres} ${cliente.Apellidos}</h6>
                <section class="checkout-steps-form-content collapse show" id="collapseCliente"
                    aria-labelledby="headingCliente" data-bs-parent="#accordionCliente">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="single-form form-default">
                                <label for="tipoDocumentoCliente">Tipo Documento</label>
                                <div class="form-input form">
                                    <input type="text" id="tipoDocumentoCliente" value="${cliente.TipoDocumento}" readonly>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="single-form form-default">
                                <label for="documentoCliente">Documento</label>
                                <div class="form-input form">
                                    <input type="text" id="documentoCliente" value="${cliente.Documento}" readonly>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="single-form form-default">
                                <label for="nombreCliente">Nombre</label>
                                <div class="form-input form">
                                    <input type="text" id="nombreCliente" value="${cliente.Nombres}" readonly>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="single-form form-default">
                                <label for="apellidosCliente">Apellidos</label>
                                <div class="form-input form">
                                    <input type="text" id="apellidosCliente" value="${cliente.Apellidos}" readonly>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="single-form form-default">
                                <label for="emailCliente">Correo electrónico</label>
                                <div class="form-input form">
                                    <input type="email" id="emailCliente" value="${cliente.Correo}" readonly>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="single-form form-default">
                                <label for="telefonoCliente">Teléfono</label>
                                <div class="form-input form">
                                    <input type="text" id="telefonoCliente" value="${cliente.Telefono}" readonly>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="single-form form-default">
                                <label for="direccionCliente">Dirección</label>
                                <div class="form-input form">
                                    <input type="text" id="direccionCliente" value="${cliente.Direccion}" readonly>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="single-form form-default">
                                <label for="fechaNacimientoCliente">Fecha de nacimiento</label>
                                <div class="form-input form">
                                    <input type="text" id="fechaNacimientoCliente" value="${fechaFormateadaCliente}" readonly>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="single-form form-default">
                                <label for="generoCliente">Género</label>
                                <div class="form-input form">
                                    <input type="text" id="generoCliente" value="${cliente.Genero}" readonly>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="single-form form-default">
                                <label for="estadoCliente">Estado</label>
                                <div class="form-input form">
                                    <input type="text" id="estadoCliente" value="${estadoClienteTexto}" readonly>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            `;
            accordionCliente.appendChild(li);
        } catch (error) {
            console.error('Error:', error.message);
        }
    }
}

document.addEventListener('DOMContentLoaded', cargarDatosCliente);
