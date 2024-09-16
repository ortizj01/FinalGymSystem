async function inicializarDatosEditarBeneficiario() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');

        if (!id) {
            console.error('ID del cliente no encontrado en la URL');
            Swal.fire({
                icon: "error",
                title: "¡Oops...",
                text: "ID del cliente no encontrado en la URL"
            });
            return;
        }

        // Obtener los datos del cliente
        const response = await fetch(`https://finalgymsystem.onrender.com/api/usuarios/${id}`);
        if (!response.ok) {
            throw new Error('Error al obtener datos del cliente: ' + response.statusText);
        }
        const cliente = await response.json();

        const fechaNacimiento = new Date(cliente.FechaDeNacimiento);
        const formattedFechaNacimiento = fechaNacimiento.toISOString().split('T')[0];

        document.getElementById('clienteId').value = cliente.IdUsuario;
        document.getElementById('documento').value = cliente.Documento;
        document.getElementById('tipoDocumento').value = cliente.TipoDocumento;
        document.getElementById('nombres').value = cliente.Nombres;
        document.getElementById('apellidos').value = cliente.Apellidos;
        document.getElementById('correo').value = cliente.Correo;
        document.getElementById('telefono').value = cliente.Telefono;
        document.getElementById('fechaDeNacimiento').value = formattedFechaNacimiento;
        document.getElementById('direccion').value = cliente.Direccion;
        document.getElementById('genero').value = cliente.Genero;
        document.getElementById('estado').value = cliente.Estado;

        // Verificar si el cliente está asociado con un beneficiario y cargar los datos
        if (cliente.Beneficiario) {
            const beneficiarioResponse = await fetch(`https://finalgymsystem.onrender.com/api/usuarios/${cliente.Beneficiario}`);
            if (beneficiarioResponse.ok) {
                const beneficiario = await beneficiarioResponse.json();
                document.getElementById('cliente').value = beneficiario.IdUsuario;
                document.getElementById('buscarCliente').value = beneficiario.Documento;
                document.getElementById('nombreClienteSeleccionado').value = `${beneficiario.Nombres} ${beneficiario.Apellidos}`;
            }
        }

        // Inicializar la búsqueda de cliente
        inicializarBusquedaCliente();

    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            icon: "error",
            title: "¡Oops...",
            text: "Ocurrió un error al inicializar los datos del beneficiario"
        });
    }
}

async function inicializarBusquedaCliente() {
    const documentosMostrados = new Set();

    document.getElementById('buscarCliente').addEventListener('input', async function(event) {
        const documento = event.target.value;
        const resultadosBusqueda = document.getElementById('resultadosBusqueda');

        // Validar que solo se ingresen caracteres numéricos
        if (!/^\d*$/.test(documento)) {
            event.target.value = documento.replace(/\D/g, ''); // Remover caracteres no numéricos
            return;
        }

        resultadosBusqueda.innerHTML = ''; // Limpiar resultados previos
        documentosMostrados.clear(); // Reiniciar el conjunto de documentos mostrados

        if (documento.length >= 1) { // Realizar la búsqueda si hay al menos 1 carácter
            const clientes = await buscarClientesPorDocumento(documento);

            if (clientes && clientes.length > 0) {
                clientes.forEach(cliente => {
                    if (!documentosMostrados.has(cliente.Documento)) {
                        documentosMostrados.add(cliente.Documento);
                        const item = document.createElement('a');
                        item.classList.add('list-group-item', 'list-group-item-action');
                        item.textContent = `${cliente.Documento} - ${cliente.Nombres} ${cliente.Apellidos}`;
                        item.addEventListener('click', () => {
                            document.getElementById('cliente').value = cliente.IdUsuario;
                            document.getElementById('buscarCliente').value = cliente.Documento;
                            document.getElementById('nombreClienteSeleccionado').value = `${cliente.Nombres} ${cliente.Apellidos}`;
                            resultadosBusqueda.innerHTML = '';
                        });
                        resultadosBusqueda.appendChild(item);
                    }
                });
            } else {
                resultadosBusqueda.innerHTML = '<div class="list-group-item">No se encontraron coincidencias</div>';
            }
        } else {
            resultadosBusqueda.innerHTML = ''; // Limpiar resultados si no hay caracteres
        }
    });

    // Función de búsqueda de clientes por documento
    const buscarClientesPorDocumento = async (documento) => {
        try {
            const response = await fetch(`https://finalgymsystem.onrender.com/api/clientes/buscar/${documento}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('No se encontraron coincidencias');
            }

            const clientes = await response.json();
            return clientes;

        } catch (error) {
            console.error('Error:', error.message);
        }
    };
}


const buscarUsuariosPorDocumento = async (documento) => {
    try {
        const response = await fetch(`https://finalgymsystem.onrender.com/api/usuarios/buscar/${documento}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('No se encontraron coincidencias');
        }

        const usuarios = await response.json();
        return usuarios;

    } catch (error) {
        console.error('Error:', error.message);
    }
};

// Función para redirigir a la página de edición de valoración médica
function redirigirValoracionMedica() {
    const usuarioId = document.getElementById('clienteId').value;
    window.location.href = `editarValoracionMedica?id=${usuarioId}`;
}

// Función para calcular el IMC
function calcularIMC() {
    const peso = parseFloat(document.getElementById('Peso').value);
    const altura = parseFloat(document.getElementById('Altura').value);
    if (peso && altura) {
        const imc = (peso / (altura * altura)).toFixed(2);
        document.getElementById('IMC').value = imc;
    }
}

// Escuchar cambios en los campos de peso y altura
document.getElementById('Peso').addEventListener('input', calcularIMC);
document.getElementById('Altura').addEventListener('input', calcularIMC);

async function editarBeneficiario() {
    try {
        const form = document.getElementById('formularioEditar');
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        const id = data.id;

        const getResponse = await fetch(`https://finalgymsystem.onrender.com/api/usuarios/${id}`);
        if (!getResponse.ok) {
            throw new Error('Error al obtener datos del cliente: ' + getResponse.statusText);
        }
        const currentData = await getResponse.json();

        const updatedData = {
            Documento: data.documento || currentData.Documento,
            TipoDocumento: data.tipoDocumento || currentData.TipoDocumento,
            Nombres: data.nombres || currentData.Nombres,
            Apellidos: data.apellidos || currentData.Apellidos,
            Correo: data.correo || currentData.Correo,
            Telefono: data.telefono || currentData.Telefono,
            FechaDeNacimiento: data.fechaDeNacimiento || currentData.FechaDeNacimiento,
            Direccion: data.direccion || currentData.Direccion,
            Genero: data.genero || currentData.Genero,
            Contrasena: currentData.Contrasena,
            Estado: data.estado,
            Beneficiario: data.cliente || currentData.Beneficiario // Actualizar beneficiario
        };

        const putResponse = await fetch(`https://finalgymsystem.onrender.com/api/usuarios/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });

        if (!putResponse.ok) {
            throw new Error('Error en la solicitud: ' + putResponse.statusText);
        }

        console.log('Datos del cliente actualizados correctamente');
        Swal.fire({
            title: "¡Excelente!",
            text: "Beneficiario Actualizado Correctamente!",
            icon: "success",
        }).then(() => {
            window.location.href = '/beneficiarios';
        });

        document.querySelectorAll('.formularioEditar__grupo-correcto').forEach((icono) => {
            icono.classList.remove('formularioEditar__grupo-correcto');
        });
        
    } catch (error) {
        console.error('Error:', error);
        console.log('Error al actualizar los datos del cliente');
        Swal.fire({
            icon: "error",
            title: "¡Oops...",
            text: "Ingresa los datos correctos"
        });
    }
}