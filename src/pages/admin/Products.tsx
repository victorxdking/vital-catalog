import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { ProductCard } from '../../components/ProductCard';
import { ProductModal } from '../../components/ProductModal';
import { SearchBar } from '../../components/SearchBar';
import { useProducts } from '../../hooks/useProducts';
import { Product } from '../../types';
import { ProductForm } from '../../components/admin/ProductForm';

export function Products() {
  const { products, deleteProduct } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      deleteProduct(id);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
          <p className="text-gray-600">Gerencie o catálogo de produtos</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Novo Produto</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <SearchBar
          onSearch={setSearchQuery}
          placeholder="Buscar produtos por nome, código ou categoria..."
        />
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
    </div>
  );
}