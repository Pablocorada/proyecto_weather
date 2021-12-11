import { obtenerTempMax, obtenerTempMin } from "./tiempoCuatroDias";
import 'regenerator-runtime/runtime';

//Funcion cambiar imagen: recibe la descripcion del clima
const cambiarImagen = async(objetoClima) => {

    const idImg = await objetoClima.weather[0].icon;
    return `http://openweathermap.org/img/wn/${idImg}@2x.png`;
    
}

//Funcion descripcion clima actual (Lluvia,nieve, etc)
const descripcionClima = (objetoClima) => {

    
    return primeraLetraMayuscula(objetoClima.weather[0].description);
}

//Funcion fecha actual
const obtenerFecha = (fechaUnix) => {

    const dias = [
        'Dom',
        'Lun',
        'Mar',
        'Mie',
        'Jue',
        'Vie',
        'Sab'
    ]
    const meses = [
        'Ene',
        'Feb',
        'Mar',
        'Abr',
        'May',
        'Jun',
        'Jul',
        'Ago',
        'Sep',
        'Oct',
        'Nov',
        'Dic'
    ];

    let fecha = new Date(fechaUnix);
    const hoy = new Date();

    if(fecha==hoy){
        fecha = `Hoy - ${dias[fecha.getDay()]}. ${fecha.getDate()} ${meses[fecha.getMonth()]}`;
    }else{
        fecha = `${dias[fecha.getDay()]}. ${fecha.getDate()} ${meses[fecha.getMonth()]}`;
    }

    return fecha;
}

//Funcion ubicacion actual
const ubicacionActual = (objetoClima) => {

    const ciudadPais = [primeraLetraMayuscula(objetoClima.name),primeraLetraMayuscula(objetoClima.sys.country)];
    return ciudadPais;
}

//Funcion cajas diarias (fecha,icono y temperatura): Crea las cajas de los proximos 5 dias
const cajasDiarias = async(objetoClima,sistema) => {

    let climaDia = await objetoClima.daily[0];
    let textoFecha = '';
    const hoy = new Date();
    let mañana = new Date(hoy);
    mañana.setDate(mañana.getDate() + 1);
    
    const contenedorCajas = document.querySelector('#contenedor-cajas');

    if(sistema === 'imperial'){
        sistema = 'ºF';
    }else{
        sistema = 'ºC';
    }
    
    for(let i=1;i<6;i++){
        
        climaDia = await objetoClima.daily[i];

        let fechaDia = new Date(climaDia.dt*1000);
        console.log(fechaDia)
        if(fechaDia.getDay() === mañana.getDay()){
            textoFecha = 'Mañana';
        }else{
            textoFecha = obtenerFecha(fechaDia);
        }

        const imgClima = await cambiarImagen(climaDia);

        const tempMax = await obtenerTempMax(climaDia);
        const tempMin = await obtenerTempMin(climaDia);
        const btnCelsius = document.querySelector('#btn-celsius');
        
        const caja = `
            <p class="mb-0 mt-2">${textoFecha}</p>
            <img src="${imgClima}" alt="" class="p-3 p-sm-2 w-100">
            <p class="mb-2 mt-3"><span>${tempMin}${sistema}</span>-<span>${tempMax}${sistema}</span></p>
        `;

        const divCajas = document.createElement('div');
        divCajas.innerHTML = caja;
        divCajas.classList = 'col-5 col-sm-2 mb-5 mb-sm-0 pb-1 cajas';
        contenedorCajas.append(divCajas);
    }    
    
}

const primeraLetraMayuscula = (cadena) => {
    const primerCaracter = cadena.charAt(0).toUpperCase();
    const restoDeLaCadena = cadena.substring(1, cadena.length);
    return primerCaracter.concat(restoDeLaCadena);
  }

export{
    cajasDiarias,
    cambiarImagen,
    obtenerFecha,
    ubicacionActual,
    descripcionClima,
    primeraLetraMayuscula
}
