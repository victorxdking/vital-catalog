import React from 'react';
import { useApp } from '../context/AppContext';

interface FilterBarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedStock: string;
  onStockChange: (stock: string) => void;
}

export function FilterBar({
  selectedCategory,
  onCategoryChange,
  selectedStock,
  onStockChange,
}: FilterBarProps) {
  const { state } = useApp();

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
      
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Categoria</h4>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="category"
              value=""
              checked={selectedCategory === ''}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="mr-2 text-teal-600"
            />
            <span className="text-sm text-gray-600">Todas as categorias</span>
          </label>
          {state.categories.map((category) => (
            <label key={category.id} className="flex items-center">
              <input
                type="radio"
                name="category"
                value={category.name}
                checked={selectedCategory === category.name}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="mr-2 text-teal-600"
              />
              <span className="text-sm text-gray-600">{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Disponibilidade</h4>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="stock"
              value=""
              checked={selectedStock === ''}
              onChange={(e) => onStockChange(e.target.value)}
              className="mr-2 text-teal-600"
            />
            <span className="text-sm text-gray-600">Todos os produtos</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="stock"
              value="available"
              checked={selectedStock === 'available'}
              onChange={(e) => onStockChange(e.target.value)}
              className="mr-2 text-teal-600"
            />
            <span className="text-sm text-gray-600">Disponível</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="stock"
              value="out_of_stock"
              checked={selectedStock === 'out_of_stock'}
              onChange={(e) => onStockChange(e.target.value)}
              className="mr-2 text-teal-600"
            />
            <span className="text-sm text-gray-600">Esgotado</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="stock"
              value="coming_soon"
              checked={selectedStock === 'coming_soon'}
              onChange={(e) => onStockChange(e.target.value)}
              className="mr-2 text-teal-600"
            />
            <span className="text-sm text-gray-600">Em breve</span>
          </label>
        </div>
      </div>
    </div>
  );
}