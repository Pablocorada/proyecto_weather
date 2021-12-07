
import './styles.css';
import * as tiempoHoy from './js/tiempoHoy';
import * as tiempoCuatroDias from './js/tiempoCuatroDias'
import {coordenadasActual} from './js/coordenadas'


coordenadasActual().then(data => {
    tiempoCuatroDias.obtenerClimaCoordenadas(data).then(clima => {
        tiempoCuatroDias.obtenerClimaDia(clima,0).then(climaDia => {
            tiempoCuatroDias.obtenerFecha(climaDia.dt).then(console.log);
        });
    });
}); 


/* console.log(latitud);
console.log(longitud); */

/* Utilidades.obtenerClima(latitud,longitud).then(console.log); */