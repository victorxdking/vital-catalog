import React, { useState, useEffect } from 'react';
import { ProductCard } from '../components/ProductCard';
import { ProductModal } from '../components/ProductModal';
import { PromoModal } from '../components/PromoModal';
import { SearchBar } from '../components/SearchBar';
import { FilterBar } from '../components/FilterBar';
import { Pagination } from '../components/Pagination';
import { useProducts } from '../hooks/useProducts';
import { useAuth } from '../hooks/useAuth';
import { useDebounce } from '../hooks/useDebounce';
import { Product } from '../types';
import BannerVideo from '../components/BannerVideo';
import { ProductSkeletonGrid } from '../components/ProductSkeleton';

interface HomeProps {
  onProductInterest?: (product: Product) => void;
}

export function Home(): React.JSX.Element {
  const { user } = useAuth();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStock, setSelectedStock] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showPromoModal, setShowPromoModal] = useState(false);
  
  // Debounce search para evitar muitas requisições
  const debouncedSearch = useDebounce(searchQuery, 500);
  
  // Hook de produtos com paginação e filtros
  const { 
    products, 
    categories, 
    isLoading, 
    totalCount, 
    totalPages, 
    incrementViews,
    fetchAllProducts 
  } = useProducts({
    page: currentPage,
    limit: 12,
    category: selectedCategory,
    search: debouncedSearch
  });

  // Controlar exibição do modal promocional
  useEffect(() => {
    // Só mostrar se não estiver logado
    if (!user) {
      // Verificar se já foi mostrado nesta sessão
      const hasShownPromo = sessionStorage.getItem('promoModalShown');
      
      if (!hasShownPromo) {
        // Mostrar após 3 segundos
        const timer = setTimeout(() => {
          setShowPromoModal(true);
        }, 3000);

        return () => clearTimeout(timer);
      }
    }
  }, [user]);

  const handleClosePromoModal = () => {
    setShowPromoModal(false);
    // Marcar como mostrado nesta sessão
    sessionStorage.setItem('promoModalShown', 'true');
  };

  // Resetar página quando filtros mudam
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedStock, debouncedSearch]);

  // Filtrar produtos localmente apenas por estoque (categoria e busca são filtrados no backend)
  const filteredProducts = products.filter(product => {
    return !selectedStock || product.stock === selectedStock;
  });

  const handleProductClick = (product: Product) => {
    incrementViews(product.id);
    setSelectedProduct(product);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Video Banner */}
      <div className="relative overflow-hidden">
        <BannerVideo />
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <p className="text-2xl md:text-3xl text-white mb-10 drop-shadow-md font-medium text-center">
            Descubra nossa linha completa de produtos de beleza
          </p>
          <div className="max-w-2xl w-full px-4">
            <SearchBar
              onSearch={setSearchQuery}
              value={searchQuery}
              placeholder="Busque por nome, código ou categoria..."
              className="text-left shadow-xl"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <FilterBar
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedStock={selectedStock}
              onStockChange={setSelectedStock}
              categories={categories}
              products={products}
            />
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Produtos ({totalCount} total)
              </h2>
              <div className="text-sm text-gray-500">
                Página {currentPage} de {totalPages}
              </div>
            </div>

            {isLoading ? (
              <ProductSkeletonGrid count={12} />
            ) : filteredProducts.length === 0 ? (
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

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
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

      {/* Promotional Modal */}
      <PromoModal
        isOpen={showPromoModal}
        onClose={handleClosePromoModal}
      />
    </div>
  );
}