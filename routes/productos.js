const { Router } = require("express");
const { check } = require("express-validator");
const {
    crearProducto,
    obtenerProductos,
    obtenerProductoId,
    actualizarProducto,
    borrarProducto,
} = require("../controllers/productos");
const { existeCategoria, existeProducto } = require("../helpers/db-validators");
const { validarCampos, validarJWT, esAdminRole } = require("../middlewares");

const router = Router();

router.get("/", obtenerProductos);

router.get(
    "/:id",
    [
        check("id", "El id no es valido").isMongoId(),
        check("id").custom(existeProducto),
        validarCampos,
    ],
    obtenerProductoId
);

router.post(
    "/",
    [
        check("nombre", "El nombre del producto es obligatorio"),
        check("categoria", "El id de la categoria no es valido").isMongoId(),
        check("categoria", "El id de la categoria no es valido").custom(
            existeCategoria
        ),
        validarJWT,
        validarCampos,
    ],
    crearProducto
);

router.put(
    "/:id",
    [
        validarJWT,
        check("id", "El id no es valido").isMongoId(),
        check("id").custom(existeProducto),
        validarCampos,
    ],
    actualizarProducto
);

router.delete(
    "/:id",
    [
        validarJWT,
        esAdminRole,
        check("id", "El id no es valido").isMongoId(),
        check("id").custom(existeProducto),
        validarCampos,
    ],
    borrarProducto
);

module.exports = router;
