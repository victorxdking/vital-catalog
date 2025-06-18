import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { ProductModal } from '../components/ProductModal';
import { useProducts } from '../hooks/useProducts';
import { useApp } from '../context/AppContext';
import { Product } from '../types';

export function Favorites() {
  const { products, incrementViews } = useProducts();
  const { state } = useApp();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const favoriteProducts = products.filter(product => 
    state.favorites.includes(product.id)
  );

  const handleProductClick = (product: Product) => {
    incrementViews(product.id);
    setSelectedProduct(product);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Heart className="w-8 h-8 text-red-500 fill-current" />
            <h1 className="text-3xl font-bold text-gray-900">Meus Favoritos</h1>
          </div>
          <p className="text-gray-600">
            {favoriteProducts.length === 0 
              ? "Você ainda não tem produtos favoritos."
              : `Você tem ${favoriteProducts.length} produto${favoriteProducts.length > 1 ? 's' : ''} favorito${favoriteProducts.length > 1 ? 's' : ''}.`
            }
          </p>
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
            <a
              href="/"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Ver Catálogo
            </a>
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