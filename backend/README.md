# Backend Node.js com MongoDB

API REST completa para autenticação de usuários e gerenciamento de ofertas, construída com Node.js, Express e MongoDB.

## 🚀 Funcionalidades

### Autenticação
- ✅ Cadastro de usuários com validação
- ✅ Login com JWT
- ✅ Middleware de autenticação
- ✅ Perfil do usuário
- ✅ Rate limiting para segurança

### Ofertas
- ✅ Criar ofertas
- ✅ Listar ofertas com filtros e paginação
- ✅ Buscar ofertas por categoria, preço, desconto
- ✅ Atualizar e deletar ofertas próprias
- ✅ Sistema de permissões (usuário/admin)
- ✅ Estatísticas para administradores

## 🛠️ Tecnologias

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticação com tokens
- **bcryptjs** - Criptografia de senhas
- **express-validator** - Validação de dados
- **helmet** - Segurança HTTP
- **cors** - Cross-Origin Resource Sharing
- **express-rate-limit** - Rate limiting

## 📦 Instalação

1. **Clone o repositório e navegue até o diretório backend:**
   ```bash
   cd backend
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   ```bash
   cp .env.example .env
   ```
   
   Edite o arquivo `.env` com suas configurações:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/backend_app
   JWT_SECRET=seu_jwt_secret_super_seguro_aqui_mude_em_producao
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

4. **Inicie o MongoDB:**
   ```bash
   # Ubuntu/Debian
   sudo systemctl start mongod
   
   # macOS com Homebrew
   brew services start mongodb-community
   
   # Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

5. **Execute o servidor:**
   ```bash
   # Desenvolvimento (com auto-reload)
   npm run dev
   
   # Produção
   npm start
   ```

## 📚 Endpoints da API

### Base URL
```
http://localhost:5000/api
```

### Health Check
```http
GET /health
```

### Autenticação

#### Cadastrar Usuário
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "MinhaSenh@123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "joao@email.com",
  "password": "MinhaSenh@123"
}
```

#### Obter Perfil
```http
GET /api/auth/profile
Authorization: Bearer seu_jwt_token_aqui
```

#### Atualizar Perfil
```http
PUT /api/auth/profile
Authorization: Bearer seu_jwt_token_aqui
Content-Type: application/json

{
  "name": "João Silva Santos"
}
```

### Ofertas

#### Criar Oferta
```http
POST /api/offers
Authorization: Bearer seu_jwt_token_aqui
Content-Type: application/json

{
  "title": "Smartphone Samsung Galaxy S23",
  "description": "Smartphone top de linha com câmera de 200MP",
  "category": "tecnologia",
  "originalPrice": 2999.99,
  "discountPrice": 2399.99,
  "validUntil": "2024-12-31T23:59:59.000Z",
  "tags": ["smartphone", "samsung", "android"],
  "imageUrl": "https://exemplo.com/imagem.jpg"
}
```

#### Listar Ofertas
```http
GET /api/offers?page=1&limit=10&category=tecnologia&minDiscount=20&maxPrice=3000&search=smartphone
```

#### Obter Oferta por ID
```http
GET /api/offers/65f1234567890abcdef12345
```

#### Minhas Ofertas
```http
GET /api/offers/my/offers?page=1&limit=10
Authorization: Bearer seu_jwt_token_aqui
```

#### Atualizar Oferta
```http
PUT /api/offers/65f1234567890abcdef12345
Authorization: Bearer seu_jwt_token_aqui
Content-Type: application/json

{
  "title": "Smartphone Samsung Galaxy S23 - OFERTA ESPECIAL",
  "discountPrice": 2199.99
}
```

#### Deletar Oferta
```http
DELETE /api/offers/65f1234567890abcdef12345
Authorization: Bearer seu_jwt_token_aqui
```

#### Estatísticas (Admin)
```http
GET /api/offers/admin/stats
Authorization: Bearer jwt_token_de_admin
```

## 🔒 Autenticação

O sistema utiliza JWT (JSON Web Tokens) para autenticação. Após o login, inclua o token no header Authorization:

```
Authorization: Bearer seu_jwt_token_aqui
```

## 📊 Estrutura do Banco de Dados

### Usuários (users)
```javascript
{
  _id: ObjectId,
  name: String,
  email: String, // único
  password: String, // criptografado
  role: String, // 'user' ou 'admin'
  isActive: Boolean,
  createdAt: Date,
  lastLogin: Date
}
```

### Ofertas (offers)
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  category: String, // enum
  originalPrice: Number,
  discountPrice: Number,
  discountPercentage: Number, // calculado automaticamente
  validUntil: Date,
  isActive: Boolean,
  tags: [String],
  imageUrl: String,
  createdBy: ObjectId, // referência ao usuário
  createdAt: Date,
  updatedAt: Date
}
```

## 🛡️ Segurança

- **Helmet**: Headers de segurança HTTP
- **CORS**: Configurado para origens específicas
- **Rate Limiting**: Limite de requisições por IP
- **Validação**: Validação rigorosa de entrada
- **Criptografia**: Senhas criptografadas com bcrypt
- **JWT**: Tokens seguros com expiração

## 🚦 Códigos de Status

- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Dados inválidos
- `401` - Não autorizado
- `403` - Acesso negado
- `404` - Não encontrado
- `429` - Muitas requisições
- `500` - Erro interno do servidor

## 🧪 Testando a API

### Com cURL

1. **Cadastrar usuário:**
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"João Silva","email":"joao@email.com","password":"MinhaSenh@123"}'
   ```

2. **Fazer login:**
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"joao@email.com","password":"MinhaSenh@123"}'
   ```

3. **Criar oferta:**
   ```bash
   curl -X POST http://localhost:5000/api/offers \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer SEU_TOKEN_AQUI" \
     -d '{"title":"Produto Teste","description":"Descrição do produto","category":"tecnologia","originalPrice":100,"discountPrice":80,"validUntil":"2024-12-31T23:59:59.000Z"}'
   ```

### Com Postman/Insomnia

Importe a collection com os endpoints acima ou teste manualmente cada rota.

## 🐳 Docker (Opcional)

Para executar com Docker:

```bash
# Criar imagem
docker build -t backend-node .

# Executar container
docker run -p 5000:5000 --env-file .env backend-node
```

## 📝 Logs

Em desenvolvimento, o servidor exibe logs detalhados das requisições. Em produção, configure um sistema de logs mais robusto.

## 🚀 Deploy

### Variáveis de Ambiente em Produção

Certifique-se de configurar:
- `NODE_ENV=production`
- `MONGODB_URI` com sua string de conexão do MongoDB Atlas
- `JWT_SECRET` com uma chave forte e única
- Configurar CORS para seu domínio

### Recomendações

- Use HTTPS em produção
- Configure um proxy reverso (nginx)
- Use PM2 para gerenciamento de processos
- Configure logs centralizados
- Monitore performance e erros

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC.

---

**Desenvolvido com ❤️ usando Node.js e MongoDB**