import React, { useState } from 'react';
import { X, Heart, MessageCircle, Package, Eye, Star, Shield, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../context/ToastContext';
import { LazyImage } from './LazyImage';
import { LoginPromptModal } from './LoginPromptModal';

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { showFavoriteToast, showToast } = useToast();
  const navigate = useNavigate();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  if (!isOpen) return null;

  const handleFavoriteToggle = async () => {
    // Verificar se está logado
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
    onClose();
    navigate('/login');
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
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg">
            <Package className="w-4 h-4 mr-2" />
            Disponível
          </div>
        );
      case 'out_of_stock':
        return (
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg">
            <Package className="w-4 h-4 mr-2" />
            Esgotado
          </div>
        );
      case 'coming_soon':
        return (
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg">
            <Package className="w-4 h-4 mr-2" />
            Em breve
          </div>
        );
    }
  };

  const isProductFavorite = user ? isFavorite(product.id) : false;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity" 
          onClick={onClose} 
        />

        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full">
          {/* Header com gradiente */}
          <div className="bg-gradient-to-r from-[#183263] to-[#2a4a7a] text-white">
            <div className="flex justify-between items-center p-6">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-[#7ed957] rounded-full animate-pulse"></div>
                <h2 className="text-2xl font-bold">{product.name}</h2>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Coluna da Imagem */}
              <div className="space-y-6">
                <div className="relative">
                  <div className="aspect-square bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden p-8">
                    {product.images && product.images.length > 0 ? (
                      <LazyImage
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-contain"
                        fallbackClassName="w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <Package className="w-20 h-20 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  {/* Badge de categoria flutuante */}
                  <div className="absolute -top-3 left-6">
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-[#7ed957] to-[#6bc247] text-white shadow-lg">
                      {product.category}
                    </span>
                  </div>
                </div>

                {/* Features do produto */}
                <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Garantias e Benefícios</h4>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-[#183263]" />
                      <span className="text-sm text-gray-700">Produto original e certificado</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Truck className="w-5 h-5 text-[#183263]" />
                      <span className="text-sm text-gray-700">Entrega rápida e segura</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Star className="w-5 h-5 text-[#183263]" />
                      <span className="text-sm text-gray-700">Qualidade garantida</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Coluna das Informações */}
              <div className="space-y-8">
                {/* Status e visualizações */}
                <div className="flex items-center justify-between">
                  {getStockBadge()}
                  <div className="flex items-center space-x-2 text-gray-500">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm font-medium">{product.views} visualizações</span>
                  </div>
                </div>

                {/* Descrição */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900">Descrição do Produto</h3>
                  <p className="text-gray-700 leading-relaxed text-lg">{product.description}</p>
                </div>

                {/* Informações técnicas */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
                  <h4 className="font-semibold text-gray-900 mb-4">Informações Técnicas</h4>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Código</h5>
                      <p className="text-lg font-mono text-[#183263] font-semibold">{product.code}</p>
                    </div>
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Referência</h5>
                      <p className="text-lg font-mono text-[#183263] font-semibold">{product.reference}</p>
                    </div>
                  </div>
                </div>

                {/* Botões de ação */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={handleFavoriteToggle}
                      className={`flex items-center justify-center px-6 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                        isProductFavorite
                          ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:shadow-xl'
                          : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-red-300 hover:text-red-600 hover:bg-red-50 shadow-md'
                      }`}
                    >
                      <Heart className={`w-5 h-5 mr-3 ${isProductFavorite ? 'fill-current' : ''}`} />
                      {isProductFavorite ? 'Favoritado' : 'Favoritar'}
                    </button>

                    <button
                      onClick={handleWhatsApp}
                      className="flex items-center justify-center px-6 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      <MessageCircle className="w-5 h-5 mr-3" />
                      Solicitar Orçamento
                    </button>
                  </div>

                  {/* Aviso para usuários não logados */}
                  {!user && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                            <Heart className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">
                            Crie sua conta e aproveite!
                          </h4>
                          <p className="text-gray-700 mb-4">
                            Faça login para favoritar produtos, acompanhar pedidos e ter acesso a ofertas exclusivas.
                          </p>
                          <button
                            onClick={() => {
                              onClose();
                              navigate('/login');
                            }}
                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#183263] to-[#2a4a7a] text-white rounded-lg font-medium hover:from-[#2a4a7a] hover:to-[#183263] transition-all duration-300"
                          >
                            Fazer Login
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
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