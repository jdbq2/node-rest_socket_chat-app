const express = require("express");
var cors = require("cors");

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = "/api/usuarios";

        //Midlewares
        this.middlewares();
        //rutas
        this.routes();
    }

    routes() {
        this.app.use(this.usuariosPath, require("../routes/usuarios"));
    }
    listen() {
        this.app.listen(this.port);
    }
    middlewares() {
        //CORS
        this.app.use(cors());

        //Lectura y parseo del body
        this.app.use(express.json());

        //Directorio Publico
        this.app.use(express.static("public"));
    }
}

module.exports = Server;
