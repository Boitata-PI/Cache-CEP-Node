class MysqlClienteModel {
  constructor(db, connectionTime) {
    this.db = db;
    this.connectionTime = connectionTime;
  }

  async create(cliente) {
    try {
      const start_time = process.hrtime();

      await this.db.execute(
        `INSERT INTO clientes (nome, sexo, idade, cep, logradouro, bairro, cidade, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          cliente.nome,
          cliente.sexo,
          cliente.idade,
          cliente.cep,
          cliente.logradouro,
          cliente.bairro,
          cliente.cidade,
          cliente.estado,
        ]
      );

      const end_time = process.hrtime(start_time);
      const queryTime = (end_time[0] * 1e9 + end_time[1]) / 1e6;

      return {
        success: true,
        message: "Cliente inserido com sucesso.",
        connection_time: this.connectionTime,
        query_time: queryTime,
      };
    } catch (error) {
      return {
        success: false,
        message: `Erro ao inserir Cliente: ${error.message}`,
        connection_time: this.connectionTime,
      };
    }
  }

  async getAll() {
    const start_time = process.hrtime();
    const [rows, fields] = await this.db.execute(`SELECT * FROM clientes;`);
    const result = rows;
    const end_time = process.hrtime(start_time);
    const queryTime = (end_time[0] * 1e9 + end_time[1]) / 1e6;

    console.log("RESULTADO"+result);

    return result;
  }

  async getById(id) {

    const start_time = process.hrtime();
    const [rows, fields] = await this.db.execute(`SELECT * FROM clientes WHERE id = `+id+`;`);
    const result = rows[0];
    const end_time = process.hrtime(start_time);
    const queryTime = (end_time[0] * 1e9 + end_time[1]) / 1e6;

    return result;

  }

  async update(id, cliente) {

    const start_time = process.hrtime();

    await this.db.execute(
      `UPDATE clientes SET nome = ?, sexo = ?, idade = ?, cep = ?, logradouro = ?, bairro = ?, cidade = ?, estado = ?`,
      [
        cliente.nome,
        cliente.sexo,
        cliente.idade,
        cliente.cep,
        cliente.logradouro,
        cliente.bairro,
        cliente.cidade,
        cliente.estado,
      ]
    );

    const end_time = process.hrtime(start_time);
    const queryTime = (end_time[0] * 1e9 + end_time[1]) / 1e6;

    return {
      success: true,
      message: "Cliente editado com sucesso.",
      connection_time: this.connectionTime,
      query_time: queryTime,
    };

  }

  async delete(id) {

    const start_time = process.hrtime();
      
    await this.db.execute(`DELETE FROM clientes WHERE id = ?`, [id]);

    const end_time = process.hrtime(start_time);
    const queryTime = (end_time[0] * 1e9 + end_time[1]) / 1e6;

    return {
      status: true,
      connection_time: this.connectionTime,
      query_time: queryTime,
    };
  }

  

}
  

export default MysqlClienteModel;