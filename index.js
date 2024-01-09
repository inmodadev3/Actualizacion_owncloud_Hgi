const chokidar = require('chokidar');
const path = require('path');
const { colors } = require('./helpers');
const { Eliminar_Orden, Consultar_Existencia } = require('./models');

const { yellowColor, greenColor, redColor, resetColor }  = colors

// Ruta de la carpeta a vigilar
const carpetaAVigilar = 'C:/Users/venim/OneDrive/Documentos/owncloud/fotos_nube/fotos_nube/FOTOS  POR SECCION CON PRECIO';

// Configuración de chokidar
const opcionesChokidar = {
  ignored: /(^|[\/\\])\../,  // Ignorar archivos ocultos
  persistent: true,
  awaitWriteFinish: true,
  ignoreInitial:true //en caso de querer actualizar todo lo que hay en la carpeta, cambiar el estado a false.
};

//const obtener_rutaHGI = (ruta) =>{return ruta.split('/FOTOS  POR SECCION CON PRECIO')[1]}
const obtener_rutaHGI = (ruta) => { return ruta.split('FOTOS  POR SECCION CON PRECIO')[1]};

const obtener_orden = (archivo) => archivo.split('$')[1].split('.')[0]



// Inicializar el watcher
const watcher = chokidar.watch(carpetaAVigilar, opcionesChokidar);

console.log(resetColor+`Vigilando la carpeta: ${carpetaAVigilar}`);

watcher.on('ready', () => {
    console.log('Chokidar está listo para observar la carpeta.');
});

// Evento cuando un archivo es modificado
watcher.on('change', (rutaArchivo) => {
  const nombreArchivo = path.basename(rutaArchivo);
  const orden = obtener_orden(nombreArchivo)
  const archivo = obtener_rutaHGI(rutaArchivo)

  console.log(yellowColor + `Se ha cambiardo el archivo ${archivo}` + resetColor)
  console.log(yellowColor + `Se le ha asignado el orden ${orden} a la referencia ${nombreArchivo}` + resetColor)
});


// Evento cuando se agrega un nuevo archivo
watcher.on('add', async(rutaArchivo) => {
    const nombreArchivo = path.basename(rutaArchivo);
    const archivo = obtener_rutaHGI(rutaArchivo)
    const orden = obtener_orden(nombreArchivo)
    const referencia = nombreArchivo.split('$')[0]

    if(referencia){
        await Consultar_Existencia(referencia,orden,archivo)
    }

    console.log(greenColor + `Se ha agregado el archivo ${archivo}` + resetColor)
    console.log(greenColor + `Se le ha asignado el orden ${orden} a la referencia ${nombreArchivo}` + resetColor)
});

// Evento cuando se elimina un archivo
watcher.on('unlink', async(rutaArchivo) => {
    const nombreArchivo = path.basename(rutaArchivo);
    const archivo = obtener_rutaHGI(rutaArchivo)
    const orden = obtener_orden(nombreArchivo)
    const referencia = nombreArchivo.split('$')[0]
    if(referencia){
        await Eliminar_Orden(referencia,orden)
    }
    console.log(redColor + `Se ha removido el archivo ${archivo}` + resetColor)
    console.log(redColor + `Se a removido el orden ${orden} a la referencia ${nombreArchivo}` + resetColor)

});

// Manejo de errores
watcher.on('error', (error) => {
  console.error(`Error: ${error}`);
});