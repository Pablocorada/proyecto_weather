export let coordenadasActual = async() => {
    
    const coor = {};
    let promesaLocActual = new Promise((resolve) => {
        if (navigator.geolocation) { //comprobamos que el navegador sea compatible
            navigator.geolocation.getCurrentPosition((posicion) => {
    
                const coor = {lat:posicion.coords.latitude,lon:posicion.coords.longitude};
                resolve(coor);
            });   
        }
        
    })
    
    return await promesaLocActual;
};