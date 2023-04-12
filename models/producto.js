const { Schema, model } = require("mongoose");

const ProductoSchema = Schema({
    nombre: {
        type: String,
        required: [true, "el nombre es obligatorio"],
        unique: true,
    },
    estado: {
        type: Boolean,
        default: true,
        required: [true, "el estado de la categoria es obligatorio"],
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: "Usuario",
        required: [true, "el usuario que genera la accion es obligatorio"],
    },
    precio: {
        type: Number,
        default: 0,
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: "Categoria",
        required: [
            true,
            "la categoria a la que pertenece el producto es obligatoria",
        ],
    },
    descripcion: {
        type: String,
    },
    disponible: {
        type: Boolean,
        default: true,
    },
    img: {
        type: String,
    },
});

ProductoSchema.methods.toJSON = function () {
    const { __v, _id, ...producto } = this.toObject();
    producto.id = _id;
    return producto;
};

module.exports = model("Producto", ProductoSchema);
