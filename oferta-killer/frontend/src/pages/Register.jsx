import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Mail, Lock, User, Sparkles, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

/**
 * Página de Registro
 * Formulário de criação de conta com validações
 */
const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  // React Hook Form
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm();

  // Observar senha para validação da confirmação
  const password = watch('password');

  // Limpar erro ao carregar a página
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Handler do formulário
  const onSubmit = async (data) => {
    const { name, email, password } = data;
    
    const result = await registerUser({ name, email, password });
    
    if (result.success) {
      navigate('/dashboard', { replace: true });
    }
  };

  // Validação de força da senha
  const validatePasswordStrength = (value) => {
    if (!value) return true;
    
    const hasLowerCase = /[a-z]/.test(value);
    const hasUpperCase = /[A-Z]/.test(value);
    const hasNumbers = /\d/.test(value);
    const hasLength = value.length >= 6;
    
    if (!hasLength) return 'Senha deve ter no mínimo 6 caracteres';
    if (!hasLowerCase) return 'Senha deve conter pelo menos uma letra minúscula';
    if (!hasUpperCase) return 'Senha deve conter pelo menos uma letra maiúscula';
    if (!hasNumbers) return 'Senha deve conter pelo menos um número';
    
    return true;
  };

  // Indicador de força da senha
  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, text: '', color: '' };
    
    let score = 0;
    const checks = [
      password.length >= 6,
      /[a-z]/.test(password),
      /[A-Z]/.test(password),
      /\d/.test(password),
      password.length >= 10
    ];
    
    score = checks.filter(Boolean).length;
    
    if (score <= 2) return { score, text: 'Fraca', color: 'bg-danger-500' };
    if (score <= 3) return { score, text: 'Média', color: 'bg-warning-500' };
    if (score <= 4) return { score, text: 'Forte', color: 'bg-success-500' };
    return { score, text: 'Muito Forte', color: 'bg-success-600' };
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <div className="min-h-screen flex">
      {/* Lado esquerdo - Formulário */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Oferta Killer</h1>
            <p className="text-gray-600 mt-2">Crie sua conta gratuita</p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Nome */}
            <div>
              <label htmlFor="name" className="label">
                Nome completo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('name', {
                    required: 'Nome é obrigatório',
                    minLength: {
                      value: 2,
                      message: 'Nome deve ter no mínimo 2 caracteres'
                    },
                    maxLength: {
                      value: 100,
                      message: 'Nome deve ter no máximo 100 caracteres'
                    }
                  })}
                  type="text"
                  id="name"
                  className={`input pl-10 ${errors.name ? 'input-error' : ''}`}
                  placeholder="Seu nome completo"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-danger-600">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="label">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('email', {
                    required: 'Email é obrigatório',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email inválido'
                    }
                  })}
                  type="email"
                  id="email"
                  className={`input pl-10 ${errors.email ? 'input-error' : ''}`}
                  placeholder="seu@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-danger-600">{errors.email.message}</p>
              )}
            </div>

            {/* Senha */}
            <div>
              <label htmlFor="password" className="label">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('password', {
                    required: 'Senha é obrigatória',
                    validate: validatePasswordStrength
                  })}
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className={`input pl-10 pr-10 ${errors.password ? 'input-error' : ''}`}
                  placeholder="Crie uma senha forte"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              
              {/* Indicador de força da senha */}
              {password && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-600">
                      {passwordStrength.text}
                    </span>
                  </div>
                </div>
              )}
              
              {errors.password && (
                <p className="mt-1 text-sm text-danger-600">{errors.password.message}</p>
              )}
            </div>

            {/* Confirmar Senha */}
            <div>
              <label htmlFor="confirmPassword" className="label">
                Confirmar senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('confirmPassword', {
                    required: 'Confirmação de senha é obrigatória',
                    validate: value => value === password || 'Senhas não coincidem'
                  })}
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  className={`input pl-10 pr-10 ${errors.confirmPassword ? 'input-error' : ''}`}
                  placeholder="Confirme sua senha"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-danger-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Erro de registro */}
            {error && (
              <div className="bg-danger-50 border border-danger-200 rounded-lg p-3">
                <p className="text-sm text-danger-600">{error}</p>
              </div>
            )}

            {/* Botão de registro */}
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="btn-primary w-full"
            >
              {isSubmitting || isLoading ? (
                <>
                  <LoadingSpinner size="sm" color="white" className="mr-2" />
                  Criando conta...
                </>
              ) : (
                'Criar conta gratuita'
              )}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{' '}
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
              >
                Entrar
              </Link>
            </p>
          </div>

          {/* Termos */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Ao criar uma conta, você aceita nossos{' '}
              <a href="#" className="text-primary-600 hover:text-primary-500">
                Termos de Serviço
              </a>{' '}
              e{' '}
              <a href="#" className="text-primary-600 hover:text-primary-500">
                Política de Privacidade
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Lado direito - Banner */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
          <div className="max-w-md text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Comece Grátis Hoje
            </h2>
            <p className="text-xl opacity-90 mb-8">
              Junte-se a milhares de empreendedores que já aumentaram suas vendas
            </p>
            <div className="space-y-4 text-left">
              <div className="flex items-center">
                <Check className="w-5 h-5 mr-3" />
                <span>Plano gratuito para sempre</span>
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 mr-3" />
                <span>10 ofertas mensais incluídas</span>
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 mr-3" />
                <span>Sem cartão de crédito necessário</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;