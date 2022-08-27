const { Socket } = require("socket.io");
const { comprobarJWT } = require("../helpers/generarJWT");
const ChatMensajes = require("../models/chat-mensajes");

const chatMensajes = new ChatMensajes();

const socketController = async (socket = new Socket(), io) => {
    const token = socket.handshake.headers["x-token"];
    const usuario = await comprobarJWT(token);
    if (!usuario) {
        return socket.disconnect();
    }

    // Agregar Usuario al Chat
    chatMensajes.conectarUsuario(usuario);
    io.emit("usuarios-activos", chatMensajes.usuariosArr);

    //conectarlo a una sala especial
    socket.join(usuario.id);

    //Limpiar cuando alguien se desconecta
    socket.on("disconnect", () => {
        chatMensajes.desconectarUsuario(usuario.uid);
        io.emit("usuarios-activos", chatMensajes.usuariosArr);
    });

    socket.on("enviar-mensaje", ({ uid, mensaje }) => {
        if (uid) {
            socket
                .to(uid)
                .emit("mensaje-privado", { de: usuario.nombre, mensaje });
        } else {
            chatMensajes.enviarMensaje(usuario.uid, usuario.nombre, mensaje);
            io.emit("recibir-mensajes", chatMensajes.ultimos10);
        }
    });
};

module.exports = {
    socketController,
};
