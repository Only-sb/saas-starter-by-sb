# Usar imagem oficial do Node.js 18 LTS
FROM node:18-alpine

# Criar diretório da aplicação
WORKDIR /app

# Instalar curl para health checks
RUN apk add --no-cache curl

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar código da aplicação
COPY . .

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs
RUN adduser -S backend -u 1001

# Mudar propriedade dos arquivos
RUN chown -R backend:nodejs /app

# Usar usuário não-root
USER backend

# Expor porta da aplicação
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

# Comando para iniciar a aplicação
CMD ["npm", "start"]