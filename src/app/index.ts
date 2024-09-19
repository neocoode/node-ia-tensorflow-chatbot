import connectLivereload from 'connect-livereload';
import express, { Application } from 'express';
import livereload from 'livereload';
import path from 'path';

import chatRoutes from '@routes/chat';
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

// Rotas para o chat e treinamento
app.use('/chat', chatRoutes);
app.use('/train', trainRoutes);

// Rota inicial que renderiza a página Home (Chat)
app.get('/', (req, res) => {
  res.render('index');
});

// Definir a porta da aplicação
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Forçar reload quando arquivos forem alterados
liveReloadServer.server.once('connection', () => {
  setTimeout(() => {
    liveReloadServer.refresh('/');
  }, 100);
});
