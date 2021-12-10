import * as componentes from './componentes';
import * as tiempoHoy from './tiempoHoy';
import * as tiempoCuatroDias from './tiempoCuatroDias';
import * as coordenadas from './coordenadas';

let ciudadBuscar = '';
let paramSistema = '';
//Funcion cambio de localizacion (hacer visible la ventana de busqueda)

const eventoLocalizacion = () => {

    const btnLocalizacion = document.querySelector('#localizacion');
    
    const lateralInfo = document.getElementById('lateral-info');
    const lateralBuscar = document.getElementById('lateral-buscar');


    btnLocalizacion.addEventListener('click', () => {
        lateralInfo.style.display = 'none';
        lateralBuscar.style.position = 'relative';
        lateralBuscar.style.left = '0%';
    });

    eventoCambiarLocalizacion();
};


//Evento cambiarLocalizacion (cambiar la url por la url de la ciudad escogida y luego volver a init())
const eventoCambiarLocalizacion = () => {

    const inputCiudad = document.querySelector('#buscar-ubicacion');
    const btnBuscar = document.querySelector('#btnBuscar');
    btnBuscar.addEventListener('click',() => {

        ciudadBuscar = inputCiudad.value;
        
        init(ciudadBuscar,paramSistema);
    });
}

//Funcion cambio a localizaacion actual
const eventoLocalizacionActual = () => {

    const btnLocActual = document.querySelector('#ubicacion-actual');
    btnLocActual.addEventListener('click',() => {
        
        init('actual',paramSistema);
    });
}

//Funcion grados celsius - farenheit
const cambioSistema = () => {

    let btnFar = document.querySelector('#btn-far');
    let btnCelsius = document.querySelector('#btn-celsius');
    btnFar.addEventListener('click',async() => {
        paramSistema = 'imperial';
        if(ciudadBuscar!==''){
            
            await init(ciudadBuscar,paramSistema);
            btnFar = document.querySelector('#btn-far');
            btnCelsius = document.querySelector('#btn-celsius');
            btnFar.classList.add('disabled');
            btnCelsius.classList.remove('disabled');
        }else{
            await init('actual',paramSistema);
            btnFar = document.querySelector('#btn-far');
            btnCelsius = document.querySelector('#btn-celsius');
            btnFar.classList.add('disabled');
            btnCelsius.classList.remove('disabled');
        }
    });
    btnCelsius.addEventListener('click',() => {
        paramSistema = 'metric';
        if(ciudadBuscar!==''){
            init(ciudadBuscar);
            btnCelsius.classList.add('disabled');
            btnFar.classList.remove('disabled');  
        }else{
            
            init('actual');
            btnCelsius.classList.add('disabled');
            btnFar.classList.remove('disabled');  
        }      
    });


}

// Funcion iniciar pagina web
const init = async(ciudad='actual',celFar) => {  
    
    const body = document.querySelector('body');
    let spinner = document.querySelector('#cargando');

    if(!spinner){
        const divSpinner = `
            <div id="cargando">
                <div class="row w-100 h-100">
                    <div id="spinner">
                        <div class="spinner-border text-info" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>
                    <div class="col-12 col-sm-3 col-md-4 pt-2 fclaro"></div>
                    <div class="col-12 col-sm-9 col-md-8 foscuro p-5 pt-3">
                
                    </div>
                </div>
            </div>
        `;
        body.innerHTML = divSpinner;
    }

     // Cargar contenido pagina
    
    const coordActual = await coordenadas.coordenadasActual();
    
    let objetoClima = {};
    let objetoClimaDias = {};

    if(ciudad==='actual'){
        objetoClima = await tiempoHoy.obtenerClimaCoordenadas(coordActual,celFar);
        objetoClimaDias = await tiempoCuatroDias.obtenerClimaCoordenadas(coordActual,celFar);
    }else{
        objetoClima = await tiempoHoy.obtenerClimaCiudad(ciudad,celFar);
        objetoClimaDias = await tiempoCuatroDias.obtenerClimaCiudad(await tiempoCuatroDias.obtenerCoordCiudad(objetoClima),celFar);
    }

    // Eliminar spinner        
    spinner = document.querySelector('#cargando');
    body.removeChild(spinner);

   
    // Insertar contenido principal    
    const htmlMain = `
        <div id="main">
            <div class="row w-100">
                <div class="col-12 col-sm-3 col-md-4 pt-2 fclaro" >
                    <div id="lateral-buscar" >
                        <div>
                            <div class="input-group w-75 mx-auto mb-5 mt-5">
                                <input type="text" class="form-control" id="buscar-ubicacion" placeholder="Buscar ubicación" aria-label="Buscar ubicación" aria-describedby="button-addon2">
                                <button class="btn btn-secondary" type="button" id="btnBuscar">Buscar</button>
                            </div>
                        </div>
                    </div>
                    <div id="lateral-info">
                        <div class="row mt-4 d-flex justify-content-between wrap mx-3">
                            <div class="col-6">
                                <button class="btn btn-secondary shadow-sm p-2 px-3" id="localizacion">Localización</button>
                            </div>
                            <div class="col-3 d-flex d-sm-block d-md-flex justify-content-end">
                                <button class="btn btn-secondary shadow-sm circulo" id="ubicacion-actual" title="Mi ubicación"><span class="material-icons fs-5">my_location</span></button>
                            </div>
                        </div>
                        <div class="row mt-4">
                            <img src="" alt="tiempo" class="my-5 mx-auto"
                                id="img-tiempo">

                        </div>
                        <div class="row">
                            <p class="text-center numeros"><span class="numeros" id="temphoy"></span><span class="fs-5" id="celsius-far"></span></p>
                        </div>
                        <div class="row">
                            <p class="fs-6 text-center texto" id="descripcion-clima"></p>
                        </div>
                        <div class="row">
                            <p class="fs-6 text-center texto" id="fecha-hoy"></p>
                            <p class="fs-6 text-center texto" id="ubicacion"></p>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-9 col-md-8 foscuro p-5 pt-3">
                    <div class="row  d-flex justify-content-end " id="btn-medida">
                        <div class="col-8"></div>
                        <div class="col-2">
                            <button class="btn disabled circulo" id="btn-celsius">ºC</button>
                        </div>
                        <div class="col-2">
                            <button class="btn btn-secondary circulo" id="btn-far">
                                <span>ºF</span>
                            </button>
                        </div>
                    </div>
                    <div class="row d-flex justify-content-between mt-3 caja-semana texto" id="contenedor-cajas">
                        
                    </div>
                    <h3 class="mt-4 texto">Today's Hightlights</h3>
                    <div class="row mt-3 mb-4 texto justify-content-between" id="highlights">

                    </div>

                </div>
            </div>
        </div>
    `;
    body.innerHTML = htmlMain;

    // Insertar imagen principal
    const imgHtml = document.querySelector('#img-tiempo');
    imgHtml.src = await componentes.cambiarImagen(objetoClima);

    // Insertar temperatura actual
    const tempHoy = document.querySelector('#temphoy');
    const sistema = document.querySelector('#celsius-far');
    tempHoy.innerHTML = await tiempoHoy.obtenerTempActual(objetoClima);
    
    let btnFar = document.querySelector('#btn-far');
    let btnCelsius = document.querySelector('#btn-celsius');
    
    if(celFar==='imperial'){
        sistema.innerHTML = 'ºF';
        btnFar.classList.add('disabled');
        btnCelsius.classList.remove('disabled');  
    }else{
        sistema.innerHTML = 'ºC';
        btnCelsius.classList.add('disabled');
        btnFar.classList.remove('disabled'); 
    }

    // Insertar descripcion clima actual
    const descripcion = document.querySelector('#descripcion-clima');
    descripcion.innerHTML = await componentes.descripcionClima(objetoClima);

    //Insertar fecha actual
    const fechaHoy = new Date();
    const fechaHtml = document.querySelector('#fecha-hoy');
    fechaHtml.innerHTML = await componentes.obtenerFecha(fechaHoy);

    // Insertar ubicación
    const ubicacion = document.querySelector('#ubicacion');
    ubicacion.innerHTML = `<span class="material-icons">room</span><span> ${await componentes.ubicacionActual(objetoClima)[0]}, ${await componentes.ubicacionActual(objetoClima)[1]}</span>`;

    // Insertar cajas
    await componentes.cajasDiarias(objetoClimaDias,celFar);
    
    // Insertar velocidad del viento 
    const highlights = document.querySelector('#highlights');
    const vientoHtml = `
        <p>
            Wind status
        </p>
        <p>
            <span class="fs-1">${await tiempoHoy.obtenerVelViento(objetoClima)}</span>km/h
        </p>
        <p>
            ${await tiempoHoy.obtenerDirViento(objetoClima)};
        </p>
    `;
    const divViento = document.createElement('div');
    divViento.classList = 'col-12 col-sm-5 mb-4 p-2 pb-0 text-center cajas';
    divViento.innerHTML = vientoHtml;
    highlights.appendChild(divViento);

    // Insertar humedad
    const humedadHtml = `
        <p>
            Humedad
        </p>
        <p>
            <span class="fs-1">${await tiempoHoy.obtenerHumedad(objetoClima)}</span>%
        </p>
    `;
    const divHumedad = document.createElement('div');
    divHumedad.classList = 'col-12 col-sm-5 mb-4 p-2 pb-0 text-center cajas pt-4';
    divHumedad.innerHTML = humedadHtml;
    highlights.appendChild(divHumedad);

    // Insertar vidibilidad
    const visibilidadHtml = `
        <p>
            Visibilidad
        </p>
        <p>
            <span class="fs-1">${await tiempoHoy.obtenerVisibilidad(objetoClima)}</span>m
        </p>
    `;
    const divVisibilidad = document.createElement('div');
    divVisibilidad.classList = 'col-12 col-sm-5 mb-4 p-2 pb-0 text-center cajas';
    divVisibilidad.innerHTML = visibilidadHtml;
    highlights.appendChild(divVisibilidad);

     // Insertar presion del aire
     const presionHtml = `
     <p>
         Presión del Aire
     </p>
     <p>
         <span class="fs-1">${await tiempoHoy.obtenerPress(objetoClima)}</span>hPa
     </p>
    `;
    const divPresion = document.createElement('div');
    divPresion.classList = 'col-12 col-sm-5 mb-4 p-2 pb-0 text-center cajas';
    divPresion.innerHTML = presionHtml;
    highlights.appendChild(divPresion);
    // ****************

    //Eventos;
    eventoLocalizacion();
    eventoLocalizacionActual();
    cambioSistema();
       
    
}


export{
    eventoLocalizacion,
    cambioSistema,
    init
}