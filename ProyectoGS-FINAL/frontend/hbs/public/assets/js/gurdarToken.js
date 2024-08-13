async function fetchWithAuth(url, options = {}) {
    const token = getToken();
    if (!token) {
        console.error('No token found');
        return;
    }

    // Agregar el token al encabezado de la solicitud
    options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json(); // Devuelve los datos como JSON
    } catch (error) {
        console.error('Error:', error);
        throw error; // Propaga el error para manejarlo en la llamada del método
    }
}
