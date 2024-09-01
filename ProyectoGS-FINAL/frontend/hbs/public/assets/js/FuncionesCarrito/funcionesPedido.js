document.addEventListener('DOMContentLoaded', () => {
    prellenarFormularioUsuario();
    actualizarResumenCompra();
    manejarAcordeones();

    const pagarAhoraBtns = document.querySelectorAll('#pagarAhoraBtn');
    pagarAhoraBtns.forEach(btn => {
        btn.addEventListener('click', validarFormularioCompleto);
    });

    const guardarMembresiasBtn = document.getElementById('guardarMembresiasBtn');
    if (guardarMembresiasBtn) {
        guardarMembresiasBtn.addEventListener('click', validarYGuardarConfiguracionMembresias);
    }

    const guardarValoracionMedicaBtn = document.getElementById('guardarValoracionMedicaBtn');
    if (guardarValoracionMedicaBtn) {
        guardarValoracionMedicaBtn.addEventListener('click', validarYGuardarValoracionMedica);
    }
});


const prellenarFormularioUsuario = () => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    if (usuario) {
        const nombreCompleto = `${usuario.Nombres} ${usuario.Apellidos}`;
        document.getElementById('nombreCliente').value = nombreCompleto || '';
        document.getElementById('emailCliente').value = usuario.Correo || '';
        document.getElementById('telefonoCliente').value = usuario.Telefono || '';
        document.getElementById('direccionCliente').value = usuario.Direccion || '';
        document.getElementById('documentoCliente').value = usuario.Documento || '';
    } else {
        console.error('No se encontró la información del usuario en localStorage');
    }
};

const actualizarResumenCompra = () => {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const cartSummaryContainer = document.getElementById('cartSummary');
    const totalElement = document.getElementById('total');

    let contenidoResumen = '';
    let total = 0;

    carrito.forEach(item => {
        const esMembresia = item.hasOwnProperty('IdMembresia');
        const totalProducto = item.PrecioProducto * item.cantidad;
        total += totalProducto;

        contenidoResumen += `
            <li class="cart-summary-item mb-3 d-flex align-items-center">
                <div class="cart-img">
                    <a href="product-details.html?id=${esMembresia ? item.IdMembresia : item.IdProducto}">
                        <img src="${item.Imagen}" alt="${item.NombreProducto}" class="img-fluid" style="width: 50px; height: 50px;">
                    </a>
                </div>
                <div class="cart-summary-content ms-3">
                    <h6 class="mb-1">
                        <a href="product-details.html?id=${esMembresia ? item.IdMembresia : item.IdProducto}" class="text-dark">${item.NombreProducto}</a>
                    </h6>
                    <p class="mb-0">${item.cantidad}x - <span class="amount">$${item.PrecioProducto.toFixed(0)}</span></p>
                </div>
            </li>
        `;
    });

    cartSummaryContainer.innerHTML = contenidoResumen;
    totalElement.textContent = `$${total.toFixed(0)}`;
};

const manejarAcordeones = async () => {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const acordeonMembresias = document.getElementById('acordeonMembresias');
    const acordeonValoracionMedica = document.getElementById('acordeonValoracionMedica');

    let contieneMembresia = false;

    carrito.forEach(item => {
        if (item.hasOwnProperty('IdMembresia')) {
            contieneMembresia = true;
        }
    });

    if (contieneMembresia) {
        acordeonMembresias.style.display = 'block';
        mostrarMembresias(carrito);
        
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        if (usuario && usuario.IdUsuario) {
            const valoracionResponse = await fetch(`http://localhost:3000/api/valoracionesMedicas/usuario/${usuario.IdUsuario}`);
            const valoracionMedica = await valoracionResponse.json();

            if (valoracionMedica.message && valoracionMedica.message === "Valoración Médica no encontrada") {
                acordeonValoracionMedica.style.display = 'block';
                mostrarFormularioValoracion(new Map([[usuario.IdUsuario, `${usuario.Nombres} ${usuario.Apellidos}`]]));
            } else {
                // Prellenar valoración médica si ya está guardada
                prellenarValoracionMedica();
            }
        }
    } else {
        acordeonMembresias.style.display = 'none';
        acordeonValoracionMedica.style.display = 'none';
    }
};

const mostrarMembresias = async (carrito) => {
    const membresiaContainer = document.getElementById('membresiaContainer');
    let contenidoMembresias = '';
    let contador = 1;

    const configuracionesMembresias = JSON.parse(localStorage.getItem('configuracionesMembresias')) || [];

    for (let item of carrito) {
        if (item.hasOwnProperty('IdMembresia')) {
            for (let i = 0; i < item.cantidad; i++) {
                const configuracionGuardada = configuracionesMembresias.find(config => config.IdMembresia === item.IdMembresia);
                const beneficiarioSeleccionado = configuracionGuardada ? configuracionGuardada.IdBeneficiario : '';

                contenidoMembresias += `
                    <div class="membresia-single-item mb-3">
                        <div class="row">
                            <div class="col-lg-6 col-md-6 col-12">
                                <div class="membresia-content">
                                    <p>${item.NombreProducto}</p>
                                </div>
                            </div>
                            <div class="col-lg-6 col-md-6 col-12">
                                <select class="form-control" name="beneficiarioMembresia${contador}">
                                    <!-- Opciones se añadirán dinámicamente -->
                                </select>
                            </div>
                        </div>
                    </div>
                `;

                contador++;
            }
        }
    }

    membresiaContainer.innerHTML = contenidoMembresias;
    cargarBeneficiariosEnSelect();

    // Después de cargar los beneficiarios, prellenar los selects con los datos guardados
    setTimeout(() => {
        configuracionesMembresias.forEach(config => {
            const selectElement = document.querySelector(`select[name="beneficiarioMembresia${config.IdMembresia}"]`);
            if (selectElement) {
                selectElement.value = config.IdBeneficiario;
            }
        });
    }, 1000); // Ajusta el tiempo de espera si es necesario
};

const cargarBeneficiariosEnSelect = async () => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const selectElements = document.querySelectorAll('select[name^="beneficiarioMembresia"]');

    if (!usuario || !usuario.IdUsuario) {
        console.error('No se encontró el usuario logueado en localStorage.');
        return;
    }

    let opciones = `<option value="${usuario.IdUsuario}">${usuario.Nombres} ${usuario.Apellidos}</option>`;

    try {
        const response = await fetch(`http://localhost:3000/api/beneficiarios/cliente/${usuario.IdUsuario}`);
        if (!response.ok) throw new Error('Error al obtener los beneficiarios.');

        const beneficiarios = await response.json();

        if (beneficiarios.length > 0) {
            beneficiarios.forEach(beneficiario => {
                opciones += `<option value="${beneficiario.IdUsuario}">${beneficiario.Nombres} ${beneficiario.Apellidos}</option>`;
            });
        }

        selectElements.forEach(select => {
            select.innerHTML = opciones;
        });

    } catch (error) {
        console.error('Error al cargar beneficiarios en el select:', error);

        selectElements.forEach(select => {
            select.innerHTML = `<option value="${usuario.IdUsuario}">${usuario.Nombres} ${usuario.Apellidos}</option>`;
        });
    }
};

const validarYGuardarConfiguracionMembresias = () => {
    const selectElements = document.querySelectorAll('select[name^="beneficiarioMembresia"]');
    let configuracionesMembresias = [];
    let formularioCompleto = true;

    selectElements.forEach(select => {
        if (!select.value) {
            formularioCompleto = false;
            Swal.fire('Error', 'Por favor, selecciona un beneficiario para cada membresía.', 'error');
        } else {
            const idMembresia = select.getAttribute('name').replace('beneficiarioMembresia', '');
            configuracionesMembresias.push({
                IdMembresia: idMembresia,
                IdBeneficiario: select.value
            });
        }
    });

    if (formularioCompleto) {
        localStorage.setItem('configuracionesMembresias', JSON.stringify(configuracionesMembresias));
        Swal.fire('Configuración guardada', 'Las configuraciones de membresías se han guardado correctamente.', 'success');
    }
};

const mostrarFormularioValoracion = (beneficiarios) => {
    const valoracionMedicaContainer = document.getElementById('valoracionMedicaContainer');
    valoracionMedicaContainer.innerHTML = '';

    let contenidoValoracionMedica = '';

    beneficiarios.forEach((nombre, id) => {
        contenidoValoracionMedica += `
            <div class="card mb-3">
                <div class="card-header">
                    Valoración Médica para ${nombre}
                </div>
                <div class="card-body">
                    <form id="valoracionMedicaForm${id}">
                        <input type="hidden" name="IdUsuario" value="${id}">
                        <div class="row">
                            <!-- Tiene Condición Crónica -->
                            <div class="col-lg-6">
                                <div class="form-group">
                                    <label for="TieneCondicionCronica">¿Tiene Condición Crónica? *</label>
                                    <select class="form-control" name="TieneCondicionCronica" id="TieneCondicionCronica" required>
                                        <option value="">Seleccione una opción</option>
                                        <option value="si">Sí</option>
                                        <option value="no">No</option>
                                    </select>
                                </div>
                            </div>
                            <!-- Cirugía Previa -->
                            <div class="col-lg-6">
                                <div class="form-group">
                                    <label for="CirugiaPrevia">¿Cirugía Previa? *</label>
                                    <select class="form-control" name="CirugiaPrevia" id="CirugiaPrevia" required>
                                        <option value="">Seleccione una opción</option>
                                        <option value="si">Sí</option>
                                        <option value="no">No</option>
                                    </select>
                                </div>
                            </div>
                            <!-- Alergias Conocidas -->
                            <div class="col-lg-6">
                                <div class="form-group">
                                    <label for="AlergiasConocidas">Alergias Conocidas *</label>
                                    <input type="text" class="form-control" name="AlergiasConocidas" id="AlergiasConocidas" placeholder="Ingrese Alergias Conocidas" required/>
                                </div>
                            </div>
                            <!-- Medicamentos Actuales -->
                            <div class="col-lg-6">
                                <div class="form-group">
                                    <label for="MedicamentosActuales">Medicamentos Actuales *</label>
                                    <input type="text" class="form-control" name="MedicamentosActuales" id="MedicamentosActuales" placeholder="Ingrese Medicamentos Actuales" required/>
                                </div>
                            </div>
                            <!-- Lesiones Musculoesqueléticas -->
                            <div class="col-lg-6">
                                <div class="form-group">
                                    <label for="LesionesMusculoesqueleticas">Lesiones Musculoesqueléticas *</label>
                                    <select class="form-control" name="LesionesMusculoesqueleticas" id="LesionesMusculoesqueleticas" required>
                                        <option value="">Seleccione una opción</option>
                                        <option value="si">Sí</option>
                                        <option value="no">No</option>
                                    </select>
                                </div>
                            </div>
                            <!-- Enfermedad Cardíaca o Vascular -->
                            <div class="col-lg-6">
                                <div class="form-group">
                                    <label for="EnfermedadCardiacaVascular">Enfermedad Cardíaca o Vascular *</label>
                                    <select class="form-control" name="EnfermedadCardiacaVascular" id="EnfermedadCardiacaVascular" required>
                                        <option value="">Seleccione una opción</option>
                                        <option value="si">Sí</option>
                                        <option value="no">No</option>
                                    </select>
                                </div>
                            </div>
                            <!-- Antecedentes Familiares -->
                            <div class="col-lg-6">
                                <div class="form-group">
                                    <label for="AntecedentesFamiliares">Antecedentes Familiares *</label>
                                    <select class="form-control" name="AntecedentesFamiliares" id="AntecedentesFamiliares" required>
                                        <option value="">Seleccione una opción</option>
                                        <option value="si">Sí</option>
                                        <option value="no">No</option>
                                    </select>
                                </div>
                            </div>
                            <!-- Tipo de Afiliación -->
                            <div class="col-lg-6">
                                <div class="form-group">
                                    <label for="TipoAfiliacion">Tipo de Afiliación *</label>
                                    <select class="form-control" name="TipoAfiliacion" id="TipoAfiliacion" required>
                                        <option value="">Seleccione un Tipo</option>
                                        <option value="contributivo">Contributivo</option>
                                        <option value="subsidiado">Subsidiado</option>
                                        <option value="otro">Otro</option>
                                    </select>
                                </div>
                            </div>
                            <!-- Peso -->
                            <div class="col-lg-6">
                                <div class="form-group">
                                    <label for="Peso">Peso (kg) *</label>
                                    <input type="number" class="form-control" name="Peso" id="Peso" placeholder="Ingrese su peso en kg" required/>
                                </div>
                            </div>
                            <!-- Altura -->
                            <div class="col-lg-6">
                                <div class="form-group">
                                    <label for="Altura">Altura (m) *</label>
                                    <input type="number" class="form-control" name="Altura" id="Altura" placeholder="Ingrese su altura en metros" step="0.01" required/>
                                </div>
                            </div>
                            <!-- IMC -->
                            <div class="col-lg-6">
                                <div class="form-group">
                                    <label for="IMC">IMC *</label>
                                    <input type="number" class="form-control" name="IMC" id="IMC" placeholder="Ingrese IMC" readonly required/>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        `;
    });

    valoracionMedicaContainer.innerHTML = contenidoValoracionMedica;

    const pesoInput = document.getElementById('Peso');
    const alturaInput = document.getElementById('Altura');
    const imcInput = document.getElementById('IMC');

    const calcularIMC = () => {
        const peso = parseFloat(pesoInput.value);
        const altura = parseFloat(alturaInput.value);

        if (peso > 0 && altura > 0) {
            const imc = peso / (altura * altura);
            imcInput.value = imc.toFixed(2);
        }
    };

    pesoInput.addEventListener('input', calcularIMC);
    alturaInput.addEventListener('input', calcularIMC);

    // Prellenar datos de valoración médica si existen en localStorage
    prellenarValoracionMedica();
};

const prellenarValoracionMedica = () => {
    const valoraciones = JSON.parse(localStorage.getItem('valoracionMedica')) || [];
    valoraciones.forEach(valoracion => {
        const form = document.getElementById(`valoracionMedicaForm${valoracion.IdUsuario}`);
        if (form) {
            Object.keys(valoracion).forEach(key => {
                if (form.elements[key]) {
                    form.elements[key].value = valoracion[key];
                }
            });
        }
    });
};

const validarYGuardarValoracionMedica = () => {
    const valoraciones = [];
    let formularioCompleto = true;
    const formularios = document.querySelectorAll('form[id^="valoracionMedicaForm"]');

    formularios.forEach(form => {
        if (!form.checkValidity()) {
            formularioCompleto = false;
            Swal.fire('Error', 'Por favor, completa todos los campos de la valoración médica.', 'error');
        } else {
            const formData = new FormData(form);
            const datos = {};
            formData.forEach((value, key) => {
                datos[key] = value;
            });
            valoraciones.push(datos);
        }
    });

    if (formularioCompleto) {
        localStorage.setItem('valoracionMedica', JSON.stringify(valoraciones));
        Swal.fire('Valoración médica guardada', 'La valoración médica se ha guardado correctamente.', 'success');
    }
};

const validarFormularioCompleto = (event) => {
    event.preventDefault(); // Previene la redirección automática

    const acordeonMembresias = document.getElementById('acordeonMembresias');
    const acordeonValoracionMedica = document.getElementById('acordeonValoracionMedica');
    let formularioCompleto = true;

    // Verificar si el acordeón de membresías está visible y validado
    if (acordeonMembresias.style.display !== 'none') {
        const configuracionesMembresias = JSON.parse(localStorage.getItem('configuracionesMembresias')) || [];
        const selectElements = document.querySelectorAll('select[name^="beneficiarioMembresia"]');
        
        // Asegurarse de que cada select tenga un valor seleccionado
        selectElements.forEach(select => {
            if (!select.value) {
                formularioCompleto = false;
                Swal.fire('Configuración de membresías incompleta', 'Por favor, asegúrate de que todas las membresías estén configuradas.', 'error');
                return;
            }
        });

        if (configuracionesMembresias.length !== selectElements.length) {
            formularioCompleto = false;
            Swal.fire('Configuración de membresías incompleta', 'Por favor, asegúrate de que todas las membresías estén configuradas.', 'error');
        }
    }

    // Verificar si el acordeón de valoración médica está visible y validado
    if (acordeonValoracionMedica.style.display !== 'none') {
        const valoracionesMedicas = JSON.parse(localStorage.getItem('valoracionMedica')) || [];
        const formulariosValoracion = document.querySelectorAll('form[id^="valoracionMedicaForm"]');
        
        formulariosValoracion.forEach(form => {
            if (!form.checkValidity()) {
                formularioCompleto = false;
                Swal.fire('Valoración médica incompleta', 'Por favor, completa todos los campos de la valoración médica.', 'error');
                return;
            }
        });

        if (valoracionesMedicas.length !== formulariosValoracion.length) {
            formularioCompleto = false;
            Swal.fire('Valoración médica incompleta', 'Por favor, asegúrate de que todas las valoraciones médicas estén completadas.', 'error');
        }
    }

    // Si todo está completo, proceder con la redirección
    if (formularioCompleto) {
        window.location.href = 'QrCarrito'; // Redirige si todo está completo
    }
};
