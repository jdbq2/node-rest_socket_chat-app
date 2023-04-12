const { Router } = require("express");
const { check } = require("express-validator");
const {
    cargarArchivo,
    mostrarImagen,
    actualizarImagenCloudinary,
} = require("../controllers/uploads");
const { coleccionesPermitidas } = require("../helpers/db-validators");
const { validarCampos } = require("../middlewares");

const router = Router();

router.post("/", cargarArchivo);

router.put(
    "/:coleccion/:id",
    [
        check("id", "debe ser un ID valido").isMongoId(),
        check("coleccion").custom((c) =>
            coleccionesPermitidas(c, ["usuarios", "productos"])
        ),
        validarCampos,
    ],
    actualizarImagenCloudinary
);

router.get(
    "/:coleccion/:id",
    [
        check("id", "debe ser un ID valido").isMongoId(),
        check("coleccion").custom((c) =>
            coleccionesPermitidas(c, ["usuarios", "productos"])
        ),
        validarCampos,
    ],
    mostrarImagen
);

module.exports = router;
