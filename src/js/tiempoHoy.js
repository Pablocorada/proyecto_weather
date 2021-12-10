import 'regenerator-runtime/runtime'

const url = `http://api.openweathermap.org/data/2.5/weather?`;
const apiKey = 'bac26ca03139d229749784cf2ecb4276';

//Funcion que entrega el clima de hoy, entregando las coordenadas:
const obtenerClimaCoordenadas = async(coor,sistema='metric') => {

    const latitud = await coor.lat;
    const longitud = await coor.lon;
    const resp = await fetch((`${url}lat=${coor.lat}&lon=${coor.lon}&lang=es&appid=${apiKey}&units=${sistema}`));
    return await resp.json();

    
};

//Funcion que entrega el clima de hoy, entregando el nombre de la ciudad:
const obtenerClimaCiudad = async(ciudad,sistema='metric') => {

    const resp = await fetch((`${url}q=${ciudad}&lang=es&appid=${apiKey}&units=${sistema}`));
    return await resp.json();
    
};

const obtenerCiudad = async(objetoClima) => {

    const ciudadPais = [await objetoClima.name, await objetoClima.sys.country];
    return ciudadPais;
};

const obtenerTempMin = async(objetoClima) => {

    return Math.trunc(await objetoClima.main.temp_min);
};

const obtenerTempMax = async(objetoClima) => {

    return Math.trunc(await objetoClima.main.temp_max);
};

const obtenerTempActual = async(objetoClima) => {

    return Math.trunc(await objetoClima.main.temp);
};

const obtenerPress = async(objetoClima) => {

    return await objetoClima.main.pressure;
};

const obtenerHumedad = async(objetoClima) => {

    return await objetoClima.main.humidity;
};

const obtenerVisibilidad = async(objetoClima) => {

    return await objetoClima.visibility;
};

const obtenerVelViento = async(objetoClima) => {

    const velocidad = `${((await objetoClima.wind.speed)*3.6).toFixed(1)} `;
    return velocidad;
};

const obtenerDirViento = async(objetoClima) => {

    const deg = await objetoClima.wind.deg;
    const direccion = 
    (deg>=337.5 || deg<22.5)? 'N'
    : (deg>=22.5 && deg<67.5) ? 'NE'
    : (deg>=67.5 && deg<112.5) ? 'E'
    : (deg>=112.5 && deg<157.5) ? 'SE'
    : (deg>=157.5 && deg<202.5) ? 'S'
    : (deg>=202.5 && deg<247.5) ? 'SW'
    : (deg>=247.5 && deg<292.5) ? 'W'
    : 'NW';

    return direccion;
};

export{
    obtenerClimaCiudad,
    obtenerClimaCoordenadas,
    obtenerCiudad,
    obtenerTempMin,
    obtenerTempMax,
    obtenerTempActual,
    obtenerPress,
    obtenerHumedad,
    obtenerVisibilidad,
    obtenerVelViento,
    obtenerDirViento
}


