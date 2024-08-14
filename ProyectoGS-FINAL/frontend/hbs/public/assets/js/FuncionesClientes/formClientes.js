const formularioRegistro = document.getElementById('formularioRegistro');
const inputs = document.querySelectorAll('#formularioRegistro input, #formularioRegistro select');

const expresiones = {
    documento: /^[a-zA-Z0-9]{7,10}$/,
    tipoDocumento: /^(cedula_ciudadania|cedula_extranjeria|tarjeta_identidad)$/,
    nombres: /^[a-zA-ZÀ-ÿ\s]{1,40}$/,
    apellidos: /^[a-zA-ZÀ-ÿ\s]{1,40}$/,
    correo: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    telefono: /^[0-9]{7,11}$/,
    fechaDeNacimiento: /^(\d{4})-(\d{2})-(\d{2})$/,
    direccion: /^[A-Za-z0-9\s#áéíóúÁÉÍÓÚüÜ.,-]+$/,
    genero: /^(Masculino|Femenino)$/,
    contrasena: /^(?=.*[A-Z])(?=.*\d).{4,12}$/,
    beneficiario: /^(1|0)$/,
    TieneCondicionCronica: /^(si|no)$/,
    CirugiaPrevia: /^(si|no)$/,
    AlergiasConocidas: /^[a-zA-ZÀ-ÿ\s]{1,40}$/,
    MedicamentosActuales: /^[a-zA-ZÀ-ÿ\s]{1,40}$/,
    LesionesMusculoesqueleticas: /^(si|no)$/,
    EnfermedadCardiacaVascular: /^(si|no)$/,
    AntecedentesFamiliares: /^(si|no)$/,
    TipoAfiliacion: /^(contributivo|subsidiado|otro)$/,
    Peso: /^[0-9]{1,3}$/,
    Altura: /^[0-9]{1,3}(\.[0-9]{1,2})?$/,
    IMC: /^[0-9]{1,3}(\.[0-9]{1,2})?$/
};

const campos = {
    documento: false,
    tipoDocumento: false,
    nombres: false,
    apellidos: false,
    correo: false,
    telefono: false,
    fechaDeNacimiento: false,
    direccion: false,
    genero: false,
    contrasena: false,
    confirmarContrasena: false,
    beneficiario: false,
    TieneCondicionCronica: false,
    CirugiaPrevia: false,
    AlergiasConocidas: false,
    MedicamentosActuales: false,
    LesionesMusculoesqueleticas: false,
    EnfermedadCardiacaVascular: false,
    AntecedentesFamiliares: false,
    TipoAfiliacion: false,
    Peso: false,
    Altura: false,
    IMC: false
};

const validarFormulario = (e) => {
    switch (e.target.name) {
        case "documento":
        case "nombres":
        case "apellidos":
        case "correo":
        case "telefono":
        case "fechaDeNacimiento":
        case "direccion":
        case "contrasena":
            validarCampo(expresiones[e.target.name], e.target, e.target.name);
            if (e.target.name === "contrasena") {
                validarConfirmacionContrasena();
            }
            break;
        case "tipoDocumento":
        case "genero":
        case "beneficiario":
        case "TieneCondicionCronica":
        case "CirugiaPrevia":
        case "LesionesMusculoesqueleticas":
        case "EnfermedadCardiacaVascular":
        case "AntecedentesFamiliares":
        case "TipoAfiliacion":
            validarSelect(expresiones[e.target.name], e.target, e.target.name);
            break;
        case "confirmarContrasena":
            validarConfirmacionContrasena();
            break;
        case "AlergiasConocidas":
        case "MedicamentosActuales":
        case "Peso":
        case "Altura":
        case "IMC":
            validarCampo(expresiones[e.target.name], e.target, e.target.name);
            break;
    }
};

const validarCampo = (expresion, input, campo) => {
    if (expresion.test(input.value)) {
        input.style.borderColor = 'green';
        document.getElementById(`error_${campo}`).textContent = '';
        campos[campo] = true;
    } else {
        input.style.borderColor = 'red';
        document.getElementById(`error_${campo}`).textContent = obtenerMensajeError(campo);
        campos[campo] = false;
    }
};

const validarSelect = (expresion, select, campo) => {
    if (expresion.test(select.value)) {
        select.style.borderColor = 'green';
        document.getElementById(`error_${campo}`).textContent = '';
        campos[campo] = true;
    } else {
        select.style.borderColor = 'red';
        document.getElementById(`error_${campo}`).textContent = obtenerMensajeError(campo);
        campos[campo] = false;
    }
};

const validarConfirmacionContrasena = () => {
    const contrasena = document.getElementById('contrasena');
    const confirmarContrasena = document.getElementById('confirmarContrasena');

    if (contrasena.value !== confirmarContrasena.value || confirmarContrasena.value === '') {
        confirmarContrasena.style.borderColor = 'red';
        document.getElementById('error_confirmarContrasena').textContent = 'Las contraseñas no coinciden.';
        campos['confirmarContrasena'] = false;
    } else {
        confirmarContrasena.style.borderColor = 'green';
        document.getElementById('error_confirmarContrasena').textContent = '';
        campos['confirmarContrasena'] = true;
    }
};

const obtenerMensajeError = (campo) => {
    let mensaje = '';
    switch (campo) {
        case 'documento':
            mensaje = 'Documento inválido. Debe contener entre 7 y 10 caracteres alfanuméricos.';
            break;
        case 'tipoDocumento':
            mensaje = 'Seleccione un tipo de documento válido.';
            break;
        case 'nombres':
            mensaje = 'Nombres inválidos. No pueden contener números o caracteres especiales.';
            break;
        case 'apellidos':
            mensaje = 'Apellidos inválidos. No pueden contener números o caracteres especiales.';
            break;
        case 'correo':
            mensaje = 'Correo electrónico inválido.';
            break;
        case 'telefono':
            mensaje = 'Teléfono inválido. Debe contener entre 7 y 11 dígitos.';
            break;
        case 'fechaDeNacimiento':
            mensaje = 'Fecha de nacimiento inválida.';
            break;
        case 'direccion':
            mensaje = 'Dirección inválida.';
            break;
        case 'genero':
            mensaje = 'Seleccione un género válido.';
            break;
        case 'contrasena':
            mensaje = 'Contraseña inválida. Debe contener al menos un número, una letra mayúscula y tener entre 4 y 12 caracteres.';
            break;
        case 'confirmarContrasena':
            mensaje = 'Las contraseñas no coinciden.';
            break;
        case 'beneficiario':
            mensaje = 'Seleccione una opción válida para beneficiario.';
            break;
        case 'TieneCondicionCronica':
            mensaje = 'Seleccione una opción válida para condición crónica.';
            break;
        case 'CirugiaPrevia':
            mensaje = 'Seleccione una opción válida para cirugía previa.';
            break;
        case 'AlergiasConocidas':
            mensaje = 'Ingrese alergias conocidas válidas.';
            break;
        case 'MedicamentosActuales':
            mensaje = 'Ingrese medicamentos actuales válidos.';
            break;
        case 'LesionesMusculoesqueleticas':
            mensaje = 'Seleccione una opción válida para lesiones musculoesqueléticas.';
            break;
        case 'EnfermedadCardiacaVascular':
            mensaje = 'Seleccione una opción válida para enfermedad cardiaca o vascular.';
            break;
        case 'AntecedentesFamiliares':
            mensaje = 'Seleccione una opción válida para antecedentes familiares.';
            break;
        case 'TipoAfiliacion':
            mensaje = 'Seleccione un tipo de afiliación válido.';
            break;
        case 'Peso':
            mensaje = 'Ingrese un peso válido.';
            break;
        case 'Altura':
            mensaje = 'Ingrese una altura válida. Puede contener decimales.';
            break;
        case 'IMC':
            mensaje = 'Ingrese un IMC válido.';
            break;
    }
    return mensaje;
};

// Event listeners para validar en cada cambio o blur
inputs.forEach((input) => {
    if (input.type !== 'checkbox') {
        input.addEventListener('change', validarFormulario);
        input.addEventListener('keyup', validarFormulario);
        input.addEventListener('blur', validarFormulario);
    }
});

formularioRegistro.addEventListener('submit', (e) => {
    e.preventDefault();
    const camposValidos = Object.values(campos).every(campo => campo === true);
    const camposLlenos = Array.from(inputs).every(input => input.value.trim() !== '');

    if (camposValidos && camposLlenos) {
        registrarCliente();
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error de Validación',
            text: 'Por favor completa correctamente todos los campos obligatorios.'
        });
    }
});

// Mostrar/ocultar contraseña
document.querySelectorAll('[id^=toggle]').forEach(button => {
    button.addEventListener('click', function() {
        const inputId = this.getAttribute('data-toggle');
        togglePasswordVisibility(inputId);
    });
});

function togglePasswordVisibility(inputId) {
    const passwordInput = document.getElementById(inputId);
    const button = document.querySelector(`[data-toggle=${inputId}] span`);

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        button.className = 'fa-regular fa-eye fa-xl me-2';
    } else {
        passwordInput.type = 'password';
        button.className = 'fa-regular fa-eye-slash fa-xl me-2';
    }
}
