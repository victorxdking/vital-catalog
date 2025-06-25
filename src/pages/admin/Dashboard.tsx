import React, { useEffect, useState } from 'react';
import { BarChart3, Users, Package, Eye, TrendingUp, MessageCircle, Heart, Clock, User } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { supabase } from '../../lib/supabaseClient';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { useNotifications } from '../../context/NotificationContext';
import { Link } from 'react-router-dom';
import { Contact } from '../../types';

export function Dashboard() {
  const { products, categories } = useProducts();
  const [loading, setLoading] = useState(true);
  const [recentContacts, setRecentContacts] = useState<Contact[]>([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    totalFavorites: 0,
    totalContacts: 0
  });
  const { unreadContacts } = useNotifications();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [favoritesResult, contactsResult, recentContactsResult] = await Promise.all([
        supabase.from('favorites').select('id', { count: 'exact', head: true }),
        supabase.from('contacts').select('id', { count: 'exact', head: true }),
        supabase.from('contacts').select('*').order('created_at', { ascending: false }).limit(5)
      ]);

      // Contar usuários únicos pelos favoritos (estimativa)
      const { data: uniqueUsers } = await supabase
        .from('favorites')
        .select('user_id')
        .then(result => ({
          ...result,
          data: result.data ? [...new Set(result.data.map(f => f.user_id))] : []
        }));

      setDashboardStats({
        totalUsers: uniqueUsers?.length || 0,
        totalFavorites: favoritesResult.count || 0,
        totalContacts: contactsResult.count || 0
      });

      setRecentContacts(recentContactsResult.data || []);
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalProducts: products.length,
    availableProducts: products.filter(p => p.stock === 'available').length,
    outOfStock: products.filter(p => p.stock === 'out_of_stock').length,
    comingSoon: products.filter(p => p.stock === 'coming_soon').length,
    ...dashboardStats
  };

  const topProducts = products
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  const categoryStats = categories.map(category => ({
    name: category.name,
    count: products.filter(p => p.category === category.name).length,
    color: '#3B82F6' // Cor padrão
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" className="text-[#183263]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Visão geral do sistema e estatísticas</p>
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
                              <p className="text-3xl font-bold text-gray-900">{products.reduce((sum, product) => sum + product.views, 0)}</p>
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

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Usuários</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
            <Users className="w-12 h-12 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Favoritos</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalFavorites}</p>
            </div>
            <Heart className="w-12 h-12 text-red-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Contatos</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalContacts}</p>
            </div>
            <MessageCircle className="w-12 h-12 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Em Breve</p>
              <p className="text-3xl font-bold text-gray-900">{stats.comingSoon}</p>
            </div>
            <TrendingUp className="w-12 h-12 text-yellow-600" />
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
      {/* Contatos Recentes */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <MessageCircle className="w-5 h-5 mr-2 text-emerald-600" />
            Contatos Recentes
            {unreadContacts > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {unreadContacts} novos
              </span>
            )}
          </h2>
          <Link
            to="/admin/contacts"
            className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
          >
            Ver todos
          </Link>
        </div>

        {recentContacts.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum contato recente</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentContacts.map((contact) => (
              <div key={contact.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex items-center text-sm font-medium text-gray-900">
                        <User className="w-4 h-4 mr-1" />
                        {contact.name}
                      </div>
                      {contact.status === 'pending' && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                          Pendente
                        </span>
                      )}
                    </div>
                    
                    {contact.product_name && (
                      <div className="text-sm text-emerald-600 mb-1">
                        Produto: {contact.product_name}
                      </div>
                    )}
                    
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {contact.message}
                    </p>
                    
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {contact.created_at && new Date(contact.created_at).toLocaleDateString('pt-BR')} às{' '}
                      {contact.created_at && new Date(contact.created_at).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                  
                  <Link
                    to="/admin/contacts"
                    className="ml-4 text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                  >
                    Ver
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}