import * as componentes from './componentes';
import * as tiempoHoy from './tiempoHoy';
import * as tiempoCuatroDias from './tiempoCuatroDias';
import * as coordenadas from './coordenadas';
import 'regenerator-runtime/runtime'

//Variables globales:
let ciudadBuscar = 'actual';
let paramSistema = 'metric';

//Funcion cambio de localizacion (hacer visible la ventana de busqueda)

const eventoLocalizacion = () => {

    const btnLocalizacion = document.querySelector('#localizacion');
    
    const lateralInfo = document.getElementById('lateral-info');
    const lateralBuscar = document.getElementById('lateral-buscar');
    const btnCerrarLocalizacion = document.getElementById('cerrar-localizacion');

    btnLocalizacion.addEventListener('click', () => {
        lateralInfo.style.display = 'none';
        lateralBuscar.style.position = 'relative'; 
        lateralBuscar.style.left = '0%';
    });

    btnCerrarLocalizacion.addEventListener('click', () => {
        
        lateralBuscar.style.left = '-100%';
        lateralBuscar.style.position = 'absolute';
        lateralInfo.style.display = 'block';          
        
    });
};

//Lista de últimas ciudad buscadas con LocalStorage
const agregarHistorialALS = (ciudad) => {

    localStorage.setItem(localStorage.length,ciudad);
    if(localStorage.length>=6){
        localStorage.removeItem('0')

        let listaCiudades = [];        
        for(let i=0;i<localStorage.length;i++){
            listaCiudades[i] = localStorage.getItem(i+1);
        };

        localStorage.clear();

        for(let i=0;i<listaCiudades.length;i++){
             localStorage.setItem(i,listaCiudades[i]);
        };
    };

    
}

const agregarLSAHistorial = () => {

    let listaCiudades = [];        
    for(let i=localStorage.length;i>0;i--){
        listaCiudades[localStorage.length-i] = localStorage.getItem(i-1);
    }

    const ciudades = document.querySelector('#ciudades');
    for(let ciudad of listaCiudades){
        ciudad = componentes.primeraLetraMayuscula(ciudad);
        const btnCiudad = `
           <button type="button" class="btn btn-outline-secondary w-100 mx-auto mb-2 text-start texto btn-ciudad">${ciudad}</button>        
        `;
        const divCiudad = document.createElement('div');
        divCiudad.innerHTML = btnCiudad;
        ciudades.appendChild(divCiudad);
    }
}

//Evento cerrar alerta de error de búsqueda de ciudad
const eventoCerrarAlerta = async(alertaCiudad) => {
    const btnCerrarAlerta = document.querySelector('#btn-cerrar-alerta');
    btnCerrarAlerta.addEventListener('click', async() => {
        alertaCiudad.classList.add('visually-hidden');
        await init(ciudadBuscar,paramSistema);        
    });
}


//Evento cambiarLocalizacion (cambiar la url por la url de la ciudad escogida y luego volver a init())
const eventoCambiarLocalizacion = async() => {

    const inputCiudad = document.querySelector('#buscar-ubicacion');
    const btnBuscar = document.querySelector('#btnBuscar');
    const btnCiudad = document.querySelectorAll('.btn-ciudad');
    let alertaCiudad = document.querySelector('#alerta-ciudad');

    btnBuscar.addEventListener('click',async () => {

        let nuevaCiudadBuscar = inputCiudad.value;
        
        agregarHistorialALS(nuevaCiudadBuscar);
        try{
            await init(nuevaCiudadBuscar,paramSistema);
            ciudadBuscar = nuevaCiudadBuscar;
        }catch(error){
            console.log(error);                
            localStorage.removeItem(localStorage.length-1);
            alertaCiudad = document.querySelector('#alerta-ciudad');
            alertaCiudad.classList.remove('visually-hidden');
            eventoCerrarAlerta(alertaCiudad);
        }
        
    });

    inputCiudad.addEventListener("keydown", async(e) => {
        if (e.keyCode === 13) {
            let nuevaCiudadBuscar = inputCiudad.value;
        
            agregarHistorialALS(nuevaCiudadBuscar);
            try{
                await init(nuevaCiudadBuscar,paramSistema);
                ciudadBuscar = nuevaCiudadBuscar;
            }catch(error){
                console.log(error);                
                localStorage.removeItem(localStorage.length-1);
                alertaCiudad = document.querySelector('#alerta-ciudad');
                alertaCiudad.classList.remove('visually-hidden');
                eventoCerrarAlerta(alertaCiudad);
            }
            
        }
    });

    btnCiudad.forEach((boton => {
        
        boton.addEventListener('click',async () => {
    
            ciudadBuscar = boton.innerHTML;
            
            await init(ciudadBuscar,paramSistema);
        });
    }))
}

//Funcion cambio a localizaacion actual
const eventoLocalizacionActual = () => {

    const btnLocActual = document.querySelector('#ubicacion-actual');
    btnLocActual.addEventListener('click',() => {
        
        ciudadBuscar = 'actual';
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
        }else{
            await init('actual',paramSistema);
        }
        btnFar = document.querySelector('#btn-far');
        btnCelsius = document.querySelector('#btn-celsius');        
        btnFar.classList.add('disabled');
        btnCelsius.classList.remove('disabled');        
    });
    btnCelsius.addEventListener('click',async() => {
        paramSistema = 'metric';
        if(ciudadBuscar!==''){
            await init(ciudadBuscar);            
        }else{            
            await init('actual');
        }  
        btnFar = document.querySelector('#btn-far');
        btnCelsius = document.querySelector('#btn-celsius');                
        btnCelsius.classList.add('disabled');
        btnFar.classList.remove('disabled');                 
    });


}

// Funcion iniciar pagina web
const init = async(ciudad='actual',celFar) => {  
    
    const body = document.querySelector('body');
    let spinner = document.querySelector('#cargando');

    if(!spinner){
        const divSpinner = `
            <div id="cargando">
                <div class="row vw-100 vh-100">
                    <div class="alert alert-warning alert-dismissible fade show visually-hidden fixed-top w-100" role="alert" id="alerta-ciudad">
                        <strong>¡Cuidado!</strong> La ciudad ingresada no se encuentra en nuestra base de datos ¡Inténtalo de nuevo!
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" id="btn-cerrar-alerta"></button>
                    </div>
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
    
    let coordActual;
    let objetoClima = {};
    let objetoClimaDias = {};

    if(ciudad==='actual'){
        coordActual = await coordenadas.coordenadasActual();
        objetoClima = await tiempoHoy.obtenerClimaCoordenadas(coordActual,celFar);
        objetoClimaDias = await tiempoCuatroDias.obtenerClimaCoordenadas(coordActual,celFar);
    }else{
        objetoClima = await tiempoHoy.obtenerClimaCiudad(ciudad,celFar);
        objetoClimaDias = await tiempoCuatroDias.obtenerClimaCiudad(await tiempoCuatroDias.obtenerCoordCiudad(objetoClima),celFar);
    }

    // Eliminar spinner        
    spinner = document.querySelector('#cargando');
    body.removeChild(spinner);

   
    console.log(objetoClima)
    // Insertar contenido principal    
    const htmlMain = `
        <div id="main">
            <div class="row">
                <div class="col-12 col-md-4 fclaro pe-0" id="lateral-izq">
                    <div id="lateral-buscar" class="fclaro pt-2 px-3">
                        <div class="row">
                            <div class="col-12 d-flex justify-content-end">
                                <button type="button" class="btn-close btn-close text-end" aria-label="Close" id="cerrar-localizacion"></button>
                            </div>
                            <div class="col-12 input-group w-75 mx-auto mb-5 mt-4">
                                <input type="text" class="form-control" id="buscar-ubicacion" placeholder="Buscar ubicación" aria-label="Buscar ubicación" aria-describedby="button-addon2">
                                <button class="btn btn-gris" type="button" id="btnBuscar">Buscar</button>
                            </div>
                            <div class="col-12 w-75 mx-auto mt-4" id="ciudades"></div>
                        </div>
                    </div>
                    <div id="lateral-info" class="pt-2 pe-0">
                        <div class="row mt-4 d-flex justify-content-between wrap mx-3">
                            <div class="col-6">
                                <button class="btn btn-gris shadow-sm p-2 px-3 ms-3 ms-md-2" id="localizacion">Localización</button>
                            </div>
                            <div class="col-3 d-flex d-sm-block d-md-flex justify-content-end">
                                <button class="btn btn-gris shadow-sm circulo" id="ubicacion-actual" title="Mi ubicación"><span class="material-icons fs-5">my_location</span></button>
                            </div>
                        </div>
                        <div class="row mt-4 ancho-fclaro">
                                <div class="col-12 d-flex justify-content-center">
                                    <img src="" alt="tiempo" class="my-3 mx-auto" id="img-tiempo">                    
                                </div>      
                        </div>
                        <div class="row ancho-fclaro">
                            <p class="text-center numeros pe-0"><span class="numeros" id="temphoy"></span><span class="fs-5" id="celsius-far"></span></p>
                        </div>
                        <div class="row ancho-fclaro">
                            <p class="fs-6 text-center texto" id="descripcion-clima"></p>
                        </div>
                        <div class="row ancho-fclaro">
                            <p class="fs-6 text-center texto" id="fecha-hoy"></p>
                            <p class="fs-6 text-center texto" id="ubicacion"></p>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-8 foscuro p-5 pt-3 pb-0">
                    <div class="row  d-flex justify-content-end " id="btn-medida">
                        <div class="col-8"></div>
                        <div class="col-2">
                            <button class="btn btn-gris disabled circulo" id="btn-celsius">ºC</button>
                        </div>
                        <div class="col-2">
                            <button class="btn btn-gris circulo" id="btn-far">
                                <span>ºF</span>
                            </button>
                        </div>
                    </div>
                    <div class="row d-flex justify-content-between mt-3 caja-semana texto" id="contenedor-cajas">
                        
                    </div>
                    <h3 class="mt-4 d-flex texto">Today's Hightlights</h3>
                    <div class="row mt-3 mb-4 texto justify-content-between d-flex" id="highlights">

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
    let sistVelViento = document.querySelector('#sist-vel');
    let velViento = document.querySelector('#vel-viento');
    const highlights = document.querySelector('#highlights');
    const vientoHtml = `
        <p class="mt-1 mb-1">
            Dirección y velocidad del viento
        </p>
        <p class="mb-1">
            <span class="fs-1" id="vel-viento">${await tiempoHoy.obtenerVelViento(objetoClima)}</span><span id="sist-vel">km/h</span>
        </p>
        <p class="fs-4 mb-1">
            ${await tiempoHoy.obtenerDirViento(objetoClima)};
        </p>
    `;
    const divViento = document.createElement('div');
    divViento.classList = 'col-12 col-sm-5 p-1 flex-fill text-center cajas highligths';
    divViento.innerHTML = vientoHtml;
    highlights.appendChild(divViento);

    if(paramSistema==='metric'){
        sistVelViento = document.querySelector('#sist-vel');
        sistVelViento.innerHTML = 'km/h';  
    }else if(paramSistema==='imperial'){
        sistVelViento = document.querySelector('#sist-vel');
        velViento = document.querySelector('#vel-viento');
        sistVelViento.innerHTML = 'millas/h';
        velViento.innerHTML = (velViento.innerHTML/3.6).toFixed(1);
    }

    // Insertar humedad
    const humedadHtml = `
        <p class="pt-1 pt-md-2 mb-1">
            Humedad
        </p>
        <p mb-1>
            <span class="fs-1">${await tiempoHoy.obtenerHumedad(objetoClima)}</span>%
        </p>
    `;
    const divHumedad = document.createElement('div');
    divHumedad.classList = 'col-12 col-sm-5 p-1 flex-fill text-center cajas pt-3 highligths';
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
    divVisibilidad.classList = 'col-12 col-sm-5 p-2 pt-3 flex-fill text-center cajas highligths';
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
    divPresion.classList = 'col-12 col-sm-5 p-2 pt-3 flex-fill text-center cajas highligths';
    divPresion.innerHTML = presionHtml;
    highlights.appendChild(divPresion);
    // ****************

    //Eventos;
    eventoLocalizacion();
    eventoLocalizacionActual();
    cambioSistema();    
    agregarLSAHistorial();
    eventoCambiarLocalizacion();      
    
}


export{
    eventoLocalizacion,
    cambioSistema,
    eventoCambiarLocalizacion,
    init
}