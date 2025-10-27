# Oferta Killer 🚀

SaaS para geração de ofertas irresistíveis com Inteligência Artificial. Transforme seus produtos digitais em ofertas que convertem mais vendas usando nossa IA especializada em copywriting.

## 📋 Funcionalidades

### ✅ Implementadas
- **Autenticação completa** - Registro, login e gestão de sessões
- **Sistema de planos** - Basic, Pro e Premium com limites mensais
- **Dashboard intuitivo** - Visão geral da conta e estatísticas
- **Arquitetura escalável** - Backend modular e frontend responsivo
- **Segurança robusta** - JWT, rate limiting, validações

### 🚧 Em Desenvolvimento
- **Geração de ofertas com IA** - Integração completa com GPT-4
- **Editor de ofertas** - Personalização e refinamento
- **Histórico completo** - Gestão e organização de ofertas
- **Sistema de pagamentos** - Integração com Stripe
- **Analytics avançado** - Métricas de performance

## 🛠 Tecnologias

### Backend
- **Node.js** + Express.js
- **MongoDB** com Mongoose
- **JWT** para autenticação
- **Bcrypt** para hash de senhas
- **Express Validator** para validações
- **Helmet** + CORS para segurança
- **Rate Limiting** para proteção

### Frontend
- **React 18** com Hooks
- **Vite** para build e dev server
- **Tailwind CSS** para estilização
- **React Router** para navegação
- **React Hook Form** para formulários
- **React Query** para cache de dados
- **Axios** para requisições HTTP
- **React Hot Toast** para notificações

### DevOps
- **Docker** + Docker Compose
- **Nginx** como reverse proxy
- **MongoDB** como banco de dados
- **Health checks** e monitoring

## 📁 Estrutura do Projeto

```
oferta-killer/
├── backend/                    # API Node.js
│   ├── controllers/           # Controladores das rotas
│   ├── middleware/           # Middlewares personalizados
│   ├── models/              # Modelos do MongoDB
│   ├── routes/              # Definição das rotas
│   ├── services/            # Serviços (IA, pagamentos, etc)
│   ├── server.js            # Servidor principal
│   └── package.json         # Dependências do backend
├── frontend/                   # Aplicação React
│   ├── src/
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── contexts/        # Context API (Auth, etc)
│   │   ├── pages/           # Páginas da aplicação
│   │   ├── services/        # Serviços de API
│   │   └── App.jsx          # Componente principal
│   └── package.json         # Dependências do frontend
├── docker-compose.yml          # Orquestração dos containers
├── package.json               # Scripts de desenvolvimento
└── README.md                  # Esta documentação
```

## 🚀 Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- MongoDB (local ou Atlas)
- Git

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd oferta-killer
```

### 2. Instalação das dependências
```bash
# Instalar dependências de todos os projetos
npm run install:all

# Ou instalar individualmente
cd backend && npm install
cd ../frontend && npm install
```

### 3. Configuração do ambiente

#### Backend (.env)
```bash
# Copiar arquivo de exemplo
cp backend/.env.example backend/.env
```

Edite o arquivo `.env` no backend com suas configurações:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/oferta-killer

# JWT
JWT_SECRET=sua_chave_jwt_muito_segura_aqui
JWT_EXPIRE=7d

# Server
PORT=5000
NODE_ENV=development

# OpenAI API (para geração de ofertas)
OPENAI_API_KEY=sua_chave_openai_aqui

# Stripe (para pagamentos)
STRIPE_SECRET_KEY=sua_chave_stripe_secreta
STRIPE_PUBLISHABLE_KEY=sua_chave_stripe_publica
STRIPE_WEBHOOK_SECRET=seu_webhook_secret_stripe

# Frontend URL (para CORS)
FRONTEND_URL=http://localhost:3000
```

#### Frontend (.env)
Crie um arquivo `.env` no frontend:
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Executar a aplicação

#### Desenvolvimento
```bash
# Executar backend e frontend simultaneamente
npm run dev

# Ou executar separadamente
npm run dev:backend   # Backend na porta 5000
npm run dev:frontend  # Frontend na porta 3000
```

#### Produção com Docker
```bash
# Build e execução com Docker Compose
npm run docker:up

# Parar containers
npm run docker:down
```

## 📚 API Endpoints

### Autenticação
```
POST /api/auth/register     # Registro de usuário
POST /api/auth/login        # Login
GET  /api/auth/me          # Dados do usuário atual
GET  /api/auth/status      # Status da conta
PUT  /api/auth/profile     # Atualizar perfil
PUT  /api/auth/password    # Alterar senha
```

### Ofertas
```
GET    /api/offers         # Listar ofertas do usuário
POST   /api/offers         # Criar nova oferta
GET    /api/offers/:id     # Obter oferta específica
PUT    /api/offers/:id     # Atualizar oferta
DELETE /api/offers/:id     # Deletar oferta
POST   /api/offers/:id/regenerate  # Regenerar oferta
POST   /api/offers/:id/copy        # Copiar oferta
POST   /api/offers/:id/favorite    # Favoritar/desfavoritar
GET    /api/offers/stats           # Estatísticas
```

## 🔧 Scripts Disponíveis

### Raiz do projeto
```bash
npm run dev              # Executar backend e frontend
npm run install:all      # Instalar todas as dependências
npm run build           # Build de produção
npm run docker:build    # Build das imagens Docker
npm run docker:up       # Executar com Docker
npm run docker:down     # Parar containers Docker
```

### Backend
```bash
npm start               # Produção
npm run dev            # Desenvolvimento com nodemon
npm test               # Executar testes
```

### Frontend  
```bash
npm run dev            # Servidor de desenvolvimento
npm run build          # Build para produção
npm run preview        # Preview do build
npm run lint           # Verificar código
```

## 🎨 Sistema de Planos

| Recurso | Basic | Pro | Premium |
|---------|--------|-----|---------|
| Ofertas/mês | 10 | 50 | 200 |
| Regeneração ilimitada | ✅ | ✅ | ✅ |
| Histórico completo | ✅ | ✅ | ✅ |
| Suporte | Email | Email + Chat | Prioritário |
| Analytics | Básico | Avançado | Completo |

## 🔐 Segurança

- **Autenticação JWT** com tokens seguros
- **Hash de senhas** com bcrypt (salt 12)
- **Rate limiting** para prevenir ataques
- **Validação de entrada** em todas as rotas
- **Headers de segurança** com Helmet
- **CORS** configurado adequadamente
- **Sanitização** de dados de entrada

## 📱 Interface

- **Design responsivo** funciona em desktop, tablet e mobile
- **Tema moderno** com Tailwind CSS
- **Componentes reutilizáveis** para consistência
- **Animações suaves** para melhor UX
- **Feedback visual** com toast notifications
- **Loading states** em todas as operações

## 🚀 Deploy

### Desenvolvimento Local
1. Configure as variáveis de ambiente
2. Execute `npm run dev`
3. Acesse http://localhost:3000

### Docker (Recomendado)
1. Configure as variáveis no docker-compose.yml
2. Execute `docker-compose up`
3. Acesse http://localhost

### Produção
1. Use um serviço de hosting (Vercel, Netlify, etc) para o frontend
2. Deploy do backend em serviços como Railway, Render ou AWS
3. Use MongoDB Atlas para o banco de dados
4. Configure domínio personalizado e SSL

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Roadmap

### V1.1 - Geração de Ofertas
- [ ] Integração completa com OpenAI GPT-4
- [ ] Editor de ofertas com preview em tempo real
- [ ] Templates personalizáveis
- [ ] Exportação em múltiplos formatos

### V1.2 - Pagamentos
- [ ] Integração com Stripe
- [ ] Gerenciamento de assinaturas
- [ ] Upgrade/downgrade de planos
- [ ] Histórico de faturas

### V1.3 - Analytics
- [ ] Dashboard de métricas
- [ ] A/B testing de ofertas
- [ ] Relatórios de performance
- [ ] Insights de IA

### V2.0 - Features Avançadas
- [ ] Colaboração em equipe
- [ ] API pública
- [ ] Integrações com CRMs
- [ ] White label

## 📞 Suporte

- **Email**: suporte@ofertakiller.com
- **Documentação**: [docs.ofertakiller.com](https://docs.ofertakiller.com)
- **Discord**: [discord.gg/ofertakiller](https://discord.gg/ofertakiller)

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**Oferta Killer** - Transforme suas ideias em ofertas irresistíveis! 🚀