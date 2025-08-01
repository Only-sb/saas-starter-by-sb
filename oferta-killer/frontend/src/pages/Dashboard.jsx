import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, TrendingUp, Eye, Copy, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Olá, {user?.name}</span>
              <button
                onClick={logout}
                className="btn-secondary"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card">
              <div className="card-body">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-primary-100">
                    <TrendingUp className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Ofertas Criadas</p>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-success-100">
                    <Eye className="w-6 h-6 text-success-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Visualizações</p>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-warning-100">
                    <Copy className="w-6 h-6 text-warning-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Cópias</p>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-secondary-100">
                    <Calendar className="w-6 h-6 text-secondary-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Plano Atual</p>
                    <p className="text-lg font-bold text-gray-900">{user?.plan || 'Basic'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card mb-8">
            <div className="card-header">
              <h2 className="text-lg font-medium text-gray-900">Ações Rápidas</h2>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Link
                  to="/create-offer"
                  className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all group"
                >
                  <div className="text-center">
                    <Plus className="w-12 h-12 text-gray-400 group-hover:text-primary-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-primary-600">
                      Criar Nova Oferta
                    </h3>
                    <p className="text-gray-600 mt-2">
                      Use nossa IA para gerar uma oferta irresistível
                    </p>
                  </div>
                </Link>

                <Link
                  to="/offers"
                  className="p-6 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all"
                >
                  <div className="text-center">
                    <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">
                      Ver Todas as Ofertas
                    </h3>
                    <p className="text-gray-600 mt-2">
                      Acesse seu histórico completo de ofertas
                    </p>
                  </div>
                </Link>

                <Link
                  to="/profile"
                  className="p-6 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all"
                >
                  <div className="text-center">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">
                      Gerenciar Conta
                    </h3>
                    <p className="text-gray-600 mt-2">
                      Atualize seu perfil e configurações
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Welcome Message */}
          <div className="card">
            <div className="card-body text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Bem-vindo ao Oferta Killer! 🚀
              </h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Você está pronto para criar ofertas irresistíveis que convertem mais vendas. 
                Nossa IA especializada em copywriting vai ajudar você a transformar seus produtos 
                digitais em ofertas que seus clientes não conseguem resistir.
              </p>
              <Link
                to="/create-offer"
                className="btn-primary"
              >
                Criar Minha Primeira Oferta
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;