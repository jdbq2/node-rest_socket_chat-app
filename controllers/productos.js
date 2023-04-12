const { request, response } = require("express");
const Categoria = require("../models/categoria");
const Producto = require("../models/producto");

const obtenerProductos = async (req = request, res = response) => {
    //manejo de query params
    const { desde = 0, limite = 5 } = req.query;

    //hacemos la peticion a la BD con un query de solo productos activas
    const [total_productos_activos, productos] = await Promise.all([
        Producto.countDocuments({ estado: true }),
        Producto.find({ estado: true })
            .populate("usuario", "nombre")
            .populate("categoria", "nombre")
            .limit(Number(limite))
            .skip(Number(desde)),
    ]);

    res.json({
        total_productos_activos,
        productos,
    });
};
const obtenerProductoId = async (req = request, res = response) => {
    const id = req.params.id;
    try {
        const producto = await Producto.findById(id)
            .populate("usuario", "nombre")
            .populate("categoria", "nombre");
        return res.json(producto);
    } catch (error) {
        return res.status(500).json({
            msg: "No se pudo obtener el producto",
            error,
        });
    }
};
const crearProducto = async (req = request, res = response) => {
    const user = req.usuario.id;
    const { estado, usuario, ...body } = req.body;
    body.usuario = user;
    body.nombre = body.nombre.toUpperCase();
    const existeProducto = await Producto.findOne({ nombre: body.nombre });
    if (existeProducto) {
        return res.status(400).json({
            msg: "El producto con este nombre ya existe",
        });
    }
    try {
        const producto = new Producto(body);
        await producto.save();
        return res.json(body);
    } catch (error) {
        res.status(500).json({
            msg: "Error al crear el producto",
            error,
        });
    }
};
const actualizarProducto = async (req = request, res = response) => {
    const id = req.params.id;
    const { estado, ...data } = req.body;
    data.usuario = req.usuario.id;

    try {
        if (data.categoria) {
            const existeCategoria = await Categoria.findById(data.categoria);
            if (!existeCategoria) {
                return res.status(400).json({
                    msg: "Categoria de producto incorrecta",
                });
            }
        }
        const producto = await Producto.findByIdAndUpdate(id, data);
        return res.json(data);
    } catch (error) {
        return res.status(500).json({
            msg: "error al intentar actualizar el producto",
            error,
        });
    }
};
const borrarProducto = async (req = request, res = response) => {
    const id = req.params.id;
    const usuario = req.usuario.id;
    try {
        const producto = await Producto.findByIdAndUpdate(id, {
            estado: false,
            usuario,
        });
        return res.json(producto);
    } catch (error) {
        return res.status(500).json({
            msg: "error al eliminar el usuario",
            error,
        });
    }
};

module.exports = {
    obtenerProductos,
    obtenerProductoId,
    crearProducto,
    actualizarProducto,
    borrarProducto,
};
