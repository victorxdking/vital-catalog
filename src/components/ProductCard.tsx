import React, { useState } from 'react';
import { Heart, Eye, MessageCircle, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../hooks/useAuth';
import { LazyImage } from './LazyImage';
import { useToast } from '../context/ToastContext';
import { LoginPromptModal } from './LoginPromptModal';

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
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { showFavoriteToast, showToast } = useToast();
  const navigate = useNavigate();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    
    const wasFavorite = isFavorite(product.id);
    const result = await toggleFavorite(product.id);
    
    if (!result.error) {
      showFavoriteToast(product.name, !wasFavorite);
    } else {
      showToast('Erro ao atualizar favoritos', 'error');
    }
  };

  const handleLoginRedirect = () => {
    setShowLoginPrompt(false);
    navigate('/login');
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
        <LazyImage
          src={product.images[0]}
          alt={product.name}
          className="w-full h-48 object-contain group-hover:scale-105 transition-transform duration-300 p-2 bg-white"
          fallbackClassName="w-full h-48"
        />
        
        {/* Badge de estoque - Canto superior esquerdo */}
        <div className="absolute top-3 left-3">
          {getStockBadge()}
        </div>
        
        {/* Botões de ação - Canto superior direito alinhados horizontalmente */}
        <div className="absolute top-3 right-3 flex items-center space-x-2">
          {!showAdminActions && (
            <>
              {/* Botão de favoritar */}
              <button
                onClick={handleFavoriteToggle}
                className={`w-9 h-9 rounded-full backdrop-blur-sm transition-all duration-200 flex items-center justify-center shadow-md ${
                  isFavorite(product.id)
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-white/90 text-gray-600 hover:text-red-500 hover:bg-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite(product.id) ? 'fill-current' : ''}`} />
              </button>
              
              {/* Botão de WhatsApp/Orçamento */}
              <button
                onClick={handleWhatsApp}
                className="w-9 h-9 rounded-full bg-emerald-500 text-white hover:bg-emerald-600 transition-colors flex items-center justify-center shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
        
        {/* Botões admin */}
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

      {/* Modal de Login */}
      <LoginPromptModal
        isOpen={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        onLogin={handleLoginRedirect}
        title="Login Necessário"
        message="Você precisa estar logado para favoritar produtos. Deseja fazer login agora?"
      />
    </div>
  );
}