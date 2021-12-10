const url = `https://api.openweathermap.org/data/2.5/onecall?`;
const apiKey = 'bac26ca03139d229749784cf2ecb4276';


//Funcion que entrega el clima de los proximos 7 dias, entregando las coordenadas:
const obtenerClimaCoordenadas = async(coor,sistema='metric') => {

    const resp = await fetch((`${url}lat=${coor.lat}&lon=${coor.lon}&appid=${apiKey}&units=${sistema}`));
    return await resp.json();
   
};

//Funcion que entrega el clima de los proximos 7 dias, entregando el nombre de la ciudad:
const obtenerCoordCiudad = async(objetoClima) => {

    const coords = [await objetoClima.coord.lat, await objetoClima.coord.lon];
    return coords;
}

const obtenerClimaCiudad = async(coordCiudad,sistema='metric') => {

    const lat = coordCiudad[0];
    const lon = coordCiudad[1];
    const resp = await fetch((`${url}lat=${lat}&lon=${lon}&appid=${apiKey}&units=${sistema}`));
    return await resp.json();
    
};


const obtenerClimaDia = async(clima,dia) => {
    
    return await clima.daily[dia];
    
}

//Funcion para formatear fecha desde una en formato unix
const obtenerFecha = async dt => {

    return await new Date(dt*1000);

}

const obtenerTempMin = async(objetoClima) => {

    return  Math.trunc(await objetoClima.temp.min);
};

const obtenerTempMax = async(objetoClima) => {

    return  Math.trunc(await objetoClima.temp.max);
};



export{
    obtenerClimaCiudad,
    obtenerClimaCoordenadas,
    obtenerTempMin,
    obtenerTempMax,
    obtenerClimaDia,
    obtenerFecha,
    obtenerCoordCiudad
}


