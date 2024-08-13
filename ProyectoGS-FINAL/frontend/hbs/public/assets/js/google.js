// Obtener el enlace del logo de Google por su ID
var googleLogo = document.getElementById('google-logo');

// Función para abrir la ventana emergente
function openGoogleSignIn() {
  var width = 500;
  var height = 600;
  var left = (window.innerWidth - width) / 2;
  var top = (window.innerHeight - height) / 2;

  var url = 'https://accounts.google.com/signin/v2/identifier?client_id=TU_ID_DE_CLIENTE.apps.googleusercontent.com&redirect_uri=URITuRedireccion&response_type=token&scope=email%20profile';

  window.open(url, 'GoogleSignIn', 'width=' + width + ',height=' + height + ',left=' + left + ',top=' + top);
}

// Agregar un controlador de eventos al clic en el enlace del logo de Google
googleLogo.addEventListener('click', openGoogleSignIn);
