const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos, validarJWT, esAdminRole } = require("../middlewares");
const {
    obtenerCategorias,
    obtenerCategoriaId,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria,
} = require("../controllers/categorias");
const { existeCategoria } = require("../helpers/db-validators");

const router = Router();

router.get("/", obtenerCategorias);

router.get(
    "/:id",
    [
        check("id", "No es un ID valido").isMongoId(),
        check("id").custom(existeCategoria),
        validarCampos,
    ],
    obtenerCategoriaId
);

router.post(
    "/",
    [
        check("nombre", "el nombre es obligatorio").not().isEmpty(),
        validarJWT,
        validarCampos,
    ],
    crearCategoria
);

router.put(
    "/:id",
    [
        check("id", "El ID no es valido").isMongoId(),
        check("id").custom(existeCategoria),
        check("nombre", "el nombre es obligatorio").not().isEmpty(),
        validarJWT,
        validarCampos,
    ],
    actualizarCategoria
);

router.delete(
    "/:id",
    [
        check("id").isMongoId(),
        check("id").custom(existeCategoria),
        validarJWT,
        esAdminRole,
        validarCampos,
    ],
    borrarCategoria
);

module.exports = router;
