document.addEventListener('DOMContentLoaded', function() {

    // Eventos para calcular el IMC
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
});

const formularioRegistro = document.getElementById('formularioRegistro');
const inputs = document.querySelectorAll('#formularioRegistro input, #formularioRegistro select');

const expresiones = {
    documento: /^[a-zA-Z0-9]{7,10}$/,
    tipoDocumento: /^(cedula_ciudadania|pasaporte|tarjeta_identidad)$/,
    nombres: /^[a-zA-ZÀ-ÿ\s]{1,40}$/,
    apellidos: /^[a-zA-ZÀ-ÿ\s]{1,40}$/,
    correo: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    telefono: /^[0-9]{7,11}$/,
    fechaDeNacimiento: /^(\d{4})-(\d{2})-(\d{2})$/,
    direccion: /^[A-Za-z0-9\s#áéíóúÁÉÍÓÚüÜ.,-]+$/,
    genero: /^(Masculino|Femenino)$/,
    contrasena: /^(?=.*[A-Z])(?=.*\d).{4,12}$/,
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

document.addEventListener('DOMContentLoaded', function() {
    const fechaNacimientoInput = document.getElementById('fechaDeNacimiento');
    
    // Validar la fecha de nacimiento
    fechaNacimientoInput.addEventListener('blur', function() {
        const fechaIngresada = new Date(fechaNacimientoInput.value);
        const limiteFecha = new Date('2010-12-31');

        if (fechaIngresada > limiteFecha) {
            mostrarErrorFechaNacimiento();
            fechaNacimientoInput.value = ''; // Limpiar el campo
        } else {
            limpiarErrorFechaNacimiento();
        }
    });

    const mostrarErrorFechaNacimiento = () => {
        const grupo = document.getElementById('grupo__fechaDeNacimiento');
        const icono = grupo.querySelector('i');
        const errorTexto = grupo.querySelector('.formulario__input-error');

        grupo.classList.add('formulario__grupo-incorrecto');
        icono.classList.add('fa-times-circle');
        icono.classList.remove('fa-check-circle');
        errorTexto.classList.add('formulario__input-error-activo');
        errorTexto.textContent = 'La fecha de nacimiento no puede ser posterior al 2010.';
    };

    const limpiarErrorFechaNacimiento = () => {
        const grupo = document.getElementById('grupo__fechaDeNacimiento');
        const icono = grupo.querySelector('i');
        const errorTexto = grupo.querySelector('.formulario__input-error');

        grupo.classList.remove('formulario__grupo-incorrecto');
        grupo.classList.add('formulario__grupo-correcto');
        icono.classList.remove('fa-times-circle');
        icono.classList.add('fa-check-circle');
        errorTexto.classList.remove('formulario__input-error-activo');
        errorTexto.textContent = 'Ingresa una fecha de nacimiento válida.';
    };
});


const mensajesError = {
    documento: 'El documento debe tener entre 7 y 10 caracteres alfanuméricos.',
    tipoDocumento: 'Seleccione un tipo de documento válido.',
    nombres: 'Los nombres solo pueden contener letras y espacios, y deben tener entre 1 y 40 caracteres.',
    apellidos: 'Los apellidos solo pueden contener letras y espacios, y deben tener entre 1 y 40 caracteres.',
    correo: 'El correo debe tener un formato válido (ejemplo@dominio.com).',
    telefono: 'El teléfono debe tener entre 7 y 11 dígitos.',
    fechaDeNacimiento: 'Ingresa una fecha de nacimiento válida (formato: AAAA-MM-DD).',
    direccion: 'La dirección debe ser válida y puede contener números, letras y ciertos caracteres especiales.',
    genero: 'Seleccione un género válido.',
    contrasena: 'La contraseña debe tener entre 4 y 12 caracteres, incluyendo al menos una mayúscula y un número.',
    confirmarContrasena: 'Las contraseñas no coinciden.',
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

const campos = {
    documento: null,
    tipoDocumento: null,
    nombres: null,
    apellidos: null,
    correo: null,
    telefono: null,
    fechaDeNacimiento: null,
    direccion: null,
    genero: null,
    contrasena: null,
    confirmarContrasena: null,
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

const validarFormulario = (e) => {
    const campo = e.target.name;

    if (e.target.value.trim() !== "") {
        if (expresiones[campo]) {
            validarCampo(expresiones[campo], e.target, campo);
        }
        if (campo === "contrasena") {
            validarConfirmacionContrasena();
        }
    } else {
        limpiarValidacion(e.target, campo);
    }
};

const validarCampo = (expresion, input, campo) => {
    const grupo = document.getElementById(`grupo__${campo}`);
    const icono = grupo ? grupo.querySelector('i') : null;
    const errorTexto = grupo ? grupo.querySelector('.formulario__input-error') : null;

    grupo.classList.remove('formulario__grupo-pendiente');
    
    if (expresion.test(input.value)) {
        grupo.classList.remove('formulario__grupo-incorrecto');
        grupo.classList.add('formulario__grupo-correcto');
        if (icono) {
            icono.classList.add('fa-check-circle');
            icono.classList.remove('fa-times-circle');
        }
        if (errorTexto) {
            errorTexto.classList.remove('formulario__input-error-activo');
        }
        campos[campo] = true;
    } else {
        grupo.classList.add('formulario__grupo-incorrecto');
        grupo.classList.remove('formulario__grupo-correcto');
        if (icono) {
            icono.classList.remove('fa-check-circle');
            icono.classList.add('fa-times-circle');
        }
        if (errorTexto) {
            errorTexto.classList.add('formulario__input-error-activo');
            errorTexto.textContent = mensajesError[campo];
        }
        campos[campo] = false;
    }
};

const limpiarValidacion = (input, campo) => {
    const grupo = document.getElementById(`grupo__${campo}`);
    const icono = grupo ? grupo.querySelector('i') : null;
    const errorTexto = grupo ? grupo.querySelector('.formulario__input-error') : null;

    grupo.classList.add('formulario__grupo-pendiente');
    grupo.classList.remove('formulario__grupo-incorrecto', 'formulario__grupo-correcto');
    if (icono) {
        icono.classList.remove('fa-check-circle', 'fa-times-circle');
    }
    if (errorTexto) {
        errorTexto.classList.remove('formulario__input-error-activo');
    }
    campos[campo] = null;
};

inputs.forEach((input) => {
    input.classList.add('formulario__grupo-pendiente');
    input.addEventListener('change', validarFormulario);
    input.addEventListener('keyup', validarFormulario);
    input.addEventListener('blur', validarFormulario);
});

formularioRegistro.addEventListener('submit', (e) => {
    e.preventDefault();

    const camposValidos = Object.values(campos).every(campo => campo === true);
    const camposLlenos = Array.from(inputs).every(input => input.value.trim() !== '');

    if (camposValidos && camposLlenos) {
        registrar();
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error de Validación',
            text: 'Por favor completa correctamente todos los campos obligatorios.'
        });
    }
});
