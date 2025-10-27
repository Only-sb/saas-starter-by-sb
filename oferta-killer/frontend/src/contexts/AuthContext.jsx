import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService, authUtils } from '../services/api';
import toast from 'react-hot-toast';

/**
 * Contexto de Autenticação
 * Gerencia estado global de autenticação e dados do usuário
 */

// Estados possíveis da autenticação
const authStates = {
  LOADING: 'loading',
  AUTHENTICATED: 'authenticated',
  UNAUTHENTICATED: 'unauthenticated',
  ERROR: 'error'
};

// Estado inicial
const initialState = {
  status: authStates.LOADING,
  user: null,
  error: null
};

// Ações do reducer
const actions = {
  SET_LOADING: 'SET_LOADING',
  SET_AUTHENTICATED: 'SET_AUTHENTICATED',
  SET_UNAUTHENTICATED: 'SET_UNAUTHENTICATED',
  SET_ERROR: 'SET_ERROR',
  UPDATE_USER: 'UPDATE_USER',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer para gerenciar estado
const authReducer = (state, action) => {
  switch (action.type) {
    case actions.SET_LOADING:
      return {
        ...state,
        status: authStates.LOADING,
        error: null
      };
      
    case actions.SET_AUTHENTICATED:
      return {
        ...state,
        status: authStates.AUTHENTICATED,
        user: action.payload,
        error: null
      };
      
    case actions.SET_UNAUTHENTICATED:
      return {
        ...state,
        status: authStates.UNAUTHENTICATED,
        user: null,
        error: null
      };
      
    case actions.SET_ERROR:
      return {
        ...state,
        status: authStates.ERROR,
        error: action.payload,
        user: null
      };
      
    case actions.UPDATE_USER:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload
        }
      };
      
    case actions.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
      
    default:
      return state;
  }
};

// Criação do contexto
const AuthContext = createContext(null);

// Provider do contexto
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Verificar autenticação ao carregar a aplicação
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Verificar se o usuário está autenticado
  const checkAuthStatus = async () => {
    try {
      if (!authUtils.isAuthenticated()) {
        dispatch({ type: actions.SET_UNAUTHENTICATED });
        return;
      }

      // Verificar se o token ainda é válido
      const response = await authService.getMe();
      
      if (response.success) {
        dispatch({
          type: actions.SET_AUTHENTICATED,
          payload: response.data.user
        });
        
        // Atualizar dados do usuário no cookie
        authUtils.setAuth(authUtils.getToken(), response.data.user);
      } else {
        throw new Error('Token inválido');
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      authUtils.clearAuth();
      dispatch({ type: actions.SET_UNAUTHENTICATED });
    }
  };

  // Fazer login
  const login = async (credentials) => {
    try {
      dispatch({ type: actions.SET_LOADING });
      
      const response = await authService.login(credentials);
      
      if (response.success) {
        const { token, user } = response.data;
        
        // Salvar no cookie
        authUtils.setAuth(token, user);
        
        // Atualizar estado
        dispatch({
          type: actions.SET_AUTHENTICATED,
          payload: user
        });
        
        toast.success('Login realizado com sucesso!');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao fazer login';
      dispatch({
        type: actions.SET_ERROR,
        payload: message
      });
      return { success: false, message };
    }
  };

  // Fazer registro
  const register = async (userData) => {
    try {
      dispatch({ type: actions.SET_LOADING });
      
      const response = await authService.register(userData);
      
      if (response.success) {
        const { token, user } = response.data;
        
        // Salvar no cookie
        authUtils.setAuth(token, user);
        
        // Atualizar estado
        dispatch({
          type: actions.SET_AUTHENTICATED,
          payload: user
        });
        
        toast.success('Conta criada com sucesso!');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao criar conta';
      dispatch({
        type: actions.SET_ERROR,
        payload: message
      });
      return { success: false, message };
    }
  };

  // Fazer logout
  const logout = () => {
    authUtils.clearAuth();
    dispatch({ type: actions.SET_UNAUTHENTICATED });
    toast.success('Logout realizado com sucesso!');
  };

  // Atualizar perfil
  const updateProfile = async (profileData) => {
    try {
      const response = await authService.updateProfile(profileData);
      
      if (response.success) {
        dispatch({
          type: actions.UPDATE_USER,
          payload: response.data.user
        });
        
        // Atualizar cookie
        const currentToken = authUtils.getToken();
        authUtils.setAuth(currentToken, { ...state.user, ...response.data.user });
        
        toast.success('Perfil atualizado com sucesso!');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao atualizar perfil';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Alterar senha
  const changePassword = async (passwordData) => {
    try {
      const response = await authService.changePassword(passwordData);
      
      if (response.success) {
        toast.success('Senha alterada com sucesso!');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao alterar senha';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Limpar erro
  const clearError = () => {
    dispatch({ type: actions.CLEAR_ERROR });
  };

  // Verificar se está carregando
  const isLoading = state.status === authStates.LOADING;
  
  // Verificar se está autenticado
  const isAuthenticated = state.status === authStates.AUTHENTICATED;

  // Valor do contexto
  const value = {
    // Estado
    user: state.user,
    error: state.error,
    isLoading,
    isAuthenticated,
    
    // Ações
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    clearError,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth deve ser usado dentro do AuthProvider');
  }
  
  return context;
};

export { authStates };
export default AuthContext;