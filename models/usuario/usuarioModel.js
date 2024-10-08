class Usuario {
  constructor(db, connectionTime) {
    this.db = db;
    this.connectionTime = connectionTime;
  }

  async inserirUsuario(nome, idade, sexo, cep, logradouro, bairro, cidade, estado) {
    try {
      const start_time = process.hrtime();

      await this.db.run(
        `INSERT INTO Usuarios (nome, idade, sexo, cep, logradouro, bairro, cidade, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [nome, idade, sexo, cep, logradouro, bairro, cidade, estado]
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

  async listarUsuarios() {
    const start_time = process.hrtime();
    const result = await this.db.all(`SELECT * FROM Usuarios;`);
    const end_time = process.hrtime(start_time);
    const queryTime = (end_time[0] * 1e9 + end_time[1]) / 1e6;

    return {
      status: true,
      data: result,
      connection_time: this.connectionTime,
      query_time: queryTime
    };
  }
}
  

export default Usuario;