const valCampos = require("./validar-campos");
const valJWT = require("./validar-jwt");
const valRoles = require("./validar-roles");

module.exports = {
    ...valCampos,
    ...valJWT,
    ...valRoles,
};
