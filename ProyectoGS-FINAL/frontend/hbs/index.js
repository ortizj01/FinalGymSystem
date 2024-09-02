const express = require('express');
const path = require('path');
const hbs = require('hbs');


const formArray = [];
const app = express()
const port = 8086

// Configuración del middleware para analizar datos POST
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'))

// Asignar la ubicacion de los archivos hbs
app.set('views', path.join(__dirname+'/public/views'))
// Ingenieria de las vistas hbs
app.set('view engine', 'hbs')
// Configuracion del directorio que guardara los archivos partials hbs
hbs.registerPartials(__dirname + '/public/views/partials')

app.get('/', (req, res)=>{
    res.render('index', {
        "nombre":"Juan Ortiz",
        "email":"juanes@gmail.com"
    })//Redireccionar hacia el archivo hbs
})

// INICIO GESTION ACCESO *JUANES*

// Rutas de autenticación

app.get('/ingresar', (req, res)=>{
    res.render('auth/sign-in')
})

app.get('/pruebaGit', (req, res)=>{
    res.render('pruebaGit')
})


app.get('/registrar-usuario', (req, res)=>{
    res.render('auth/sign-up')
})

app.get('/recuperar-contrasena', (req, res)=>{
    res.render('auth/recoverpw')
})

app.get('/confirmacion', (req, res)=>{
    res.render('auth/confirm-mail')
})

app.get('/perfil', (req, res)=>{
    res.render('auth/user-account-setting')
})

app.get('/restablecer/:token', (req, res) => {
    const { token } = req.params;
    res.render('auth/new-password', { token });
});


// FIN GESTION ACCESO

// INICIO COMPRAS *ALEJANDRO*


app.get('/Proveedores', (req, res)=>{
    res.render('Proveedores')
})

app.get('/Compras', (req, res)=>{
    res.render('Compras')
})

app.get('/Productos', (req, res)=>{
    res.render('Productos')
})

app.get('/Devolucioncom', (req, res)=>{
    res.render('Devolucioncom')
})

app.get('/Categoriaprod', (req, res)=>{
    res.render('Categoriaprod')
})

app.get('/formDevolucioncom', (req, res)=>{
    res.render('formDevolucioncom')
})

app.get('/formproveedores', (req, res)=>{
    res.render('formproveedores')
})

app.get('/formcompras', (req, res)=>{
    res.render('formcompras')
})

app.get('/formproductos', (req, res)=>{
    res.render('formproductos')
})

app.get('/DevolucionEditar', (req, res)=>{
    res.render('DevolucionEditar')
})

app.get('/ProductosEditar', (req, res)=>{
    res.render('ProductosEditar')
})

app.get('/ProveedoresEditar', (req, res)=>{
    res.render('ProveedoresEditar')
})

app.get('/visualizarcompra', (req, res)=>{
    res.render('visualizarcompra')
})

app.get('/visualizardevcompra', (req, res)=>{
    res.render('visualizardevcompra')
})

app.get('/dashboard', (req, res)=>{
    res.render('dashboard')
})


// FIN COMPRAS


// INICIO SERVICIOS

//WEIMAR

app.get('/usuariosAdmin', (req, res)=>{
    res.render('usuariosAdmin')
})
app.get('/formUsuarios.hbs', (req, res)=>{
    res.render('formUsuarios.hbs')
})
app.get('/formUsuariosModal', (req, res)=>{
    res.render('formUsuariosModal')
})
app.get('/detalleUSuario', (req, res)=>{
    res.render('detalleUsuario')
})
app.get('/usuariosEntrenador', (req, res)=>{
    res.render('usuariosEntrenador')
})

app.get('/serviciosAdmin', (req, res)=>{
    res.render('serviciosAdmin')
})

app.get('/serviciosEntrenador', (req, res)=>{
    res.render('serviciosEntrenador')
})



app.get('/formServicios', (req, res)=>{
    res.render('formServicios')
})
app.get('/serviciosAdmin', (req, res)=>{
    res.render('serviciosAdmin')
})
app.get('/usuariosAdmin', (req, res)=>{
    res.render('usuariosAdmin')
})

app.get('/detalleServicio', (req, res)=>{
    res.render('detalleServicio')
})

app.get('/formServicios', (req, res)=>{
    res.render('formServicios')
})
app.get('/formServiciosModal', (req, res)=>{
    res.render('formServiciosModal')
})
app.get('/serviciosAdmin', (req, res)=>{
    res.render('serviciosAdmin')
})
app.get('/detalleServicio', (req, res)=>{
    res.render('detalleServicio')
})


app.get('/membresiasAdmin', (req, res)=>{
    res.render('membresiasAdmin')
})
app.get('/formMembresias', (req, res)=>{
    res.render('formMembresias')
})
app.get('/formMembresiasModal', (req, res)=>{
    res.render('formMembresiasModal')
})
app.get('/membresiasAdmin', (req, res)=>{
    res.render('membresiasAdmin')
})
app.get('/detalleMembresia', (req, res)=>{
    res.render('detalleMembresia')
})
app.get('/membresiasCliente', (req, res)=>{
    res.render('membresiasCliente')
})
//fin weimar

// INICIO RUTINA *JUANES*

//Rutinas

app.get('/rutinas', (req, res)=>{
    res.render('rutinas');
});

app.get('/rutina', (req, res)=>{
    res.render('rutinas/rutinaCliente');
});

app.get('/nueva-rutina', (req, res)=>{
    res.render('formRutina')
});

app.get('/agenda-servicios', (req, res) => {
    res.render('calendario')
});

//Ejercicios

app.get('/ejercicios', (req, res)=>{
    res.render('ejercicios_views/tablaEjercicios');
});

app.get('/nuevo-ejercicio', (req, res)=>{
    res.render('ejercicios_views/formEjercicio');
});
app.get('/editarEjercicio', (req, res)=>{
    res.render('ejercicios_views/editarEjercicio');
});

//eventos
app.get('/eventos', (req, res)=>{
    res.render('eventos/calendario');
});

//eventos
app.get('/eventosCliente', (req, res)=>{
    res.render('eventosCliente/calendarioCliente');
});


//




// FIN SERVICIOS


app.get('/roles2', (req, res)=>{
    res.render('roles_permisos/tablaRoles')
})

app.get('/asignarPermisos', (req, res)=>{
    res.render('roles_permisos/permisos')
})

app.get('/CrearRol', (req, res)=>{
    res.render('CrearRol')
})

// JOHANY

app.get('/GestionVentas', (req, res)=>{
    res.render('ventas_vistas/GestionVentas')
})

app.get('/visualizarventa', (req, res)=>{
    res.render('ventas_vistas/visualizarventa')
})

app.get('/ventasCliente', (req, res)=>{
    res.render('ventas_vistas/ventasCliente')
})

app.get('/visualizarVentasClientes', (req, res)=>{
    res.render('ventas_vistas/visualizarVentasClientes')
})



app.get('/formuVenta', (req, res)=>{
    res.render('ventas_vistas/formuVenta')
})

app.get('/GestionDevoluciones', (req, res)=>{
    res.render('devolucion.ventas/GestionDevoluciones')
})

app.get('/formulDevolucion', (req, res)=>{
    res.render('devolucion.ventas/formulDevolucion')
})


//PRUEBAS TABLAS


//FIN PRUEBA

// FIN ROLES

// Inicio Ventas *YONIER*

app.get('/clientes', (req, res)=>{
    res.render('clientes/clientes')
})
app.get('/beneficiarios', (req, res)=>{
    res.render('beneficiarios/beneficiarios')
})
app.get('/formularioCliente', (req, res)=>{
    res.render('clientes/formularioCliente')
})
app.get('/detalleCliente', (req, res)=>{
    res.render('clientes/detalleCliente')
})
app.get('/detalleClienteBeneficiario', (req, res)=>{
    res.render('clientes/detalleClienteBeneficiario')
})
app.get('/editarCliente', (req, res)=>{
    res.render('clientes/editarCliente')
})
app.get('/detalleBeneficiario', (req, res)=>{
    res.render('beneficiarios/detalleBeneficiario')
})
app.get('/detalleBeneficiarioCliente', (req, res)=>{
    res.render('beneficiarios/detalleBeneficiarioCliente')
})
app.get('/formularioBeneficiario', (req, res)=>{
    res.render('beneficiarios/formularioBeneficiario')
})
app.get('/EditarBeneficiario', (req, res)=>{
    res.render('beneficiarios/EditarBeneficiario')
})
app.get('/editarValoracionMedica', (req, res)=>{
    res.render('beneficiarios/editarValoracionMedica')
})
app.get('/pedidos', (req, res)=>{
    res.render('pedidos/pedidos')
})
app.get('/pedidoCliente', (req, res)=>{
    res.render('pedidos/pedidoCliente')
})
app.get('/editarPedido', (req, res)=>{
    res.render('pedidos/editarPedido')
})
app.get('/detallePedido', (req, res)=>{
    res.render('pedidos/detallePedido')
})
app.get('/gestionCarrito', (req, res)=>{
    res.render('carrito/gestionCarrito')
})
app.get('/indexCarrito', (req, res)=>{
    res.render('carrito/index')
})
app.get('/carrito', (req, res)=>{
    res.render('carrito/carrito')
})
app.get('/pedidoCarrito', (req, res)=>{
    res.render('carrito/pedido')
})
app.get('/QrCarrito', (req, res)=>{
    res.render('carrito/QR')
})
app.get('/detalleMembresiaCarrito', (req, res)=>{
    res.render('carrito/detalleMembresiaCarrito')
})

// FIN Ventas *YONIER*


// FIN JOHANY


//Fin Ventas


// Fin rutinas

app.get('/plantilla', (req, res)=>{
    res.render('plantilla')
})

app.get('*', (req, res)=>{
    res.render('404')
})

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(port, () => {
    console.log(`Escuchado por el puerto ${port}`)
})