const { response, request } = require("express");
const Usuario = require("../models/usuario");
const bcryptjs = require("bcryptjs");
const { generarJWT } = require("../helpers/generarJWT");
const { googleVerify } = require("../helpers/google-verify");

const login = async (req, res = response) => {
    const { correo, password } = req.body;
    //verificamos que el correo existe
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
        return res.status(400).json({
            msg: " Usuario / Password no es correcto",
        });
    }
    //verificamos que el usuario esta activo
    if (!usuario.estado) {
        return res.status(400).json({
            msg: " Usuario / Password no es correcto - estado false",
        });
    }
    //verificamos que la constraseña sea la correcta
    const validPassword = bcryptjs.compareSync(password, usuario.password);
    if (!validPassword) {
        return res.status(400).json({
            msg: " Usuario / Password no es correcto - Password",
        });
    }
    //generamos el JWT
    const token = await generarJWT(usuario.id);
    try {
        res.json({
            msg: "Login Post Ok",
            usuario,
            token,
        });
    } catch (error) {
        res.status(500).json({
            msg: "Algo salio mal, hable con el administrador del sitio",
        });
    }
};

const googleSignIn = async (req = request, res = response) => {
    const { id_token } = req.body;

    try {
        const { nombre, img, correo } = await googleVerify(id_token);
        let usuario = await Usuario.findOne({ correo });
        //si el usuario no existe en nuestra DB lo creamos ya que viene autenticado de google
        if (!usuario) {
            const data = {
                nombre,
                correo,
                password: ":p",
                img,
                google: true,
            };

            usuario = new Usuario(data);
            await usuario.save();
        }
        //si el ususuario existe verificamos que no este Bloqueado
        if (!usuario.estado) {
            return res.status(400).json({
                msg: " Usuario Bloqueado",
            });
        }
        //si pasa las verificaciones generamos el JWT y hacemos el return
        const token = await generarJWT(usuario.id);
        res.json({
            msg: "todo ok - google sign in",
            usuario,
            token,
        });
    } catch (error) {
        res.status(400).json({
            msg: "El token no se pudo verificar",
            error,
        });
    }
};

const renovarToken = async (req = request, res = response) => {
    const { usuario } = req;

    const token = await generarJWT(usuario.id);

    res.json({
        usuario,
        token,
    });
};

module.exports = {
    login,
    googleSignIn,
    renovarToken,
};
