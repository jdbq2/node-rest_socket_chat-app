const { Router } = require("express");
const { check } = require("express-validator");

const {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch,
} = require("../controllers/usuarios");
const {
    isValidRole,
    emailExists,
    userExists,
} = require("../helpers/db-validators");
const { validarCampos, validarJWT, esAdminRole } = require("../middlewares");

const router = Router();

router.get("/", usuariosGet);
router.patch("/", usuariosPatch);
router.put(
    "/:id",
    [
        check("rol").custom(isValidRole),
        check("id").isMongoId(),
        check("id").custom(userExists),
        check("nombre", "El nombre es obligatorio").not().isEmpty(),
        check("password", "El password debe ser de minimo 6 letras").isLength({
            min: 6,
        }),
        validarCampos,
    ],
    usuariosPut
);
router.post(
    "/",
    [
        // check("rol", "No es un rol valido").isIn(["ADMIN_ROLE", "USER_ROLE"]),
        check("rol").custom(isValidRole),
        check("correo", "El correo no es valido").isEmail(),
        check("correo").custom(emailExists),
        check("nombre", "El nombre es obligatorio").not().isEmpty(),
        check("password", "El password debe ser de minimo 6 letras").isLength({
            min: 6,
        }),
        validarCampos,
    ],
    usuariosPost
);
router.delete(
    "/:id",
    [
        validarJWT,
        esAdminRole,
        check("id").isMongoId(),
        check("id").custom(userExists),
        validarCampos,
    ],
    usuariosDelete
);

//62b37c197b0c3b35a802204b

module.exports = router;
