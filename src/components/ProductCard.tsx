import React from 'react';
import { Heart, Eye, MessageCircle, Package } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';

interface ProductCardProps {
  product: Product;
  onClick?: (product: Product) => void;
  showAdminActions?: boolean;
  onEdit?: (product: Product) => void;
  onDelete?: (id: string) => void;
}

export function ProductCard({
  product,
  onClick,
  showAdminActions = false,
  onEdit,
  onDelete,
}: ProductCardProps) {
  const { state, dispatch } = useApp();
  const isFavorite = state.favorites.includes(product.id);

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: 'TOGGLE_FAVORITE', payload: product.id });
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const message = `Olá! Gostaria de mais informações sobre o produto: ${product.name} (Código: ${product.code})`;
    const whatsappUrl = `https://api.whatsapp.com/send?phone=5511999999999&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const getStockBadge = () => {
    switch (product.stock) {
      case 'available':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
            <Package className="w-3 h-3 mr-1" />
            Disponível
          </span>
        );
      case 'out_of_stock':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <Package className="w-3 h-3 mr-1" />
            Esgotado
          </span>
        );
      case 'coming_soon':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Package className="w-3 h-3 mr-1" />
            Em breve
          </span>
        );
    }
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
      onClick={() => onClick?.(product)}
    >
      <div className="relative">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 left-2">
          {getStockBadge()}
        </div>
        <div className="absolute top-2 right-2 flex space-x-2">
          {!showAdminActions && (
            <>
              <button
                onClick={handleFavoriteToggle}
                className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
                  isFavorite
                    ? 'bg-red-500 text-white'
                    : 'bg-white/80 text-gray-600 hover:text-red-500'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleWhatsApp}
                className="p-2 rounded-full bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
        {showAdminActions && (
          <div className="absolute bottom-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(product);
              }}
              className="px-3 py-1 bg-teal-600 text-white text-xs rounded hover:bg-teal-700 transition-colors"
            >
              Editar
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(product.id);
              }}
              className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
            >
              Excluir
            </button>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-teal-600 font-medium bg-teal-50 px-2 py-1 rounded">
            {product.category}
          </span>
          <span className="text-xs text-gray-500 flex items-center">
            <Eye className="w-3 h-3 mr-1" />
            {product.views}
          </span>
        </div>

        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>Código: {product.code}</span>
          <span>Ref: {product.reference}</span>
        </div>
      </div>
    </div>
  );
}