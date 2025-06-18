import React, { useState, useEffect } from 'react';
import { ProductCard } from '../components/ProductCard';
import { ProductModal } from '../components/ProductModal';
import { SearchBar } from '../components/SearchBar';
import { FilterBar } from '../components/FilterBar';
import { useProducts } from '../hooks/useProducts';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { Loader } from 'lucide-react';

export function Home() {
  const { products, isLoading, incrementViews } = useProducts();
  const { state } = useApp();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStock, setSelectedStock] = useState('');

  const filteredProducts = products.filter((product) => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.reference.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === '' || product.category === selectedCategory;
    const matchesStock = selectedStock === '' || product.stock === selectedStock;

    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleProductClick = (product: Product) => {
    incrementViews(product.id);
    setSelectedProduct(product);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-teal-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando produtos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Custom Banner */}
      <div className="relative py-32 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/banner_vital.png)',
          }}
        >
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-2xl md:text-3xl text-white mb-10 drop-shadow-md font-medium">
            Descubra nossa linha completa de produtos de beleza
          </p>
          <div className="max-w-2xl mx-auto">
            <SearchBar
              onSearch={setSearchQuery}
              placeholder="Busque por nome, código ou categoria..."
              className="text-left shadow-xl"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <FilterBar
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedStock={selectedStock}
              onStockChange={setSelectedStock}
            />
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Produtos ({filteredProducts.length})
              </h2>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  Nenhum produto encontrado com os filtros selecionados.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={handleProductClick}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}