'use strict';

const formulario$3 = document.getElementById('formulario');


const validarCantidad = () => {
    //Aceptamos cualquier digito (0-9), y un punto con decimales (opcional).
    const expRegCantidad = /^\d+(\.\d+)?$/;

    //Obtenemos el input de cantidad.
    const inputCantidad = formulario$3.cantidad;

    if(expRegCantidad.test(inputCantidad.value)){
        inputCantidad.classList.remove('formulario__input--error');
        return true;
    }else {
        inputCantidad.classList.add('formulario__input--error');
        return false;
    }
};

const marcarPaso = (paso) => {
    document.querySelector(`.linea-pasos [data-paso="${paso}"] span`).classList.add('linea-pasos__paso-check--checked');
};

const siguientePaso = () => {
    //Creamos un array con todos los pasos.
    const pasos = [...document.querySelectorAll('.linea-pasos__paso')];

    //Obtenemos el paso Activo:
    const pasoActivo = document.querySelector('.linea-pasos__paso-check--active').closest('.linea-pasos__paso');

    //Obtenemos el index del paso Activo:
    const indexPasoActivo = pasos.indexOf(pasoActivo);

    if(indexPasoActivo < pasos.length - 1){
        //Eliminamos la clase de paso activo.
        pasoActivo.querySelector('span').classList.remove('linea-pasos__paso-check--active');
        //Ponemos la clase de paso activo al siguiente elemento.
        pasos[indexPasoActivo + 1].querySelector('span').classList.add('linea-pasos__paso-check--active');
        
        //ScrollIntroView con los parametros de 'start' y 'behavior' creamos el efecto de scroll a la siguiente seccion.
        const idSeccionDatos = pasos[indexPasoActivo + 1].dataset.paso;
        document.querySelector(`.formulario__body [data-paso="${idSeccionDatos}"] `).scrollIntoView({
            inline: 'start',
            behavior: 'smooth',
        });
       

    }
};

const formulario$2 = document.getElementById('formulario');


const validarNombre = () => {
    
    const expRegNombre = /^[a-zA-ZÀ-ÿ\s]{1,40}$/;

    //Obtenemos el input de nombre.
    const inputNombre = formulario$2['nombre-receptor'];

    if(expRegNombre.test(inputNombre.value)){
        inputNombre.classList.remove('formulario__input--error');
        return true;
    }else {
        inputNombre.classList.add('formulario__input--error');
        return false;
    }
};

const formulario$1 = document.getElementById('formulario');


const validarCorreo = () => {
    
    const expRegCorreo = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

    //Obtenemos el input de nombre.
    const inputCorreo = formulario$1['correo-receptor'];

    if(expRegCorreo.test(inputCorreo.value)){
        inputCorreo.classList.remove('formulario__input--error');
        return true;
    }else {
        inputCorreo.classList.add('formulario__input--error');
        return false;
    }
};

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
            siguientePaso();
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
        },4000);
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

const linea = document.getElementById('linea-pasos');

linea.addEventListener('click', (e) => {
    if(!e.target.closest('.linea-pasos__paso')) return;

    const pasoActual = document.querySelector('.linea-pasos__paso-check--active').closest('.linea-pasos__paso').dataset.paso;

    //Validamos el paso actual.
    if(pasoActual === 'cantidad') {
        if(!validarCantidad()) return;
    } else if (pasoActual === 'datos'){
        if(!validarNombre() || !validarCorreo()) return;
    } 
    //Obtenemos el paso al que queremos navegar:
    const pasoANavegar = e.target.closest('.linea-pasos__paso');
    //Comprobamos si el paso tiene el icono de check:
    //Solo queremos poder dar click a los que tiene check:
    if(pasoANavegar.querySelector('.linea-pasos__paso-check--checked')){

        const pasoActual = linea.querySelector('.linea-pasos__paso-check--active');
        pasoActual.classList.remove('linea-pasos__paso-check--active');
        //Obtenemos el 'identificador' del paso a navegar: 
        const id = pasoANavegar.dataset.paso;
        //Agregamos la clase active al nuevo paso:
        linea.querySelector(`[data-paso="${id}"] span`).classList.add('linea-pasos__paso-check--active');
        
        //Navegamos al paso:
        document.querySelector(`.formulario__body [data-paso="${id}"]`).scrollIntoView({
            inline: 'start',
            behavior: 'smooth'
        });

        const btnFormulario = document.getElementById('formulario__btn');
        btnFormulario.querySelector('span').innerText = 'Siguiente';
        //Nos aseguramos de ocultar el icono del banco:
        btnFormulario.querySelector('[data-icono="banco"]').classList.remove('formulario__btn-contenedor-icono--active');
        //Nos aseguramos de mostrar el icono de siguiente:
        btnFormulario.querySelector('[data-icono="siguiente"]').classList.add('formulario__btn-contenedor-icono--active');
        //Nos aseguramos de que no tenga la clase de 'disabled':
        btnFormulario.classList.remove('formulario__btn--disabled');
    }
    
});
//# sourceMappingURL=bundle.js.map
