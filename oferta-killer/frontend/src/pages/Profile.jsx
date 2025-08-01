import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, User, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <Link to="/dashboard" className="mr-4">
              <ArrowLeft className="w-6 h-6 text-gray-600 hover:text-gray-900" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Profile Card */}
          <div className="card mb-6">
            <div className="card-header">
              <h2 className="text-lg font-medium text-gray-900">Informações da Conta</h2>
            </div>
            <div className="card-body">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-primary-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">{user?.name}</h3>
                  <p className="text-gray-600">{user?.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">Plano Atual</label>
                  <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg">
                    {user?.plan || 'Basic'}
                  </div>
                </div>
                
                <div>
                  <label className="label">Status da Conta</label>
                  <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg">
                    {user?.isActive ? 'Ativa' : 'Inativa'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Usage Stats */}
          <div className="card mb-6">
            <div className="card-header">
              <h2 className="text-lg font-medium text-gray-900">Uso da Conta</h2>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">Ofertas Criadas Este Mês</label>
                  <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg">
                    {user?.currentMonth?.offersGenerated || 0} / {user?.monthlyLimits?.offersGenerated || 10}
                  </div>
                </div>
                
                <div>
                  <label className="label">Próximo Reset</label>
                  <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg">
                    {user?.currentMonth?.resetDate 
                      ? new Date(user.currentMonth.resetDate).toLocaleDateString('pt-BR')
                      : 'Não definido'
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-medium text-gray-900">Ações</h2>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                <button className="btn-secondary w-full md:w-auto">
                  <Settings className="w-4 h-4 mr-2" />
                  Editar Perfil
                </button>
                
                <button className="btn-secondary w-full md:w-auto">
                  <Settings className="w-4 h-4 mr-2" />
                  Alterar Senha
                </button>
                
                <button 
                  onClick={logout}
                  className="btn-danger w-full md:w-auto"
                >
                  Sair da Conta
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;