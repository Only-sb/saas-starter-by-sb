import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const OfferDetails = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <Link to="/offers" className="mr-4">
              <ArrowLeft className="w-6 h-6 text-gray-600 hover:text-gray-900" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Detalhes da Oferta</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="card">
            <div className="card-body">
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Funcionalidade em Desenvolvimento
                </h2>
                <p className="text-gray-600 mb-8">
                  A página de detalhes da oferta está sendo desenvolvida.
                </p>
                <Link
                  to="/offers"
                  className="btn-primary"
                >
                  Voltar às Ofertas
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OfferDetails;