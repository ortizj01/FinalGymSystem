document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formularioRegistro');
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Evita el envío del formulario por defecto

        // Obtener los datos del formulario
        const formData = new FormData(form);

        // Convertir FormData a objeto JSON
        const jsonObject = {};
        formData.forEach(function(value, key) {
            jsonObject[key] = value;
        });

        // Añadir el campo Estado con valor predeterminado (activo: 1)
        jsonObject['Estado'] = 1;

        // Paso 1: Enviar los datos a tu API para crear el usuario
        fetch('http://localhost:3000/api/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonObject)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Hubo un problema al enviar los datos.');
            }
            return response.json();
        })
        .then(data => {
            // Paso 2: Obtener el ID del usuario creado
            const userId = data.IdUsuario; // Asumo que el ID del usuario se devuelve como IdUsuario en la respuesta

            // Paso 3: Asignar el rol de cliente al usuario creado
            return fetch('http://localhost:3000/api/assign-role', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ idUsuario: userId, idRol: 3 }) 
            });
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Hubo un problema al asignar el rol.');
            }
            return response.json();
        })
        .then(data => {
            console.log('Rol asignado correctamente:', data);
            alert('Registro exitoso y rol asignado correctamente.');
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Hubo un problema en el proceso. Por favor, inténtalo de nuevo.');
        });
    });
});
