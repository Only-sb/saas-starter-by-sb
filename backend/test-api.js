// Script de teste da API - Execute com: node test-api.js
// Certifique-se de que o servidor esteja rodando e o MongoDB conectado

const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Configurar axios para não falhar em erros HTTP
axios.defaults.validateStatus = function (status) {
  return status < 500; // Aceitar qualquer status < 500
};

async function testAPI() {
  console.log('🧪 Iniciando testes da API...\n');

  try {
    // 1. Testar Health Check
    console.log('1. 🏥 Testando Health Check...');
    const healthResponse = await axios.get('http://localhost:5000/health');
    console.log('✅ Health Check:', healthResponse.data);
    console.log('');

    // 2. Testar Cadastro
    console.log('2. 👤 Testando Cadastro de Usuário...');
    const registerData = {
      name: 'João Silva',
      email: 'joao@email.com',
      password: 'MinhaSenh@123'
    };

    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, registerData);
    console.log('Status:', registerResponse.status);
    console.log('Resposta:', registerResponse.data);
    console.log('');

    if (registerResponse.status !== 201) {
      console.log('❌ Falha no cadastro. Tentando fazer login...\n');
    }

    // 3. Testar Login
    console.log('3. 🔑 Testando Login...');
    const loginData = {
      email: 'joao@email.com',
      password: 'MinhaSenh@123'
    };

    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, loginData);
    console.log('Status:', loginResponse.status);
    console.log('Resposta:', loginResponse.data);
    
    if (loginResponse.status !== 200) {
      console.log('❌ Falha no login. Parando testes...');
      return;
    }

    const token = loginResponse.data.data.token;
    console.log('✅ Token obtido:', token.substring(0, 20) + '...');
    console.log('');

    // 4. Testar Perfil
    console.log('4. 👨‍💼 Testando busca de perfil...');
    const profileResponse = await axios.get(`${BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Status:', profileResponse.status);
    console.log('Resposta:', profileResponse.data);
    console.log('');

    // 5. Testar Criação de Oferta
    console.log('5. 🏷️ Testando criação de oferta...');
    const offerData = {
      title: 'Smartphone Samsung Galaxy S23',
      description: 'Smartphone top de linha com câmera de 200MP e processador Snapdragon',
      category: 'tecnologia',
      originalPrice: 2999.99,
      discountPrice: 2399.99,
      validUntil: '2024-12-31T23:59:59.000Z',
      tags: ['smartphone', 'samsung', 'android'],
      imageUrl: 'https://exemplo.com/imagem.jpg'
    };

    const createOfferResponse = await axios.post(`${BASE_URL}/offers`, offerData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Status:', createOfferResponse.status);
    console.log('Resposta:', createOfferResponse.data);
    console.log('');

    if (createOfferResponse.status === 201) {
      const offerId = createOfferResponse.data.data.offer._id;
      
      // 6. Testar Listagem de Ofertas
      console.log('6. 📋 Testando listagem de ofertas...');
      const listOffersResponse = await axios.get(`${BASE_URL}/offers?page=1&limit=5`);
      console.log('Status:', listOffersResponse.status);
      console.log('Resposta:', listOffersResponse.data);
      console.log('');

      // 7. Testar Busca de Oferta por ID
      console.log('7. 🔍 Testando busca de oferta por ID...');
      const getOfferResponse = await axios.get(`${BASE_URL}/offers/${offerId}`);
      console.log('Status:', getOfferResponse.status);
      console.log('Resposta:', getOfferResponse.data);
      console.log('');

      // 8. Testar Minhas Ofertas
      console.log('8. 📝 Testando minhas ofertas...');
      const myOffersResponse = await axios.get(`${BASE_URL}/offers/my/offers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Status:', myOffersResponse.status);
      console.log('Resposta:', myOffersResponse.data);
      console.log('');
    }

    console.log('🎉 Testes concluídos com sucesso!');

  } catch (error) {
    console.error('❌ Erro durante os testes:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Dados:', error.response.data);
    }
  }
}

// Verificar se o módulo axios está disponível
try {
  require.resolve('axios');
  testAPI();
} catch (e) {
  console.log('❌ Axios não encontrado. Instale com: npm install axios');
  console.log('Ou use cURL para testar a API manualmente.');
  console.log('\nExemplos de comandos cURL:');
  console.log('');
  console.log('# Health Check');
  console.log('curl http://localhost:5000/health');
  console.log('');
  console.log('# Cadastro');
  console.log('curl -X POST http://localhost:5000/api/auth/register \\');
  console.log('  -H "Content-Type: application/json" \\');
  console.log('  -d \'{"name":"João Silva","email":"joao@email.com","password":"MinhaSenh@123"}\'');
  console.log('');
  console.log('# Login');
  console.log('curl -X POST http://localhost:5000/api/auth/login \\');
  console.log('  -H "Content-Type: application/json" \\');
  console.log('  -d \'{"email":"joao@email.com","password":"MinhaSenh@123"}\'');
}