import express from 'express';
import axios from 'axios';
import NodeCache from 'node-cache';
const myCache = new NodeCache();


class APIRota {
    constructor() {
        this.router = express.Router();
        this.setupRoutes();
    }

    async setupRoutes() {
        this.router.get('/getCep', async(req, res) => {
            try{
                var data = await this.getCEP(req.params.cep);
        
                return res.json({data: data, success: 1});
            }
            catch(e){
                console.error('Erro:', e);
                return res.json({data: "Erro Inesperado: " + e, success: 0});
            }
        });
    }

    async makeGet(cep) {
        try {
            const url = "https://viacep.com.br/ws/"+cep+"/json/";
            const response = await axios.get(url);
    
            myCache.set(cep, response.data, 10000);
    
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    
    
    
    async getCEP(cep){
        return new Promise((resolve, reject) => {
            if(myCache.has(cep)){
                var data = myCache.get(cep);
                data.tipo = "cache";
                resolve(data);
            }
            else{
                this.makeGet(cep)
                .then((response) => {
                    var data = response;
                    data.tipo = "get";
                    resolve(data);
                })
            }
        });
    }
}


export default APIRota;