const { v4: uuidv4 } = require("uuid");
const path = require("path");

const subirArchivo = (
    files,
    extensionesValidas = ["png", "jpg", "jpeg", "gif"],
    carpeta = ""
) => {
    return new Promise((resolve, reject) => {
        const { archivo } = files;

        //Validamos la extension del archivo
        const nombreCortado = archivo.name.split(".");
        const extension = nombreCortado[nombreCortado.length - 1];
        if (!extensionesValidas.includes(extension)) {
            return reject(`La extension ${extension} no es permitida`);
        }

        //cambiamos el nombre del archivo para evitar errores
        const nombreTemp = uuidv4() + "." + extension;

        //creamos la ruta en la que queremos subir el archivo
        const uploadPath = path.join(
            __dirname,
            "../uploads/",
            carpeta,
            nombreTemp
        );

        //grabamos el archivo en la ruta previamente configurada
        archivo.mv(uploadPath, (err) => {
            if (err) {
                return reject(err);
            }
            return resolve(nombreTemp);
        });
    });
};

module.exports = {
    subirArchivo,
};
