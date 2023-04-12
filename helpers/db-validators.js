const Categoria = require("../models/categoria");
const Producto = require("../models/producto");
const Role = require("../models/role");
const Usuario = require("../models/usuario");

const isValidRole = async (rol = "") => {
    const existeRol = await Role.findOne({ rol });
    if (!existeRol) {
        throw new Error(
            `El rol: ${rol}, no esta registrado en la base de datos`
        );
    }
};

const emailExists = async (correo = "") => {
    //verificar si correo existe
    const existeEmail = await Usuario.findOne({ correo });
    if (existeEmail) {
        throw new Error(`El email: ${correo}, ya existe`);
    }
};

const userExists = async (_id = "") => {
    //verificar si correo existe
    const existeId = await Usuario.findById(_id);
    if (!existeId) {
        throw new Error(`El id enviado no existe`);
    }
};

const existeCategoria = async (_id = "") => {
    const existeCategoria = await Categoria.findById(_id);
    if (!existeCategoria) {
        throw new Error(`El id de la categoria enviado no existe`);
    }
};
const existeProducto = async (_id = "") => {
    const existeProducto = await Producto.findById(_id);
    if (!existeProducto) {
        throw new Error(`El id del producto enviado no existe`);
    }
};

const coleccionesPermitidas = (coleccion = "", colecciones = []) => {
    const incluida = colecciones.includes(coleccion);
    if (!incluida) {
        throw new Error(
            `La coleccion enviada no esta incluida para este proceso`
        );
    }
    return true;
};
module.exports = {
    isValidRole,
    emailExists,
    userExists,
    existeCategoria,
    existeProducto,
    coleccionesPermitidas,
};
