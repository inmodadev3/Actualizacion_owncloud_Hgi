const obtener_rutaHGI = (ruta) => { return ruta.split('/FOTOS  POR SECCION CON PRECIO')[1]};

let variable = 'C:/Users/venim/OneDrive/Documentos/owncloud/fotos_nube/fotos_nube/FOTOS  POR SECCION CON PRECIO/PAPELERIA/RECORTAR/BISTURI/AA10248/AA10248$3.jpg'

let recortado = obtener_rutaHGI(variable)
console.log(recortado)

/* const obtener_orden = (archivo) => archivo.split('$')[1].split('.')[0]

let archivo = 'AA10248$150.jpg'
let orden = obtener_orden(archivo)
console.log(orden) */