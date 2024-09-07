import MysqlClienteModel from '../models/cliente/mysqlClienteModel.js';
import MongoClienteModel from '../models/cliente/mongoClienteModel.js';
import FirebaseClienteModel from '../models/cliente/firebaseClienteModel.js';

class ClienteController {
  constructor(database) {
      this.db = database;
      this.connectionTime = Date.now();
      this.ClienteModel = this.createClienteModel(database);
  }

  createClienteModel(database) {
      switch (database.constructor.name) {
          case 'MysqlDatabase':
              return new MysqlClienteModel(database.getConnection());
          case 'MongoDatabase':
              return new MongoClienteModel(database.getConnection());
          case 'FirebaseDatabase':
              return new FirebaseClienteModel(database, this.connectionTime);
          default:
              throw new Error("Unsupported database type");
      }
  }

  async store(req, res) {
    const { nome, sexo, idade, cep, logradouro, bairro, cidade, estado } =
      req.body;

    if (!nome || !sexo || !idade || !cep || !logradouro || !bairro || !cidade || !estado) {
      return res.status(400).json({ message: "Dados incompletos" });
    }

    const cliente = {
      nome,
      sexo,
      idade,
      cep,
      logradouro,
      bairro,
      cidade,
      estado
    };

    try {
      const result = await this.ClienteModel.create(cliente)
      .then(function () {
        console.log("Added document");
        res.redirect("/index.php/clients/home");
      });
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ status: false, message: `Erro ao registrar Cliente: ${error.message}` });
    }
  }

  async list(req, res) {
    try {
      const user = await this.db.getAuthState()
      // .then(async (user) => {
        console.log(user);
        if (!user) {
          return res.redirect("/index.php/user/login");
        }else{
          const result = await this.ClienteModel.getAll();
          return res.render("client/home", {title: "Clientes", clientes: result});
        }
      // });
    } catch (error) {
      return res.status(500).json({ status: false, message: `Erro ao obter quantidade de Clientes: ${error.message}` });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await this.ClienteModel.delete(id)
      .then(function () {
        console.log("Deleted document");
        res.redirect("/index.php/clients/home");
      });
      return res.status(200).json(result);
    }
    catch (error) {
      return res.status(500).json({ status: false, message: `Erro ao deletar Cliente: ${error.message}` });
    }
  }

  async edit(req, res) {
    try {
      const { id } = req.params;
      const result = await this.ClienteModel.getById(id);
      console.log(result);
      return res.render("client/editar", {title: "Editar Cliente", cliente: result, id: id, layout: "editarlayout"});
    } catch (error) {
      return res.status(500).json({ status: false, message: `Erro ao obter Cliente: ${error.message}` });
    }
  }

  async update(req, res) {
    try{

      const { nome, sexo, idade, cep, logradouro, bairro, cidade, estado } =
        req.body;
      const { id } = req.body;

      console.log(req.body);

      if (!nome || !sexo || !idade || !cep || !logradouro || !bairro || !cidade || !estado) {
        return res.status(400).json({ message: "Dados incompletos" });
      }

      const cliente = {
        id,
        nome,
        telefone,
        origem,
        data_contato,
        observacao
      };

      const result = await this.ClienteModel.update(id, cliente)
      .then(function () {
        console.log("Updated document");
        res.redirect("/index.php/clients/home");
      });

    }catch(error){
      return res.status(500).json({ status: false, message: `Erro ao atualizar Cliente: ${error.message}` });
    }
  }

}


export default ClienteController;