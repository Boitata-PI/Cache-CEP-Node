import express from 'express';
import ClienteController from '../controllers/clienteController.js';

class ClienteRota {
    constructor(database) {
        this.router = express.Router();
        this.controller = new ClienteController(database);
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.get('/create', (req, res) => this.controller.create(req, res));
        this.router.post('/store', (req, res) => this.controller.store(req, res));
        this.router.get('/list', (req, res) => this.controller.list(req, res));
    }
}


export default ClienteRota;