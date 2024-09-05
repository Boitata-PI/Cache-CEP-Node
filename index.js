import 'dotenv/config'; 
import express from 'express';
import handlebars from 'express-handlebars';
import morgan from 'morgan';
import DatabaseFactory from './config/databaseFactory.js';
import ClienteRota from './rotas/clienteRota.js';
import UsuarioRota from './rotas/usuarioRota.js';
import ApiRotas from './rotas/apiRota.js';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
  origin: ['http://127.0.0.1:5500','http://localhost:5500', 'http://localhost:8088', 'http://127.0.0.1:8088', 'http://127.0.0.1:3000'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-KEY', 'X-Requested-With', 'X-Custom-Header'],
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(morgan('combined'));
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static('public'));

//Definindo layout das páginas
app.engine("handlebars", handlebars.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

const database = DatabaseFactory.createDatabase(process.env);

const start_time = process.hrtime();

database.connect().then(() => {
    const end_time = process.hrtime(start_time);
    const connectionTime = (end_time[0] * 1e9 + end_time[1]) / 1e6; 
    console.log(`Conexão ao banco de dados estabelecida em ${connectionTime}ms`);
    const clienteRoutes = new ClienteRota(database);
    const usuarioRoutes = new UsuarioRota(database);
    const apiRoutes = new ApiRotas(database);

    app.get("/", (req, res) => {
        return res.redirect("/index.php/user/login");
    });

    app.use('/index.php/clients', clienteRoutes.router);

    app.use('/index.php/user', usuarioRoutes.router);

    app.use('/index.php/api', apiRoutes.router);

    app.use((req, res) => {
        return res.render("errors/erro", {error: "404", textError: 'Página Inexistente!'});
    });

    app.listen(port, () => {
        console.log(`Servidor rodando na porta ${port}`);
    });
}).catch((err) => {
    console.error('Erro ao conectar ao banco de dados:', err);
});