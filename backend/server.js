require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');

// Importar rotas
const authRoutes = require('./routes/auth');
const offerRoutes = require('./routes/offers');

// Conectar ao banco de dados
connectDB();

const app = express();

// Middleware de segurança
app.use(helmet());

// CORS - permitir requisições de diferentes origens
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://seudominio.com'] // Substitua pelo seu domínio em produção
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

// Rate limiting global
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requisições por IP
  message: {
    success: false,
    message: 'Muitas requisições deste IP. Tente novamente em 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(globalLimiter);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware para log de requisições (apenas em desenvolvimento)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
  });
}

// Rota de health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Servidor funcionando corretamente',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: '1.0.0'
  });
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/offers', offerRoutes);

// Rota para endpoints não encontrados
app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Rota ${req.originalUrl} não encontrada`
  });
});

// Middleware global de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);

  // Erro de validação do Mongoose
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      message: 'Erro de validação',
      errors
    });
  }

  // Erro de chave duplicada do MongoDB
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${field} já existe no sistema`
    });
  }

  // Erro de cast do Mongoose (ID inválido)
  if (err.name === 'CastError') {
    return res.status(404).json({
      success: false,
      message: 'Recurso não encontrado'
    });
  }

  // Erro padrão
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Erro interno do servidor'
  });
});

// Tratamento de promessas rejeitadas não capturadas
process.on('unhandledRejection', (err, promise) => {
  console.log('Unhandled Promise Rejection:', err.message);
  // Fechar servidor e sair do processo
  server.close(() => {
    process.exit(1);
  });
});

// Tratamento de exceções não capturadas
process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception:', err.message);
  console.log('Encerrando aplicação...');
  process.exit(1);
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
🚀 Servidor rodando na porta ${PORT}
📊 Ambiente: ${process.env.NODE_ENV}
🌐 Health check: http://localhost:${PORT}/health
📚 API Base URL: http://localhost:${PORT}/api
  `);
});

module.exports = app;