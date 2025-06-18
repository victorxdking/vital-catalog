import React from 'react';
import { X, Heart, MessageCircle, Package, Eye } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const { state, dispatch } = useApp();
  const isFavorite = state.favorites.includes(product.id);

  if (!isOpen) return null;

  const handleFavoriteToggle = () => {
    dispatch({ type: 'TOGGLE_FAVORITE', payload: product.id });
  };

  const handleWhatsApp = () => {
    const message = `Olá! Gostaria de mais informações sobre o produto: ${product.name} (Código: ${product.code})`;
    const whatsappUrl = `https://api.whatsapp.com/send?phone=5511999999999&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const getStockBadge = () => {
    switch (product.stock) {
      case 'available':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
            <Package className="w-4 h-4 mr-2" />
            Disponível
          </span>
        );
      case 'out_of_stock':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <Package className="w-4 h-4 mr-2" />
            Esgotado
          </span>
        );
      case 'coming_soon':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <Package className="w-4 h-4 mr-2" />
            Em breve
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-teal-600 font-medium bg-teal-50 px-3 py-1 rounded-full">
                      {product.category}
                    </span>
                    <span className="text-sm text-gray-500 flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {product.views} visualizações
                    </span>
                  </div>

                  <div>
                    {getStockBadge()}
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Descrição</h3>
                    <p className="text-gray-600 leading-relaxed">{product.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-1">Código</h4>
                      <p className="text-sm text-gray-600">{product.code}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-1">Referência</h4>
                      <p className="text-sm text-gray-600">{product.reference}</p>
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      onClick={handleFavoriteToggle}
                      className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg border-2 transition-all ${
                        isFavorite
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-gray-300 text-gray-700 hover:border-red-300 hover:text-red-600'
                      }`}
                    >
                      <Heart className={`w-5 h-5 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                      {isFavorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
                    </button>

                    <button
                      onClick={handleWhatsApp}
                      className="flex-1 bg-emerald-600 text-white px-4 py-3 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center"
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Solicitar Orçamento
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}