const { Schema, model } = require("mongoose");

const CategoriaSchema = Schema({
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
});

CategoriaSchema.methods.toJSON = function () {
    const { __v, _id, ...categoria } = this.toObject();
    categoria.id = _id;
    return categoria;
};

module.exports = model("Categoria", CategoriaSchema);
