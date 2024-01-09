const poolConexion = require('./DB/Conexion')
const { colors } = require('./helpers')
const { yellowColor, greenColor, redColor, resetColor } = colors
const DeshabilitarTrigger = async()=>{
    try {
        let conexion = poolConexion
        const con = await conexion.connect();
        let sql = `EXEC('use INMODANET; 
        IF OBJECT_ID (''TgHgiNet_tblimagenes'', ''TR'') IS NOT NULL
            BEGIN 
                DROP TRIGGER TgHgiNet_tblimagenes;
                SELECT 1;
            END
        ELSE
            BEGIN
                SELECT 0;
            END')`;
        const rpta = await con.query(sql);
        return rpta;
    } catch (error) {
        console.log("----------------------------ERROR------------------------")
        console.log(error);
        console.log("----------------------------ERROR------------------------")
        return false;
    }
    
}

const Agregar_Imagen = async (referencia, orden, archivo, strDescripcion, conexion) => {
    const fecha = new Date()
    const formattedFecha = fecha.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');
    try {
        const query = `INSERT INTO TblImagenes (
            intEmpresa,
            strTabla,
            strIdCodigo,
            intOrden,
            strDescripcion,
            strArchivo,
            DatFechaAct
        ) VALUES (
            1,
            'TblProductos',
            '${referencia}',
            ${orden},
            '${strDescripcion}',
            '${archivo}',
            '${formattedFecha}'
        )`;
        await conexion.query(query);
        console.log(greenColor + `${referencia} en orden ${orden} agregado correctamente` + resetColor);
    } catch (error) {
        throw error;
    }
}

const Consultar_Existencia = async (referencia, orden, archivo) => {
    let conexion;
    try {
        conexion = poolConexion;
        await conexion.connect();
        const query = `SELECT intOrden FROM tblImagenes WHERE stridCodigo = '${referencia}'`;
        const array_orden_referencia = await conexion.query(query);

        if (array_orden_referencia.recordset.length > 0) {
            let find_orden = array_orden_referencia.recordset.find((item) => item.intOrden == parseInt(orden));
            if (find_orden) {
                try {
                    const update_orden = `UPDATE tblImagenes SET StrArchivo = '${archivo}' WHERE strIdCodigo = '${referencia}' AND IntOrden = ${orden};`;
                    await DeshabilitarTrigger();
                    await conexion.query(update_orden);
                    console.log(greenColor + `${referencia} en orden ${orden} actualizado correctamente` + resetColor);
                } catch (error) {
                    console.error(redColor + error + resetColor)
                }

            } else {
                await DeshabilitarTrigger();
                await Agregar_Imagen(referencia, orden, archivo, orden, conexion);
            }
        } else {
            const query_producto = `SELECT COUNT(*) AS TProducto FROM tblproductos WHERE strIdProducto = '${referencia}'`;
            const producto = await conexion.query(query_producto);
            if (producto.recordset[0].TProducto == 0) {
                console.warn(yellowColor + `La referencia "${referencia}" no existe` + resetColor);
            } else {
                try {
                    await DeshabilitarTrigger();
                    await Agregar_Imagen(referencia, 0, ' ', 'ENCABEZADO', conexion);
                    await Agregar_Imagen(referencia, orden, archivo, orden, conexion);
                } catch (error) {
                    console.log('1')
                    console.error(redColor + error + resetColor)
                }
            }
        }
    } catch (error) {
        throw error;
    } finally {
        if (conexion) {
            conexion.release();
        }
    }
}
const Eliminar_Orden = async (referencia, orden) => {
    let conexion;
    try {
        const query = `DELETE FROM TblImagenes WHERE strIdCodigo = '${referencia}' and IntOrden = ${orden}`
        conexion = poolConexion
        await conexion.connect()
        await DeshabilitarTrigger()
        await conexion.query(query)
        console.log(yellowColor + ` referencia "${referencia}" en orden "${orden}" ha sido eliminada con exito`)
    } catch (error) {
        throw error
    } finally {
        if (conexion) {
            conexion.release();
        }
    }
}

//Agregar_Imagen('ab20029','1','..../ab20029$1.jpg','1')
//Consultar_Existencia('ZUL303', '1', '/PAPELERIA/RECORTAR/BISTURI/ZUL303/ZUL303$1.jpg')

module.exports = {
    Consultar_Existencia,
    Eliminar_Orden
}