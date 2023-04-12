const jwt = require("jsonwebtoken");
const { request, response } = require("express");
const Usuario = require("../models/usuario");

const validarJWT = async (req = request, res = response, next) => {
    const token = req.header("x-token");
    if (!token) {
        return res.status(401).json({
            msg: "No hay Token en la peticion",
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const usuario = await Usuario.findById(uid);
        if (!usuario) {
            return res.status(401).json({
                msg: "token no valido - usuario no existe en DB",
            });
        }
        if (!usuario.estado) {
            return res.status(401).json({
                msg: "token no valido - usuario con estado false",
            });
        }
        req.usuario = usuario;
        next();
    } catch (error) {
        res.status(401).json({
            msg: "error al validar la autorizacion",
            error,
        });
    }
};

module.exports = { validarJWT };
