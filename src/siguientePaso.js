

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

export default siguientePaso;