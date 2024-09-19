import mongoose from 'mongoose';

mongoose.connection.on('error', (err) => {
  console.error('Erro de conexão:', err.message);
});

mongoose.set('debug', false);
mongoose.set('strict', false);

const connectToDatabase = async () => {
  try {
    // Estabelecendo conexão com o MongoDB sem as opções obsoletas
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/neochat');
    console.log('Conectado ao MongoDB com sucesso');
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
    process.exit(1); // Encerra o processo se a conexão falhar
  }
};

export default connectToDatabase;
