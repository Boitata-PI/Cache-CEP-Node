import express from 'express';


class UsuarioRota {
    constructor(database) {
        this.router = express.Router();
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.post('/getCep', (req, res) => {
            res.json({cep: '12345678', rua: 'Rua do CEP', bairro: 'Bairro do CEP', cidade: 'Cidade do CEP', estado: 'Estado do CEP'});
        });
    }
}


export default UsuarioRota;