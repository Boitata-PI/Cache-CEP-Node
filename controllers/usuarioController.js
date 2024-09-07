import MysqlUsuarioModel from '../models/usuario/mysqlUsuarioModel.js';
import MongoUsuarioModel from '../models/usuario/mongoUsuarioModel.js';
import FirebaseUsuarioModel from '../models/usuario/firebaseUsuarioModel.js';

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
          case 'FirebaseDatabase':
              return new FirebaseUsuarioModel(database);
          default:
              throw new Error("Unsupported database type");
      }
  }

  async register(req, res) {
    try {
      return res.render("user/register", {
        title: "Registro",
        layout: "loginlayout",
      });
    }
    catch (error) {
      return res.status(500).json({ status: false, message: `Erro ao abrir tela de Cadastro de Usuarios: ${error.message}` });
    }
  }

  async store(req, res) {
    const { username, email, password, password2 } = req.body;

    if (!username || !email || !password || !password2) {
      return res.status(400).json({ message: "Dados incompletos" });
    }

    if (password !== password2) {
      return res.status(400).json({ message: "Senhas não conferem" });
    }

    try {
      this.UsuarioModel.register(email, password)
        .then((userCredential) => {
          const user = userCredential.user;

          res.redirect("/index.php/user/login");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(error);
          return res.status(500).json({ status: false, message: `Erro ao registrar Usuario: ${errorMessage}` });
        });
    } catch (error) {
      return res.status(500).json({ status: false, message: `Erro ao registrar Usuario: ${error.message}` });
    }
  }

  async login(req, res) {
    try{
      return res.render("user/login", {
        title: "Login",
        layout: "loginlayout",
      });
    }
    catch (error) {
      return res.status(500).json({ status: false, message: `Erro ao abrir tela de Login de Usuarios: ${error.message}` });
    }
  }

  async storeLogin(req, res) {
    const { email, password } = req.body;

    try {
      this.UsuarioModel.login(email, password)
        .then((data) => {
          res.json(data)
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(error);
        });
    } catch (error) {
      res.redirect("/index.php/user/login");
    }
  }

  async logout(req, res) {
    try{
      this.UsuarioModel.logout()
      .then(() => {
        res.redirect("/index.php/user/login");
      })
    }
    catch(error){
      return res.status(500).json({ status: false, message: `Erro ao deslogar: ${error.message}` });
    }
  }

  home(req, res){
    return res.redirect("/index.php/clients/home")
  }
}


export default UsuarioController;