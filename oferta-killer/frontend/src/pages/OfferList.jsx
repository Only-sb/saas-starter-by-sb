import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';

const OfferList = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Link to="/dashboard" className="mr-4">
                <ArrowLeft className="w-6 h-6 text-gray-600 hover:text-gray-900" />
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Minhas Ofertas</h1>
            </div>
            <Link to="/create-offer" className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Nova Oferta
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="card">
            <div className="card-body">
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Nenhuma oferta criada ainda
                </h2>
                <p className="text-gray-600 mb-8">
                  Você ainda não criou nenhuma oferta. Comece agora e veja como nossa IA 
                  pode transformar seus produtos em ofertas irresistíveis!
                </p>
                <Link
                  to="/create-offer"
                  className="btn-primary"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeira Oferta
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OfferList;