import express from 'express';
import ClienteController from '../controllers/clienteController.js';

class ClienteRota {
    constructor(database) {
        this.router = express.Router();
        this.controller = new ClienteController(database);
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.post('/store', (req, res) => this.controller.store(req, res));
        this.router.get('/delete/:id', (req, res) => this.controller.delete(req, res));
        this.router.get('/editar/:id', (req, res) => this.controller.edit(req, res));
        this.router.post('/update', (req, res) => this.controller.update(req, res));
        this.router.get('/home', (req, res) => this.controller.list(req, res));
    }
}


export default ClienteRota;