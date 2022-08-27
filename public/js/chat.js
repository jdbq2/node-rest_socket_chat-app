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
    socket.on("recibir-mensajes", dibujarMensajes);
    socket.on("usuarios-activos", dibujarUsuarios);
    socket.on("mensaje-privado", (payload) => {
        console.log(payload);
    });
};

txtMensaje.addEventListener("keyup", ({ keyCode }) => {
    const mensaje = txtMensaje.value;
    const uid = txtUid.value;
    if (keyCode !== 13) {
        return;
    }
    if (mensaje.length === 0) {
        return;
    }
    socket.emit("enviar-mensaje", { mensaje, uid });
    txtMensaje.value = "";
});

const main = async () => {
    await validarJWT();
};

const dibujarUsuarios = (usuarios = []) => {
    let usersHtml = "";
    usuarios.forEach(({ nombre, uid }) => {
        usersHtml += `
    <li>
        <p>
            <h5  class="text-success">
            ${nombre}
            </h5>
            <span class="fs-6 text-muted">
            ${uid}
            <span>
        </p>
    </li>    
    `;
    });

    ulUsuarios.innerHTML = usersHtml;
};
const dibujarMensajes = (mensajes = []) => {
    let mensajesHtml = "";
    mensajes.forEach(({ nombre, mensaje }) => {
        mensajesHtml += `
    <li>
        <p>
            <h5  class="text-success">
            ${nombre}
            </h5>
            <span class="fs-6 text-muted">
            ${mensaje}
            <span>
        </p>
    </li>    
    `;
    });

    ulMensajes.innerHTML = mensajesHtml;
};

main();
