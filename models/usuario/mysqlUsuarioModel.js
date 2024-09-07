import jwt from 'jsonwebtoken'

class MysqlUsuarioModel {
  constructor(db, connectionTime) {
    this.db = db;
    this.connectionTime = connectionTime;
  }

  async register(email, senha) {
    try {
      const start_time = process.hrtime();

      await this.db.execute(
        `INSERT INTO Usuarios (email, senha) VALUES (?, ?)`,
        [email, senha]
      );

      const end_time = process.hrtime(start_time);
      const queryTime = (end_time[0] * 1e9 + end_time[1]) / 1e6;

      return {
        success: true,
        message: "Usuario inserido com sucesso.",
        connection_time: this.connectionTime,
        query_time: queryTime
      };
    } catch (error) {
      return {
        success: false,
        message: `Erro ao inserir Usuario: ${error.message}`,
        connection_time: this.connectionTime
      };
    }
  }

  async login(email, senha) {
    const start_time = process.hrtime();
    const result = await this.db.execute(`SELECT * FROM Usuarios WHERE email ="`+email+`" AND password = "`+senha+`";`);

    if (result.length === 0) {
      return {
        status: false,
        message: "Usuario não encontrado"
      };
    }
    else{
      const token = jwt.sign({result}, "jwtSecretKey", {expiresIn: 300})

      return {
        status: true,
        data: {Login: true, token, result},
        connection_time: this.connectionTime
      };
    }

      
  }

  async logout() {
    return true;
  }

}
  

export default MysqlUsuarioModel;