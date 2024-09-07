import express from 'express';
import UsuarioController from '../controllers/usuarioController.js';


class UsuarioRota {
    constructor(database) {
        this.router = express.Router();
        this.controller = new UsuarioController(database);
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.get('/register', (req, res) => this.controller.register(req, res));
        this.router.post('/register', (req, res) => this.controller.store(req, res));
        this.router.get('/login', (req, res) => this.controller.login(req, res));
        this.router.post('/login', (req, res) => this.controller.storeLogin(req, res));
        this.router.get('/logout', (req, res) => this.controller.logout(req, res));
        this.router.get('/home', (req,res) =>this.controller.home(req, res));
    }
}


export default UsuarioRota;