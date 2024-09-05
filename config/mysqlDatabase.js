import mysql from 'mysql2/promise';
import DatabaseInterface from './databaseInterface.js';

class MysqlDatabase extends DatabaseInterface {
    constructor(config) {
        super();
        this.config = config;
        this.db = null;
    }

    async connect() {
        this.db = await mysql.createConnection({
            host: this.config.DB_HOST,
            user: this.config.DB_USER,
            password: this.config.DB_PASS,
            database: this.config.DB_NAME
        });
    }

    getConnection() {
        return this.db;
    }
}


export default MysqlDatabase;