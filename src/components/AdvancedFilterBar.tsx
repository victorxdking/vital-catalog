import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Filter, X, RotateCcw, Search } from 'lucide-react';
import { Category, Product } from '../types';


interface AdvancedFilterBarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedStock: string;
  onStockChange: (stock: string) => void;
  selectedBrands: string[];
  onBrandsChange: (brands: string[]) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  categories: Category[];
  products: Product[];
  onClearFilters: () => void;
}

export function AdvancedFilterBar({
  selectedCategory,
  onCategoryChange,
  selectedStock,
  onStockChange,
  selectedBrands,
  onBrandsChange,
  sortBy,
  onSortChange,
  categories,
  products,
  onClearFilters,
}: AdvancedFilterBarProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchBrand, setSearchBrand] = useState('');

  // Extrair marcas únicas dos produtos
  const extractedBrands = React.useMemo(() => {
    const brandSet = new Set<string>();
    products.forEach(product => {
      // Tentar extrair marca do nome do produto
      const name = product.name.toLowerCase();
      
      // Lista de marcas conhecidas para detectar
      const knownBrands = [
        'salon line', 'naxos', 'loreal', 'l\'oreal', 'garnier', 'pantene', 
        'tresemme', 'tresemmé', 'dove', 'nivea', 'natura', 'boticario', 
        'o boticário', 'avon', 'mary kay', 'maybelline', 'revlon', 'mac',
        'clinique', 'vichy', 'la roche posay', 'eucerin', 'neutrogena',
        'johnson', 'johnson\'s', 'huggies', 'pampers', 'seda', 'clear',
        'head & shoulders', 'herbal essences', 'aussie', 'fructis'
      ];

      // Detectar marca no nome do produto
      for (const brand of knownBrands) {
        if (name.includes(brand)) {
          // Capitalizar primeira letra de cada palavra
          const formattedBrand = brand
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          brandSet.add(formattedBrand);
          break;
        }
      }
    });

    return Array.from(brandSet).sort();
  }, [products]);

  // Filtrar marcas pela busca
  const filteredBrands = extractedBrands.filter(brand =>
    brand.toLowerCase().includes(searchBrand.toLowerCase())
  );

  const handleBrandToggle = (brand: string) => {
    const newBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter(b => b !== brand)
      : [...selectedBrands, brand];
    onBrandsChange(newBrands);
  };

  const hasActiveFilters = selectedCategory || selectedStock || selectedBrands.length > 0 || sortBy !== 'name';

  const getProductCountForCategory = (categoryName: string) => {
    return products.filter(p => p.category === categoryName).length;
  };

  const getProductCountForStock = (stock: string) => {
    return products.filter(p => p.stock === stock).length;
  };

  const getProductCountForBrand = (brand: string) => {
    return products.filter(p => 
      p.name.toLowerCase().includes(brand.toLowerCase())
    ).length;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
            {hasActiveFilters && (
              <span className="bg-[#7ed957] text-white text-xs font-bold px-2 py-1 rounded-full">
                {[selectedCategory, selectedStock, ...selectedBrands, sortBy !== 'name' ? 'ordenado' : ''].filter(Boolean).length}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {hasActiveFilters && (
              <button
                onClick={onClearFilters}
                className="text-gray-500 hover:text-red-600 transition-colors flex items-center space-x-1 text-sm"
                title="Limpar filtros"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Limpar</span>
              </button>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Filter Content */}
      {isExpanded && (
        <div className="p-4 space-y-6">
          {/* Ordenação */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center space-x-2">
              <span>Ordenar por</span>
            </h4>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
                              className="w-full px-3 py-2 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#7ed957] focus:border-[#7ed957] outline-none transition-all bg-white hover:border-gray-400 appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 0.5rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5em 1.5em',
                paddingRight: '2.5rem'
              }}
            >
              <option value="name">Nome (A-Z)</option>
              <option value="name_desc">Nome (Z-A)</option>
              <option value="newest">Mais Recentes</option>
              <option value="oldest">Mais Antigos</option>
              <option value="most_viewed">Mais Visualizados</option>
              <option value="category">Categoria</option>
            </select>
          </div>

          {/* Categorias */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Categoria</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              <label className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                <div className="flex items-center">
                                      <input
                      type="radio"
                      name="category"
                      value=""
                      checked={selectedCategory === ''}
                      onChange={(e) => onCategoryChange(e.target.value)}
                      className="mr-3 w-4 h-4 text-[#7ed957] border-2 border-gray-300 focus:ring-[#7ed957] focus:ring-2 focus:ring-offset-0 transition-colors"
                    />
                  <span className="text-sm text-gray-600">Todas as categorias</span>
                </div>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                  {products.length}
                </span>
              </label>
              {categories.map((category) => (
                <label key={category.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value={category.name}
                      checked={selectedCategory === category.name}
                      onChange={(e) => onCategoryChange(e.target.value)}
                      className="mr-3 w-4 h-4 text-[#7ed957] border-2 border-gray-300 focus:ring-[#7ed957] focus:ring-2 focus:ring-offset-0 transition-colors"
                    />
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color || '#8B5CF6' }}
                      />
                      <span className="text-sm text-gray-600">{category.name}</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                    {getProductCountForCategory(category.name)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Disponibilidade */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Disponibilidade</h4>
            <div className="space-y-2">
              <label className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="stock"
                    value=""
                    checked={selectedStock === ''}
                    onChange={(e) => onStockChange(e.target.value)}
                    className="mr-3 w-4 h-4 text-[#7ed957] border-2 border-gray-300 focus:ring-[#7ed957] focus:ring-2 focus:ring-offset-0 transition-colors"
                  />
                  <span className="text-sm text-gray-600">Todos os produtos</span>
                </div>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                  {products.length}
                </span>
              </label>
              <label className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="stock"
                    value="available"
                    checked={selectedStock === 'available'}
                    onChange={(e) => onStockChange(e.target.value)}
                    className="mr-3 w-4 h-4 text-[#7ed957] border-2 border-gray-300 focus:ring-[#7ed957] focus:ring-2 focus:ring-offset-0 transition-colors"
                  />
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Disponível</span>
                  </div>
                </div>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                  {getProductCountForStock('available')}
                </span>
              </label>
              <label className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="stock"
                    value="out_of_stock"
                    checked={selectedStock === 'out_of_stock'}
                    onChange={(e) => onStockChange(e.target.value)}
                    className="mr-3 w-4 h-4 text-[#7ed957] border-2 border-gray-300 focus:ring-[#7ed957] focus:ring-2 focus:ring-offset-0 transition-colors"
                  />
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Esgotado</span>
                  </div>
                </div>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                  {getProductCountForStock('out_of_stock')}
                </span>
              </label>
              <label className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="stock"
                    value="coming_soon"
                    checked={selectedStock === 'coming_soon'}
                    onChange={(e) => onStockChange(e.target.value)}
                    className="mr-3 w-4 h-4 text-[#7ed957] border-2 border-gray-300 focus:ring-[#7ed957] focus:ring-2 focus:ring-offset-0 transition-colors"
                  />
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Em breve</span>
                  </div>
                </div>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                  {getProductCountForStock('coming_soon')}
                </span>
              </label>
            </div>
          </div>

          {/* Marcas */}
          {extractedBrands.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Marcas {selectedBrands.length > 0 && (
                  <span className="text-[#7ed957] font-normal">({selectedBrands.length} selecionadas)</span>
                )}
              </h4>
              
              {/* Busca de marcas */}
              {extractedBrands.length > 5 && (
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={searchBrand}
                    onChange={(e) => setSearchBrand(e.target.value)}
                    placeholder="Buscar marca..."
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#7ed957] focus:border-transparent outline-none transition-all text-sm"
                  />
                  {searchBrand && (
                    <button
                      onClick={() => setSearchBrand('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {filteredBrands.map((brand) => (
                  <label key={brand} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => handleBrandToggle(brand)}
                        className="mr-3 w-4 h-4 text-[#7ed957] border-2 border-gray-300 rounded-md focus:ring-[#7ed957] focus:ring-2 focus:ring-offset-0 transition-colors"
                      />
                      <span className="text-sm text-gray-600">{brand}</span>
                    </div>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                      {getProductCountForBrand(brand)}
                    </span>
                  </label>
                ))}
                {filteredBrands.length === 0 && searchBrand && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Nenhuma marca encontrada para "{searchBrand}"
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 