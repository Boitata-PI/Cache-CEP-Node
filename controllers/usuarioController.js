import MysqlUsuarioModel from '../models/usuario/mysqlUsuarioModel.js';
import MongoUsuarioModel from '../models/usuario/mongoUsuarioModel.js';

class UsuarioController {
  constructor(database) {
      this.db = database.getConnection();
      this.connectionTime = Date.now();
      this.UsuarioModel = this.createUsuarioModel(database);
  }

  createUsuarioModel(database) {
      switch (database.constructor.name) {
          case 'MysqlDatabase':
              return new MysqlUsuarioModel(database.getConnection());
          case 'MongoDatabase':
               return new MongoUsuarioModel(database.getConnection());
          default:
              throw new Error("Unsupported database type");
      }
  }

  async register(req, res) {
    try {
      return res.render("user/register", {title: "Cadastro"});
    }
    catch (error) {
      return res.status(500).json({ status: false, message: `Erro ao abrir tela de Cadastro de Usuarios: ${error.message}` });
    }
  }

  async store(req, res) {
    const { idvotante, candidatoId, region } = req.body;

    if (!idvotante || !candidatoId || !region) {
      return res.status(400).json({ message: "Dados incompletos" });
    }

    try {
      const votanteJaUsuariou = await this.UsuarioModel.verificarUsuario(idvotante);
      
      if (votanteJaUsuariou.Usuariou) {
        return res.status(409).json({ status: false, message: "Você já registrou um Usuario." });
      }

      const result = await this.UsuarioModel.inserirUsuario(idvotante, candidatoId, region);
      return res.redirect("/index.php/user/login");
    } catch (error) {
      return res.status(500).json({ status: false, message: `Erro ao registrar Usuario: ${error.message}` });
    }
  }

  async login(req, res) {
    try{
      return res.render("user/login", {title: "Login"});
    }
    catch (error) {
      return res.status(500).json({ status: false, message: `Erro ao abrir tela de Login de Usuarios: ${error.message}` });
    }
  }

  async storeLogin(req, res) {
    const { username, password } = req.body;
    const user = await this.UsuarioModel.findOne({ where: { username } });

    if (!user || !await user.validPassword(password)) {
        req.session.error = 'Credenciais Incorretas!';

        return res.redirect("/");
    }

    req.session.user = user.id;

    req.session.success = 'Você entrou na sua conta!';

    return res.redirect("/index.php/clients/create");
  }

  async logout(req, res) {
    try{
      return res.redirect("/user/login");
    }
    catch(error){
      return res.status(500).json({ status: false, message: `Erro ao deslogar: ${error.message}` });
    }
  }
}


export default UsuarioController;