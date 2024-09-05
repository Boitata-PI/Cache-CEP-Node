import MysqlClienteModel from '../models/cliente/mysqlClienteModel.js';
import MongoClienteModel from '../models/cliente/mongoClienteModel.js';

class ClienteController {
  constructor(database) {
      this.db = database.getConnection();
      this.connectionTime = Date.now();
      this.ClienteModel = this.createClienteModel(database);
  }

  createClienteModel(database) {
      switch (database.constructor.name) {
          case 'MysqlDatabase':
              return new MysqlClienteModel(database.getConnection());
          case 'MongoDatabase':
               return new MongoClienteModel(database.getConnection());
          default:
              throw new Error("Unsupported database type");
      }
  }

  async create(req, res) {
    try {
      return res.render("client/create", {title: "Cadastro"});
    } catch (error) {
      return res.status(500).json({ status: false, message: `Erro ao abrir tela de Cadastro de Clientes: ${error.message}` });
    }
  }

  async store(req, res) {
    const { idvotante, candidatoId, region } = req.body;

    if (!idvotante || !candidatoId || !region) {
      return res.status(400).json({ message: "Dados incompletos" });
    }

    try {
      const votanteJaClienteu = await this.ClienteModel.verificarCliente(idvotante);
      
      if (votanteJaClienteu.Clienteu) {
        return res.status(409).json({ status: false, message: "Você já registrou um Cliente." });
      }

      const result = await this.ClienteModel.inserirCliente(idvotante, candidatoId, region);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ status: false, message: `Erro ao registrar Cliente: ${error.message}` });
    }
  }

  async list(req, res) {
    try {
      //const result = await this.ClienteModel.list();
      return res.render("client/list", {title: "Clientes"});
    } catch (error) {
      return res.status(500).json({ status: false, message: `Erro ao obter quantidade de Clientes: ${error.message}` });
    }
  }
}


export default ClienteController;