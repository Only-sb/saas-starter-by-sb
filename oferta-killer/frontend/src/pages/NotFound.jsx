import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-primary-600">404</h1>
          <h2 className="mt-4 text-3xl font-bold text-gray-900">Página não encontrada</h2>
          <p className="mt-2 text-lg text-gray-600">
            A página que você está procurando não existe.
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/dashboard"
              className="btn-primary inline-flex items-center"
            >
              <Home className="w-4 h-4 mr-2" />
              Ir para Dashboard
            </Link>
            <button
              onClick={() => window.history.back()}
              className="btn-secondary inline-flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;