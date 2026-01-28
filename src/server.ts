import 'reflect-metadata';
import express from 'express';
import { AppDataSource } from './database';
import { routes } from './routes';

const app = express();

app.use(express.json());
app.use(routes);

AppDataSource.initialize()
  .then(() => {
    console.log("📦 Banco de Dados Conectado com Sucesso!");
    
    app.listen(process.env.PORT, () => {
      console.log(`🔥 Servidor rodando na porta ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Erro ao conectar no banco:", error);
  });
