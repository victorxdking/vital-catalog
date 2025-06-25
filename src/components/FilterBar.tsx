import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Filter, RotateCcw } from 'lucide-react';
import { Category, Product } from '../types';

interface FilterBarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedStock: string;
  onStockChange: (stock: string) => void;
  categories: Category[];
  products?: Product[];
}

export function FilterBar({
  selectedCategory,
  onCategoryChange,
  selectedStock,
  onStockChange,
  categories,
  products = [],
}: FilterBarProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const hasActiveFilters = selectedCategory || selectedStock;

  const handleClearFilters = () => {
    onCategoryChange('');
    onStockChange('');
  };

  const getProductCountForCategory = (categoryName: string) => {
    return products.filter(p => p.category === categoryName).length;
  };

  const getProductCountForStock = (stock: string) => {
    return products.filter(p => p.stock === stock).length;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header Minimalista */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <h3 className="text-sm font-medium text-gray-700">Filtros</h3>
            {hasActiveFilters && (
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                {[selectedCategory, selectedStock].filter(Boolean).length}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-1">
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
                title="Limpar filtros"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo dos Filtros */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Categorias */}
          <div>
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Categoria</h4>
            <div className="space-y-2">
              <label className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    value=""
                    checked={selectedCategory === ''}
                    onChange={(e) => onCategoryChange(e.target.value)}
                    className="w-4 h-4 text-[#7ed957] border-2 border-gray-300 focus:ring-[#7ed957] focus:ring-2 focus:ring-offset-0"
                  />
                  <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-800">
                    Todas
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  {products.length}
                </span>
              </label>

              {categories.map((category) => (
                <label key={category.id} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value={category.name}
                      checked={selectedCategory === category.name}
                      onChange={(e) => onCategoryChange(e.target.value)}
                      className="w-4 h-4 text-[#7ed957] border-2 border-gray-300 focus:ring-[#7ed957] focus:ring-2 focus:ring-offset-0"
                    />
                    <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-800">
                      {category.name}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {getProductCountForCategory(category.name)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Disponibilidade */}
          <div>
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Disponibilidade</h4>
            <div className="space-y-2">
              <label className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="stock"
                    value=""
                    checked={selectedStock === ''}
                    onChange={(e) => onStockChange(e.target.value)}
                    className="w-4 h-4 text-[#7ed957] border-2 border-gray-300 focus:ring-[#7ed957] focus:ring-2 focus:ring-offset-0"
                  />
                  <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-800">
                    Todos
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  {products.length}
                </span>
              </label>

              <label className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="stock"
                    value="available"
                    checked={selectedStock === 'available'}
                    onChange={(e) => onStockChange(e.target.value)}
                    className="w-4 h-4 text-[#7ed957] border-2 border-gray-300 focus:ring-[#7ed957] focus:ring-2 focus:ring-offset-0"
                  />
                  <div className="flex items-center ml-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600 group-hover:text-gray-800">
                      Disponível
                    </span>
                  </div>
                </div>
                <span className="text-xs text-gray-400">
                  {getProductCountForStock('available')}
                </span>
              </label>

              <label className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="stock"
                    value="out_of_stock"
                    checked={selectedStock === 'out_of_stock'}
                    onChange={(e) => onStockChange(e.target.value)}
                    className="w-4 h-4 text-[#7ed957] border-2 border-gray-300 focus:ring-[#7ed957] focus:ring-2 focus:ring-offset-0"
                  />
                  <div className="flex items-center ml-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600 group-hover:text-gray-800">
                      Esgotado
                    </span>
                  </div>
                </div>
                <span className="text-xs text-gray-400">
                  {getProductCountForStock('out_of_stock')}
                </span>
              </label>

              <label className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="stock"
                    value="coming_soon"
                    checked={selectedStock === 'coming_soon'}
                    onChange={(e) => onStockChange(e.target.value)}
                    className="w-4 h-4 text-[#7ed957] border-2 border-gray-300 focus:ring-[#7ed957] focus:ring-2 focus:ring-offset-0"
                  />
                  <div className="flex items-center ml-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600 group-hover:text-gray-800">
                      Em breve
                    </span>
                  </div>
                </div>
                <span className="text-xs text-gray-400">
                  {getProductCountForStock('coming_soon')}
                </span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}