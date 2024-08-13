//LISTAR BENEFICIARIOS ASOCIADOS A CLIENTES

async function cargarDatosBeneficiarios() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (id) {
        try {
            const response = await fetch(`http://localhost:3000/api/beneficiarios/cliente/${id}`, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error al obtener los beneficiarios del cliente');
            }

            const beneficiarios = await response.json();

            // Crear acordeones para beneficiarios
            const accordionBeneficiarios = document.getElementById('accordionBeneficiarios');
            accordionBeneficiarios.innerHTML = ''; // Limpiar contenido previo
            beneficiarios.forEach((beneficiario, index) => {
                const estadoBeneficiarioTexto = beneficiario.Estado === 0 ? 'Activo' : 'Inactivo';
                const fechaBeneficiario = new Date(beneficiario.FechaDeNacimiento);
                const diaBeneficiario = String(fechaBeneficiario.getDate()).padStart(2, '0');
                const mesBeneficiario = String(fechaBeneficiario.getMonth() + 1).padStart(2, '0');
                const anioBeneficiario = fechaBeneficiario.getFullYear();
                const fechaFormateadaBeneficiario = `${diaBeneficiario}/${mesBeneficiario}/${anioBeneficiario}`;

                const li = document.createElement('li');
                li.innerHTML = `
                    <h6 class="title" data-bs-toggle="collapse" data-bs-target="#collapseBeneficiario${index}"
                        aria-expanded="true" aria-controls="collapseBeneficiario${index}">${beneficiario.Nombres} ${beneficiario.Apellidos}</h6>
                    <section class="checkout-steps-form-content collapse" id="collapseBeneficiario${index}"
                        aria-labelledby="headingBeneficiario${index}" data-bs-parent="#accordionBeneficiarios">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="single-form form-default">
                                    <label for="tipoDocumentoBeneficiario${index}">Tipo Documento</label>
                                    <div class="form-input form">
                                        <input type="text" id="tipoDocumentoBeneficiario${index}" value="${beneficiario.TipoDocumento}" readonly>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="single-form form-default">
                                    <label for="documentoBeneficiario${index}">Documento</label>
                                    <div class="form-input form">
                                        <input type="text" id="documentoBeneficiario${index}" value="${beneficiario.Documento}" readonly>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="single-form form-default">
                                    <label for="nombreBeneficiario${index}">Nombre</label>
                                    <div class="form-input form">
                                        <input type="text" id="nombreBeneficiario${index}" value="${beneficiario.Nombres}" readonly>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="single-form form-default">
                                    <label for="apellidosBeneficiario${index}">Apellidos</label>
                                    <div class="form-input form">
                                        <input type="text" id="apellidosBeneficiario${index}" value="${beneficiario.Apellidos}" readonly>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="single-form form-default">
                                    <label for="emailBeneficiario${index}">Correo electrónico</label>
                                    <div class="form-input form">
                                        <input type="email" id="emailBeneficiario${index}" value="${beneficiario.Correo}" readonly>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="single-form form-default">
                                    <label for="TelefonoBeneficiario${index}">Teléfono</label>
                                    <div class="form-input form">
                                        <input type="text" id="TelefonoBeneficiario${index}" value="${beneficiario.Telefono}" readonly>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="single-form form-default">
                                    <label for="direccionBeneficiario${index}">Dirección</label>
                                    <div class="form-input form">
                                        <input type="text" id="direccionBeneficiario${index}" value="${beneficiario.Direccion}" readonly>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="single-form form-default">
                                    <label for="fechaNacimientoBeneficiario${index}">Fecha de nacimiento</label>
                                    <div class="form-input form">
                                        <input type="text" id="fechaNacimientoBeneficiario${index}" value="${fechaFormateadaBeneficiario}" readonly>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="single-form form-default">
                                    <label for="generoBeneficiario${index}">Género</label>
                                    <div class="form-input form">
                                        <input type="text" id="generoBeneficiario${index}" value="${beneficiario.Genero}" readonly>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="single-form form-default">
                                    <label for="estadoBeneficiario${index}">Estado</label>
                                    <div class="form-input form">
                                        <input type="text" id="estadoBeneficiario${index}" value="${estadoBeneficiarioTexto}" readonly>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                `;
                accordionBeneficiarios.appendChild(li);
            });
        } catch (error) {
            console.error('Error:', error.message);
        }
    }
}

document.addEventListener('DOMContentLoaded', cargarDatosBeneficiarios);
