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

    async getAuthState() {
        // const [rows] = await this.db.execute('SELECT is_logged_in FROM users WHERE id = ?', [userId]);
        // if (rows.length > 0) {
        //     return rows[0].is_logged_in === 1;
        // }
        return true;
    }
}


export default MysqlDatabase;