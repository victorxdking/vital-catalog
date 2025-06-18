import React from 'react';
import { BarChart3, Users, Package, Eye, TrendingUp, MessageCircle } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { useApp } from '../../context/AppContext';

export function Dashboard() {
  const { products } = useProducts();
  const { state } = useApp();

  const stats = {
    totalProducts: products.length,
    totalViews: products.reduce((sum, product) => sum + product.views, 0),
    availableProducts: products.filter(p => p.stock === 'available').length,
    outOfStock: products.filter(p => p.stock === 'out_of_stock').length,
    comingSoon: products.filter(p => p.stock === 'coming_soon').length,
    favoriteCount: state.favorites.length,
  };

  const topProducts = products
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  const categoryStats = state.categories.map(category => ({
    name: category.name,
    count: products.filter(p => p.category === category.name).length,
    color: category.color,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Visão geral do catálogo de produtos</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Produtos</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
            </div>
            <Package className="w-12 h-12 text-teal-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Visualizações</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalViews}</p>
            </div>
            <Eye className="w-12 h-12 text-emerald-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Disponíveis</p>
              <p className="text-3xl font-bold text-gray-900">{stats.availableProducts}</p>
            </div>
            <TrendingUp className="w-12 h-12 text-cyan-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Esgotados</p>
              <p className="text-3xl font-bold text-gray-900">{stats.outOfStock}</p>
            </div>
            <BarChart3 className="w-12 h-12 text-red-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Produtos Mais Visualizados
          </h2>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.id} className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-teal-600">
                    {index + 1}
                  </span>
                </div>
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {product.name}
                  </p>
                  <p className="text-sm text-gray-500">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {product.views}
                  </p>
                  <p className="text-xs text-gray-500">visualizações</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Produtos por Categoria
          </h2>
          <div className="space-y-4">
            {categoryStats.map((category) => (
              <div key={category.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-sm font-medium text-gray-900">
                    {category.name}
                  </span>
                </div>
                <span className="text-sm text-gray-600">{category.count} produtos</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stock Status */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Status do Estoque
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-emerald-50 rounded-lg">
            <p className="text-2xl font-bold text-emerald-600">{stats.availableProducts}</p>
            <p className="text-sm text-emerald-700">Disponíveis</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-2xl font-bold text-red-600">{stats.outOfStock}</p>
            <p className="text-sm text-red-700">Esgotados</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-2xl font-bold text-yellow-600">{stats.comingSoon}</p>
            <p className="text-sm text-yellow-700">Em breve</p>
          </div>
        </div>
      </div>
    </div>
  );
}