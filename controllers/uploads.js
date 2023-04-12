const { request, response } = require("express");
const { subirArchivo } = require("../helpers/subir-archivo");
const Producto = require("../models/producto");
const Usuario = require("../models/usuario");
const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

//cargar archivo en el servidor local
const cargarArchivo = async (req = request, res = response) => {
    if (
        !req.files ||
        Object.keys(req.files).length === 0 ||
        !req.files.archivo
    ) {
        return res.status(400).json({
            msg: "No hay archivos en la peticion",
        });
    }

    try {
        const nombreArchivo = await subirArchivo(req.files);
        return res.json({
            msg: "Archivo subido correctamente",
            nombre_archivo: nombreArchivo,
        });
    } catch (error) {
        return res.status(400).json({
            msg: "error al subir el archivo",
            error,
        });
    }
};

//actualizar imagen usando cloudinary
const actualizarImagenCloudinary = async (req = request, res = response) => {
    const { coleccion, id } = req.params;

    if (
        !req.files ||
        Object.keys(req.files).length === 0 ||
        !req.files.archivo
    ) {
        return res.status(400).json({
            msg: "No hay archivos en la peticion",
        });
    }

    let modelo;
    //validamos la informacion enviada en los params
    switch (coleccion) {
        case "usuarios":
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: "El usuario no existe en la DB",
                });
            }
            break;
        case "productos":
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: "El producto no existe en la DB",
                });
            }
            break;

        default:
            return res.status(500).json({
                msg: "la coleccion enviada no esta incluida en el controlador",
            });
    }

    try {
        // Limpiar imagenes previas en cloudinary
        if (modelo.img) {
            const nombreArr = modelo.img.split("/");
            const image_id = nombreArr[nombreArr.length - 1].split(".")[0];
            await cloudinary.uploader.destroy(image_id);
        }

        //subimos a cloudinary el archivo enviado
        const { tempFilePath } = req.files.archivo;
        const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
        //lo guardamos dentro del documento indicado por el ID
        modelo.img = secure_url;
        await modelo.save();
        return res.json({
            msg: "Archivo subido correctamente",
            modelo,
        });
    } catch (error) {
        return res.status(400).json({
            msg: "error al subir el archivo",
            error,
        });
    }
};

//actualizar imagen en servidor local
const actualizarImagen = async (req = request, res = response) => {
    const { coleccion, id } = req.params;

    if (
        !req.files ||
        Object.keys(req.files).length === 0 ||
        !req.files.archivo
    ) {
        return res.status(400).json({
            msg: "No hay archivos en la peticion",
        });
    }

    let modelo;
    //validamos la informacion enviada en los params
    switch (coleccion) {
        case "usuarios":
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: "El usuario no existe en la DB",
                });
            }
            break;
        case "productos":
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: "El producto no existe en la DB",
                });
            }
            break;

        default:
            return res.status(500).json({
                msg: "la coleccion enviada no esta incluida en el controlador",
            });
    }

    try {
        // Limpiar imagenes previas
        if (modelo.img) {
            const pathImagen = path.join(
                __dirname,
                "../uploads",
                coleccion,
                modelo.img
            );
            if (fs.existsSync(pathImagen)) {
                fs.unlinkSync(pathImagen);
            }
        }

        //subimos el archivo enviado
        const nombreArchivo = await subirArchivo(
            req.files,
            undefined,
            coleccion
        );
        //lo guardamos dentro del documento indicado por el ID
        modelo.img = nombreArchivo;
        await modelo.save();
        return res.json({
            msg: "Archivo subido correctamente",
            modelo,
        });
    } catch (error) {
        return res.status(400).json({
            msg: "error al subir el archivo",
            error,
        });
    }
};

//mostrar la imagen del servidor local
const mostrarImagen = async (req = request, res = response) => {
    const { coleccion, id } = req.params;

    let modelo;

    //validamos la informacion enviada en los params
    switch (coleccion) {
        case "usuarios":
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: "El usuario no existe en la DB",
                });
            }
            break;
        case "productos":
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: "El producto no existe en la DB",
                });
            }
            break;

        default:
            return res.status(500).json({
                msg: "la coleccion enviada no esta incluida en el controlador",
            });
    }

    try {
        // Limpiar imagenes previas
        if (modelo.img) {
            const pathImagen = path.join(
                __dirname,
                "../uploads",
                coleccion,
                modelo.img
            );
            if (fs.existsSync(pathImagen)) {
                return res.sendFile(pathImagen);
            }
        }

        const pathPlaceholder = path.join(__dirname, "../assets/no-image.jpg");

        return res.sendFile(pathPlaceholder);
    } catch (error) {
        return res.status(400).json({
            msg: "error al subir el archivo",
            error,
        });
    }
};

module.exports = {
    cargarArchivo,
    actualizarImagen,
    actualizarImagenCloudinary,
    mostrarImagen,
};
