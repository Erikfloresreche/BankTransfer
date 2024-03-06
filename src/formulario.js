import validarCantidad from "./validaciones/validarCantidad";
import marcarPaso from "./marcarPaso";
import siguientePaso from "./siguientePaso";
import validarNombre from "./validaciones/validarNombre";
import validarCorreo from "./validaciones/validarCorreo";
const formulario = document.getElementById('formulario');


//Reinicando scroll al cargar la pagina:
formulario.querySelector('.formulario__body').scrollLeft = 0;

//Este eventListener funciona para comprobar los campos de formulario cuando el usuario corrige.
formulario.addEventListener('keyup', (e) => {
    if(e.target.tagName === 'INPUT'){
        if(e.target.id === 'cantidad'){
            validarCantidad();
        } else if (e.target.id === 'nombre-receptor') {
            validarNombre();
        } else if (e.target.id === 'correo-receptor') {
            validarCorreo();
        }
    }
});
//Obtenemos el button de enviar formulario.
const btnFormulario = document.getElementById('formulario__btn');

//Este eventListener funciona solo cuando el usuario presiona el butto de formulario.
btnFormulario.addEventListener('click', (e) => {
    e.preventDefault();

    const pasoActual = document.querySelector('.linea-pasos__paso-check--active').closest('.linea-pasos__paso').dataset.paso;
    if(pasoActual === 'cantidad'){
        if(validarCantidad()){
            marcarPaso('cantidad');
            siguientePaso();
        } 
    } else if (pasoActual === 'datos') {
        if(validarNombre() && validarCorreo()){
            marcarPaso('datos');
            siguientePaso()
        }
    } else if (pasoActual === 'metodo') {
        marcarPaso('metodo');

        //Formato de moneda:
        const opciones = {style: 'currency', currency: 'EUR'};
        const formatoMoneda = new Intl.NumberFormat('es-ES', opciones);
        document.querySelector('[data-valor="cantidad"] span').innerText = formatoMoneda.format(formulario.cantidad.value);
        document.querySelector('[data-valor="nombre-receptor"] span').innerText = formulario['nombre-receptor'].value;
        document.querySelector('[data-valor="correo-receptor"] span').innerText = formulario['correo-receptor'].value;
        document.querySelector('[data-valor="metodo"] span').innerText = formulario.metodo.value;


        //Cambiamos el texto del btn siguiente por Tranferir:
        btnFormulario.querySelector('span').innerHTML = 'Transferir';
        //Agregamos la clase que deshabilita el button:
        btnFormulario.classList.add('formulario__btn--disabled');

        //Ocultamos el icono de 'siguiente':
        btnFormulario.querySelector('[data-icono="siguiente"]').classList.remove('formulario__btn-contenedor-icono--active');

        //Mostramos el icono del banco:
        btnFormulario.querySelector('[data-icono="banco"]').classList.add('formulario__btn-contenedor-icono--active');
        siguientePaso();

        //Eliminamos la clase de 'disabled' después de 4 seg:
        setTimeout(() => {
            btnFormulario.classList.remove('formulario__btn--disabled');
        },4000)
    } else if (pasoActual === 'confirmacion' && !btnFormulario.matches('.formulario__btn--disabled')) {
        //Cambiamos el texto del button de tranferir a transfiriendo:
        btnFormulario.querySelector('span').innerText = 'Transfiriendo';
        //Y lo volvemos a deshabilitar durante 4 seg:
        btnFormulario.classList.add('formulario__btn--disabled');

        //Ocultamos el formulario y mostramos la alerta de transferencia completada:
        setTimeout(() => {
            formulario.classList.add('formulario--hidden');
            document.getElementById('alerta').classList.add('alerta--active');
        }, 4000);

    }
});