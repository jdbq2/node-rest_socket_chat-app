const { Socket } = require("socket.io");
const { comprobarJWT } = require("../helpers/generarJWT");

const socketController = async (socket = new Socket()) => {
    const token = socket.handshake.headers["x-token"];
    const usuario = await comprobarJWT(token);
    if (!usuario) {
        return socket.disconnect();
    }
    console.log("cliente conectado: ", usuario.nombre);
};

module.exports = {
    socketController,
};
