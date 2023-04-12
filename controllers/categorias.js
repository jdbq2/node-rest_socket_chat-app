const { request, response, json } = require("express");
const Categoria = require("../models/categoria");

const obtenerCategorias = async (req = request, res = response) => {
    //manejo de query params
    const { desde = 0, limite = 5 } = req.query;

    //hacemos la peticion a la BD con un query de solo categorias activas
    const [total_categorias_activas, categorias] = await Promise.all([
        Categoria.countDocuments({ estado: true }),
        Categoria.find({ estado: true })
            .populate("usuario", "nombre")
            .limit(Number(limite))
            .skip(Number(desde)),
    ]);

    res.json({
        total_categorias_activas,
        categorias,
    });
};

const obtenerCategoriaId = async (req = request, res = response) => {
    const id = req.params.id;
    try {
        const categoria = await Categoria.findById(id).populate("usuario", [
            "nombre",
            "rol",
        ]);
        return res.json({
            categoria,
        });
    } catch (error) {
        res.status(500).json({
            msg: "Error durante el proceso de la peticion",
            error,
        });
    }
};

const crearCategoria = async (req = request, res = response) => {
    const nombre = req.body.nombre.toUpperCase();
    const categoriaDB = await Categoria.findOne({ nombre });
    if (categoriaDB) {
        return res.status(400).json({
            msg: "La categoria ya existe en la DB",
        });
    }
    try {
        const data = {
            nombre,
            usuario: req.usuario._id,
        };

        const categoria = new Categoria(data);
        await categoria.save();

        return res.status(201).json({
            msg: "categoria post OK",
            categoria,
        });
    } catch (error) {
        console.log(error);
    }
};

const actualizarCategoria = async (req = request, res = response) => {
    const { id } = req.params;
    const nombre = req.body.nombre.toUpperCase();
    const usuario = req.usuario._id;
    try {
        await Categoria.findByIdAndUpdate(id, { nombre, usuario });
        return res.json({
            nombre,
            usuario,
        });
    } catch (error) {
        return res.status(500).json({
            msg: "Error al actualizar la categoria",
            error,
        });
    }
};

const borrarCategoria = async (req = request, res = response) => {
    //manejo de parametro
    const { id } = req.params;
    const categoria = await Categoria.findByIdAndUpdate(id, { estado: false });

    res.json({
        categoria,
    });
};

module.exports = {
    obtenerCategorias,
    obtenerCategoriaId,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria,
};
