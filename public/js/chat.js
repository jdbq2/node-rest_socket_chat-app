let usuario = null;
let socket = null;

const txtUid = document.getElementById("txtUid");
const txtMensaje = document.getElementById("txtMensaje");
const ulUsuarios = document.getElementById("ulUsuarios");
const ulMensajes = document.getElementById("ulMensajes");
const btnSalir = document.getElementById("btnSalir");

const validarJWT = async () => {
    const token = localStorage.getItem("token");
    if (token.length <= 10) {
        window.location = "index.html";
        throw new Error("No hay token en el servidor");
    }

    console.log(token);

    const resp = await fetch("http://localhost:8080/api/auth/", {
        headers: { "x-token": token },
    });

    const { usuario: usuarioDB, token: tokenDB } = await resp.json();
    localStorage.setItem("token", tokenDB);
    usuario = usuarioDB;
    document.title = usuario.nombre;

    await conectarSocket();
};

const conectarSocket = async () => {
    socket = io({
        extraHeaders: {
            "x-token": localStorage.getItem("token"),
        },
    });

    socket.on("connect", () => {
        console.log("Socket Online");
    });
    socket.on("disconnect", () => {
        console.log("Socket Offline");
    });
};

socket.on("recibir-mensajes", () => {});
socket.on("usuarios-activos", () => {});
socket.on("mensaje-privado", () => {});

const main = async () => {
    await validarJWT();
};

main();
