import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Folder, Package } from 'lucide-react';
import { ProductCard } from '../../components/ProductCard';
import { ProductModal } from '../../components/ProductModal';
import { SearchBar } from '../../components/SearchBar';
import { useProducts } from '../../hooks/useProducts';
import { useToast } from '../../context/ToastContext';
import { Product } from '../../types';
import { ProductForm } from '../../components/admin/ProductForm';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { supabase } from '../../lib/supabaseClient';

interface CategoryFormData {
  name: string;
  description: string;
  color: string;
}

export function Products() {
  const { products, categories, deleteProduct, refetchCategories } = useProducts();
  const { showToast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Estados para categorias
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [categoryFormData, setCategoryFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    color: '#8B5CF6'
  });
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await deleteProduct(id);
        showToast('Produto excluído com sucesso!', 'success');
      } catch (error) {
        showToast('Erro ao excluir produto', 'error');
      }
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  // Funções para categorias
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryFormData.name.trim()) return;

    setIsCategoryLoading(true);
    try {
      if (editingCategory) {
        // Atualizar categoria
        const { error } = await supabase
          .from('categories')
          .update({
            name: categoryFormData.name,
            description: categoryFormData.description,
            color: categoryFormData.color,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingCategory.id);

        if (error) throw error;
        showToast('Categoria atualizada com sucesso!', 'success');
      } else {
        // Criar nova categoria
        const { error } = await supabase
          .from('categories')
          .insert([{
            name: categoryFormData.name,
            description: categoryFormData.description,
            color: categoryFormData.color
          }]);

        if (error) throw error;
        showToast('Categoria criada com sucesso!', 'success');
      }

      resetCategoryForm();
      refetchCategories();
    } catch (error: any) {
      showToast(error.message || 'Erro ao salvar categoria', 'error');
    } finally {
      setIsCategoryLoading(false);
    }
  };

  const resetCategoryForm = () => {
    setCategoryFormData({ name: '', description: '', color: '#8B5CF6' });
    setShowCategoryForm(false);
    setEditingCategory(null);
  };

  const handleEditCategory = (category: any) => {
    setEditingCategory(category);
    setCategoryFormData({
      name: category.name,
      description: category.description || '',
      color: category.color || '#8B5CF6'
    });
    setShowCategoryForm(true);
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta categoria?')) return;

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      showToast('Categoria excluída com sucesso!', 'success');
      refetchCategories();
    } catch (error: any) {
      showToast(error.message || 'Erro ao excluir categoria', 'error');
    }
  };

  const getCategoryProductCount = (categoryName: string) => {
    return products.filter(p => p.category === categoryName).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
          <p className="text-gray-600">Gerencie o catálogo de produtos e categorias</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowCategoryForm(true)}
            className="bg-[#183263] text-white px-4 py-2 rounded-lg hover:bg-[#3a5a8c] transition-colors flex items-center space-x-2"
          >
            <Folder className="w-5 h-5" />
            <span>Nova Categoria</span>
          </button>
          <button
            onClick={handleAdd}
            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Novo Produto</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <SearchBar
          onSearch={setSearchQuery}
          placeholder="Buscar produtos por nome, código ou categoria..."
        />
      </div>

      {/* Categories Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Categorias ({categories.length})
          </h2>
          <p className="text-sm text-gray-600">Gerencie as categorias dos produtos</p>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-8">
            <Folder className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">Nenhuma categoria encontrada</p>
            <button
              onClick={() => setShowCategoryForm(true)}
              className="bg-[#183263] text-white px-4 py-2 rounded-lg hover:bg-[#3a5a8c] transition-colors"
            >
              Criar Primeira Categoria
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <div key={category.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: category.color || '#8B5CF6' }}
                    >
                      <Folder className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{category.name}</h3>
                      {category.description && (
                        <p className="text-sm text-gray-600">{category.description}</p>
                      )}
                      <p className="text-xs text-gray-500 flex items-center mt-1">
                        <Package className="w-3 h-3 mr-1" />
                        {getCategoryProductCount(category.name)} produtos
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleEditCategory(category)}
                      className="p-2 text-gray-400 hover:text-[#183263] transition-colors"
                      title="Editar categoria"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Excluir categoria"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Products Grid */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Produtos ({filteredProducts.length})
          </h2>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Nenhum produto encontrado.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={setSelectedProduct}
                showAdminActions={true}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          isOpen={showForm}
          onClose={handleCloseForm}
        />
      )}

      {/* Category Form Modal */}
      {showCategoryForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowCategoryForm(false)} />

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleCategorySubmit}>
                <div className="bg-white px-6 pt-6 pb-4">
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900">
                      {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {editingCategory ? 'Atualize as informações da categoria' : 'Crie uma nova categoria para organizar seus produtos'}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome da Categoria *
                      </label>
                      <input
                        type="text"
                        value={categoryFormData.name}
                        onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#183263] focus:border-[#183263]"
                        placeholder="Ex: Produtos para Cabelo"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descrição
                      </label>
                      <textarea
                        value={categoryFormData.description}
                        onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#183263] focus:border-[#183263]"
                        placeholder="Descrição opcional da categoria..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cor da Categoria
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={categoryFormData.color}
                          onChange={(e) => setCategoryFormData({ ...categoryFormData, color: e.target.value })}
                          className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                        />
                        <div className="flex-1">
                          <input
                            type="text"
                            value={categoryFormData.color}
                            onChange={(e) => setCategoryFormData({ ...categoryFormData, color: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#183263] focus:border-[#183263]"
                            placeholder="#8B5CF6"
                          />
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Escolha uma cor para identificar visualmente a categoria
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={resetCategoryForm}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isCategoryLoading}
                    className="px-4 py-2 bg-[#183263] text-white rounded-md hover:bg-[#3a5a8c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isCategoryLoading ? (
                      <LoadingSpinner size="sm" className="text-white" />
                    ) : (
                      <>
                        <Folder className="w-4 h-4" />
                        <span>{editingCategory ? 'Salvar Alterações' : 'Criar Categoria'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}