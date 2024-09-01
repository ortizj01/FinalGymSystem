const formulariocategoria = document.getElementById('formularioCategoria');
const inputs = document.querySelectorAll('#formularioCategoria input');


const expresiones = {
	Nombrecategoria: /^[a-zA-Z\s]+$/,
    categoria:/^[a-zA-Z\s]+$/
}

const campos={
    Nombrecategoria:false,
    categoria:false
}


const validarformularioCategoria = (e)=> {
    switch(e.target.name){
        case "Nombrecategoria":
            validarcampo(expresiones.Nombrecategoria, e.target,"Nombrecategoria");
            break
    }
    switch(e.target.name){
        case "categoria":
            validarcampo(expresiones.categoria, e.target,"categoria");
            break
    }


}


const validarcampo = (expresion,input,campo) => {
    if (expresion.test(input.value)) {
        document.getElementById(`grupo__${campo}`).classList.remove("formulario__grupo-incorrecto");
        document.getElementById(`grupo__${campo}`).classList.add("formulario__grupo-correcto");
        document.getElementById(`grupo__${campo}`).classList.add("formulario__grupo-correcto");
        document.querySelector(`#grupo__${campo} i`).classList.add("fa-check-circle");
        document.querySelector(`#grupo__${campo} i`).classList.remove("fa-times-circle");
        document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.remove("formulario__input-error-activo");
        campos[campo]=true;
    }else {
        document.getElementById(`grupo__${campo}`).classList.add("formulario__grupo-incorrecto");
        document.getElementById(`grupo__${campo}`).classList.remove("formulario__grupo-correcto");
        document.querySelector(`#grupo__${campo} i`).classList.add("fa-times-circle");
        document.querySelector(`#grupo__${campo} i`).classList.remove("fa-check-circle");
        document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.add("formulario__input-error-activo");
        campos[campo]=false;
    }


}

inputs.forEach((input)=>{
    input.addEventListener('keyup',validarformularioCategoria);
    input.addEventListener('blur',validarformularioCategoria);
    });

formulariocategoria.addEventListener('submit',(e) => {
    e.preventDefault();
    if(campos.Nombrecategoria && campos.categoria){
        formulariocategoria.reset()
        document.getElementById('formulario__mensaje-exito').classList.add('formulario__mensaje-exito-activo');
        setTimeout(() => {
            document.getElementById('formulario__mensaje-exito').classList.remove('formulario__mensaje-exito-activo');
        }, 3000);
        document.querySelectorAll('.formulario__grupo-correcto').forEach((icono)=>{
            icono.classList.remove('formulario__grupo-correcto')
        });
    } else {
        document.getElementById('formulario__mensaje').classList.add('formulario__mensaje-activo')
        setTimeout(() => {
            document.getElementById('formulario__mensaje').classList.remove('formulario__mensaje-activo');
        }, 3000);

    }
});



