const { response } = require("express");
const Usuario = require("../models/usuario");
const bcryptjs = require("bcryptjs");

const usuariosGet = async (req, res = response) => {
    //manejo de query params
    const { desde = 0, limite = 5 } = req.query;

    //hacemos la peticion a la BD con un query de solo ususarios activos
    const [total_usuarios_activos, usuarios] = await Promise.all([
        Usuario.countDocuments({ estado: true }),
        Usuario.find({ estado: true })
            .limit(Number(limite))
            .skip(Number(desde)),
    ]);

    res.json({
        msg: "getApi - Controlador",
        total_usuarios_activos,
        usuarios,
    });
};
const usuariosPost = async (req, res = response) => {
    //extraer el contenido del body
    const { nombre, correo, password, rol } = req.body;
    //creamos la instancia del modelo de Mongo
    const usuario = new Usuario({ nombre, correo, password, rol });
    //encriptar la contraseña
    const salt = bcryptjs.genSaltSync(10);
    usuario.password = bcryptjs.hashSync(password, salt);
    //Crear usuario en la base de datos
    await usuario.save();
    //Devolvemos la respuesta del controlador
    res.json({
        msg: "postApi - Controlador",
        usuario,
    });
};
const usuariosPut = async (req, res = response) => {
    //manejo de parametro
    const { id } = req.params;
    const { _id, password, google, correo, ...body } = req.body;

    if (password) {
        //encriptar la contraseña
        const salt = bcryptjs.genSaltSync(10);
        body.password = bcryptjs.hashSync(password, salt);
    }

    await Usuario.findByIdAndUpdate(id, body);

    res.json({
        msg: "putApi - Controlador",
        body,
    });
};
const usuariosDelete = async (req, res = response) => {
    //manejo de parametro
    const { id } = req.params;
    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

    res.json({
        msg: "deleteApi - Controlador",
        usuario,
    });
};

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: "patchApi - Controlador",
    });
};

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete,
};
