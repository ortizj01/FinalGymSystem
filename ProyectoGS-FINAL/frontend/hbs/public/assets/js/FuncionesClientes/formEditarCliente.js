const formularioEditar = document.getElementById('formularioEditar');
const inputsEditar = document.querySelectorAll('#formularioEditar input, #formularioEditar select');

const expresionesEditar = {
    documento: /^[a-zA-Z0-9]{7,10}$/,
    tipoDocumento: /^(cedula_ciudadania|pasaporte)$/,
    nombres: /^[a-zA-ZÀ-ÿ\s]{1,40}$/,
    apellidos: /^[a-zA-ZÀ-ÿ\s]{1,40}$/,
    correo: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    telefono: /^[0-9]{7,11}$/,
    fechaDeNacimiento: /^\d{4}-\d{2}-\d{2}$/,
    direccion: /^[A-Za-z0-9\s#áéíóúÁÉÍÓÚüÜ.,-]+$/,
    genero: /^(Masculino|Femenino)$/,
    estado: /^(0|1)$/,
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

const mensajesErrorEditar = {
    documento: 'El documento debe tener entre 7 y 10 caracteres alfanuméricos.',
    tipoDocumento: 'Seleccione un tipo de documento válido.',
    nombres: 'Los nombres solo pueden contener letras y espacios, y deben tener entre 1 y 40 caracteres.',
    apellidos: 'Los apellidos solo pueden contener letras y espacios, y deben tener entre 1 y 40 caracteres.',
    correo: 'El correo debe tener un formato válido (ejemplo@dominio.com).',
    telefono: 'El teléfono debe tener entre 7 y 11 dígitos.',
    fechaDeNacimiento: 'Ingresa una fecha de nacimiento válida (formato: AAAA-MM-DD).',
    direccion: 'La dirección debe ser válida y puede contener números, letras y ciertos caracteres especiales.',
    genero: 'Seleccione un género válido.',
    estado: 'Seleccione un estado válido.',
    beneficiario: 'Seleccione si es beneficiario o no.',
    TieneCondicionCronica: 'Seleccione si tiene una condición crónica.',
    CirugiaPrevia: 'Seleccione si ha tenido cirugía previa.',
    AlergiasConocidas: 'Ingrese alergias conocidas válidas.',
    MedicamentosActuales: 'Ingrese medicamentos actuales válidos.',
    LesionesMusculoesqueleticas: 'Seleccione si tiene lesiones musculoesqueléticas.',
    EnfermedadCardiacaVascular: 'Seleccione si tiene enfermedad cardíaca o vascular.',
    AntecedentesFamiliares: 'Seleccione si tiene antecedentes familiares.',
    TipoAfiliacion: 'Seleccione un tipo de afiliación válido.',
    Peso: 'Ingrese un peso válido (ejemplo: 70).',
    Altura: 'Ingrese una altura válida en metros (ejemplo: 1.75).',
    IMC: 'Ingrese un IMC válido (se calcula automáticamente).'
};

const camposEditar = {
    documento: null,
    tipoDocumento: null,
    nombres: null,
    apellidos: null,
    correo: null,
    telefono: null,
    fechaDeNacimiento: null,
    direccion: null,
    genero: null,
    estado: null,
    beneficiario: null,
    TieneCondicionCronica: null,
    CirugiaPrevia: null,
    AlergiasConocidas: null,
    MedicamentosActuales: null,
    LesionesMusculoesqueleticas: null,
    EnfermedadCardiacaVascular: null,
    AntecedentesFamiliares: null,
    TipoAfiliacion: null,
    Peso: null,
    Altura: null,
    IMC: null
};

const validarFormularioEditar = (e) => {
    const campo = e.target.name;

    if (e.target.value.trim() !== "") {
        if (expresionesEditar[campo]) {
            validarCampoEditar(expresionesEditar[campo], e.target, campo);
        }
    } else {
        limpiarValidacionEditar(e.target, campo);
    }
};

const validarCampoEditar = (expresion, input, campo) => {
    const grupo = document.getElementById(`grupo__${campo}`);
    const icono = document.querySelector(`#grupo__${campo} i`);
    const errorTexto = document.querySelector(`#grupo__${campo} .formularioEditar__input-error`);

    grupo.classList.remove('formularioEditar__grupo-pendiente');
    
    if (expresion.test(input.value)) {
        grupo.classList.remove('formularioEditar__grupo-incorrecto');
        grupo.classList.add('formularioEditar__grupo-correcto');
        icono.classList.add('fa-check-circle');
        icono.classList.remove('fa-times-circle');
        errorTexto.classList.remove('formularioEditar__input-error-activo');
        camposEditar[campo] = true;
    } else {
        grupo.classList.add('formularioEditar__grupo-incorrecto');
        grupo.classList.remove('formularioEditar__grupo-correcto');
        icono.classList.remove('fa-check-circle');
        icono.classList.add('fa-times-circle');
        errorTexto.classList.add('formularioEditar__input-error-activo');
        errorTexto.textContent = mensajesErrorEditar[campo];
        camposEditar[campo] = false;
    }
};

const limpiarValidacionEditar = (input, campo) => {
    const grupo = document.getElementById(`grupo__${campo}`);
    const icono = document.querySelector(`#grupo__${campo} i`);
    const errorTexto = document.querySelector(`#grupo__${campo} .formularioEditar__input-error`);

    grupo.classList.add('formularioEditar__grupo-pendiente');
    grupo.classList.remove('formularioEditar__grupo-incorrecto', 'formularioEditar__grupo-correcto');
    icono.classList.remove('fa-check-circle', 'fa-times-circle');
    errorTexto.classList.remove('formularioEditar__input-error-activo');
    camposEditar[campo] = null;
};

inputsEditar.forEach((input) => {
    input.classList.add('formularioEditar__grupo-pendiente');
    input.addEventListener('change', validarFormularioEditar);
    input.addEventListener('keyup', validarFormularioEditar);
    input.addEventListener('blur', validarFormularioEditar);
});

formularioEditar.addEventListener('submit', (e) => {
    e.preventDefault();

    const camposValidos = Object.values(camposEditar).every(campo => campo === true);
    const camposLlenos = Array.from(inputsEditar).every(input => input.value.trim() !== '');

    if (camposValidos && camposLlenos) {
        actualizarCliente();
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error de Validación',
            text: 'Por favor completa correctamente todos los campos obligatorios.'
        });
    }
});
