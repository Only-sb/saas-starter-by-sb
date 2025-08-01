import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

/**
 * Configuração da API centralizada
 * Gerencia tokens, interceptors e tratamento de erros
 */

// Configuração base do Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    
    if (response) {
      const { status, data } = response;
      
      switch (status) {
        case 401:
          // Token inválido ou expirado
          Cookies.remove('token');
          Cookies.remove('user');
          window.location.href = '/login';
          toast.error('Sessão expirada. Faça login novamente.');
          break;
          
        case 403:
          // Acesso negado ou limite atingido
          toast.error(data.message || 'Acesso negado');
          break;
          
        case 429:
          // Rate limit
          toast.error('Muitas tentativas. Aguarde um momento.');
          break;
          
        case 500:
          // Erro interno do servidor
          toast.error('Erro interno do servidor. Tente novamente.');
          break;
          
        default:
          // Outros erros
          if (data.message) {
            toast.error(data.message);
          }
      }
    } else {
      // Erro de rede
      toast.error('Erro de conexão. Verifique sua internet.');
    }
    
    return Promise.reject(error);
  }
);

/**
 * Serviços de Autenticação
 */
export const authService = {
  // Registro de usuário
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  // Login
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  // Obter dados do usuário
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  
  // Atualizar perfil
  updateProfile: async (profileData) => {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  },
  
  // Alterar senha
  changePassword: async (passwordData) => {
    const response = await api.put('/auth/password', passwordData);
    return response.data;
  },
  
  // Status da conta
  getAccountStatus: async () => {
    const response = await api.get('/auth/status');
    return response.data;
  }
};

/**
 * Serviços de Ofertas
 */
export const offerService = {
  // Criar nova oferta
  create: async (offerData) => {
    const response = await api.post('/offers', offerData);
    return response.data;
  },
  
  // Listar ofertas
  getAll: async (params = {}) => {
    const response = await api.get('/offers', { params });
    return response.data;
  },
  
  // Obter oferta específica
  getById: async (id) => {
    const response = await api.get(`/offers/${id}`);
    return response.data;
  },
  
  // Atualizar oferta
  update: async (id, updateData) => {
    const response = await api.put(`/offers/${id}`, updateData);
    return response.data;
  },
  
  // Deletar oferta
  delete: async (id) => {
    const response = await api.delete(`/offers/${id}`);
    return response.data;
  },
  
  // Regenerar oferta
  regenerate: async (id) => {
    const response = await api.post(`/offers/${id}/regenerate`);
    return response.data;
  },
  
  // Copiar oferta
  copy: async (id) => {
    const response = await api.post(`/offers/${id}/copy`);
    return response.data;
  },
  
  // Favoritar/desfavoritar
  toggleFavorite: async (id) => {
    const response = await api.post(`/offers/${id}/favorite`);
    return response.data;
  },
  
  // Estatísticas
  getStats: async () => {
    const response = await api.get('/offers/stats');
    return response.data;
  }
};

/**
 * Utilitários de autenticação
 */
export const authUtils = {
  // Salvar token e dados do usuário
  setAuth: (token, user) => {
    Cookies.set('token', token, { expires: 7, secure: true, sameSite: 'strict' });
    Cookies.set('user', JSON.stringify(user), { expires: 7, secure: true, sameSite: 'strict' });
  },
  
  // Remover autenticação
  clearAuth: () => {
    Cookies.remove('token');
    Cookies.remove('user');
  },
  
  // Verificar se está autenticado
  isAuthenticated: () => {
    return !!Cookies.get('token');
  },
  
  // Obter usuário do cookie
  getUser: () => {
    const userCookie = Cookies.get('user');
    return userCookie ? JSON.parse(userCookie) : null;
  },
  
  // Obter token
  getToken: () => {
    return Cookies.get('token');
  }
};

export default api;