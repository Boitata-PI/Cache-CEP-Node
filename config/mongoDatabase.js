import { MongoClient } from 'mongodb';

class MongoDatabase {
    constructor(config) {
        this.uri = this.buildMongoURI(config);
        this.client = new MongoClient(this.uri);
        this.db = null;
        this.connectionTime = 0;
    }

    buildMongoURI(config) {
        if (config.DB_USER && config.DB_PASS) {
            return `mongodb://${config.DB_USER}:${config.DB_PASS}@${config.DB_HOST}:${config.DB_PORT}/${config.DB_NAME}?authSource=admin`;
        } else {
            return `mongodb://${config.DB_HOST}:${config.DB_PORT}/${config.DB_NAME}`;
        }
    }

    async connect() {
        const start_time = process.hrtime();

        try {
            await this.client.connect();
            this.db = this.client.db(process.env.DB_NAME);

            const end_time = process.hrtime(start_time);
            this.connectionTime = (end_time[0] * 1e9 + end_time[1]) / 1e6;

            console.log(`Conectado ao MongoDB em ${this.connectionTime}ms`);
        } catch (error) {
            console.error('Erro ao conectar ao MongoDB:', error);
            throw error;
        }
    }

    getConnection() {
        return this.db;
    }

    getConnectionTime() {
        return this.connectionTime;
    }

    close() {
        return this.client.close();
    }
}


export default MongoDatabase;