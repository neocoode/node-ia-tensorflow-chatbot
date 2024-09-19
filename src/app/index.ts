import connectLivereload from 'connect-livereload';
import express, { Application } from 'express';
import livereload from 'livereload';
import path from 'path';

import connectToDatabase from '@db/connection'; // Conexão com MongoDB
import { initializeTrainingData } from '@db/md/trainingData';
import chatRoutes from '@routes/chatStream';
import trainRoutes from '@routes/train';

const app: Application = express();

// Criar servidor livereload
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, '../public')); // Monitora mudanças na pasta public

// Usar connect-livereload para injetar o script no HTML
app.use(connectLivereload());

// Configurar EJS como o motor de templates
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Configurar diretório público para arquivos estáticos (CSS, JS)
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
// Conectar ao banco de dados
connectToDatabase();
initializeTrainingData();

// Rotas para o chat e treinamento
app.use('/api/chat', chatRoutes);
app.use('/api/train', trainRoutes);
app.use('/chat/static', express.static(path.join(__dirname, '../views/chat')));

// Rota inicial que renderiza a página Home (Chat)
app.get('/', (req, res) => {
  res.render('chat/index');
});

app.get('/train', (req, res) => {
  res.render('train');
});

// Usar connect-livereload para injetar o script no HTML
app.use(connectLivereload());

// Definir a porta da aplicação
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Forçar reload quando arquivos forem alterados
liveReloadServer.server.once('connection', () => {
  setTimeout(() => {
    liveReloadServer.refresh('/');
  }, 100);
});
