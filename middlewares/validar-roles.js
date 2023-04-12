const { request, response } = require("express");

const esAdminRole = (req = request, res = response, next) => {
    if (!req.usuario) {
        return res.status(500).json({
            msg: "se quiere verificar el rol sin validar el token primero",
        });
    }
    const { rol } = req.usuario;
    if (rol !== "ADMIN_ROL") {
        return res.status(401).json({
            msg: "El usuario no tiene el rol para hacer este proceso",
        });
    }

    next();
};

const tieneRol = (...roles) => {
    return (req = request, res = response, next) => {
        if (!req.usuario) {
            return res.status(500).json({
                msg: "se quiere verificar el rol sin validar el token primero",
            });
        }
        const { rol } = req.usuario;
        if (!roles.includes(rol)) {
            return res.status(401).json({
                msg: "El usuario no tiene el rol para hacer este proceso",
            });
        }
    };
};

module.exports = { esAdminRole, tieneRol };
