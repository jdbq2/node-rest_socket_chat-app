const express = require("express");
var cors = require("cors");
const http = require("http");
const fileUpload = require("express-fileupload");
const { dbConnection } = require("../database/config");
const io = require("socket.io");
const { socketController } = require("../sockets/socketController");

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.server = http.createServer(this.app);
        this.io = io(this.server);
        this.usuariosPath = "/api/usuarios";
        this.authPath = "/api/auth";
        this.categoriasPath = "/api/categorias";
        this.productosPath = "/api/productos";
        this.buscarPath = "/api/buscar";
        this.uploadsPath = "/api/uploads";

        //Conectar a base de datos
        this.conectarDB();
        //Midlewares
        this.middlewares();
        //rutas
        this.routes();
        //sockets
        this.sockets();
    }

    async conectarDB() {
        await dbConnection();
    }

    routes() {
        this.app.use(this.authPath, require("../routes/auth"));
        this.app.use(this.usuariosPath, require("../routes/usuarios"));
        this.app.use(this.categoriasPath, require("../routes/categorias"));
        this.app.use(this.productosPath, require("../routes/productos"));
        this.app.use(this.buscarPath, require("../routes/buscar"));
        this.app.use(this.uploadsPath, require("../routes/uploads"));
    }
    sockets() {
        this.io.on("connection", (socket) => socketController(socket, this.io));
    }
    listen() {
        this.server.listen(this.port, () => {
            console.log(`Servidor corriendo en el puerto ${this.port}`);
        });
    }
    middlewares() {
        //CORS
        this.app.use(cors());

        //Lectura y parseo del body
        this.app.use(express.json());

        //Carga de archivos
        this.app.use(
            fileUpload({
                useTempFiles: true,
                tempFileDir: "/tmp/",
                createParentPath: true,
            })
        );

        //Directorio Publico
        this.app.use(express.static("public"));
    }
}

module.exports = Server;
