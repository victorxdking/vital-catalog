import React, { useState, useEffect } from 'react';
import { Heart, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { ProductModal } from '../components/ProductModal';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useProducts } from '../hooks/useProducts';
import { useFavorites } from '../hooks/useFavorites';
import { useAuth } from '../hooks/useAuth';
import { Product } from '../types';

interface FavoritesProps {
  onProductInterest?: (product: Product) => void;
}

export function Favorites({ onProductInterest }: FavoritesProps) {
  const { user } = useAuth();
  const { products, incrementViews } = useProducts();
  const { favorites, loading: favoritesLoading } = useFavorites();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (products.length > 0 && favorites.length > 0) {
      const filteredProducts = products.filter(product => 
        favorites.includes(product.id)
      );
      setFavoriteProducts(filteredProducts);
    } else {
      setFavoriteProducts([]);
    }
  }, [products, favorites]);

  const handleProductClick = (product: Product) => {
    incrementViews(product.id);
    setSelectedProduct(product);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Faça login para ver seus favoritos
          </h2>
          <p className="text-gray-600 mb-6">
            Entre na sua conta para acessar seus produtos favoritos.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#183263] hover:bg-[#3a5a8c] transition-colors"
          >
            Fazer Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Link to="/" className="text-[#183263] hover:text-[#3a5a8c] transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <Heart className="w-8 h-8 text-red-500 fill-current" />
            <h1 className="text-3xl font-bold text-gray-900">Meus Favoritos</h1>
          </div>
          <div className="flex items-center space-x-2">
            {favoritesLoading && <LoadingSpinner size="sm" className="text-[#183263]" />}
            <p className="text-gray-600">
              {favoritesLoading 
                ? "Carregando favoritos..."
                : favoriteProducts.length === 0 
                  ? "Você ainda não tem produtos favoritos."
                  : `Você tem ${favoriteProducts.length} produto${favoriteProducts.length > 1 ? 's' : ''} favorito${favoriteProducts.length > 1 ? 's' : ''}.`
              }
            </p>
          </div>
        </div>

        {favoriteProducts.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Nenhum produto favorito
            </h2>
            <p className="text-gray-600 mb-6">
              Explore nosso catálogo e adicione produtos aos seus favoritos.
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#183263] hover:bg-[#3a5a8c] transition-colors"
            >
              Ver Catálogo
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={handleProductClick}
              />
            ))}
          </div>
        )}

        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            isOpen={!!selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </div>
    </div>
  );
}