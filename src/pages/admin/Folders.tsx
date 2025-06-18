import React, { useState } from 'react';
import { FileText, Download, Plus, Check } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { ProductCard } from '../../components/ProductCard';

export function Folders() {
  const { products } = useProducts();
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [folderName, setFolderName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const selectAllProducts = () => {
    setSelectedProducts(products.map(p => p.id));
  };

  const clearSelection = () => {
    setSelectedProducts([]);
  };

  const generateFolder = async () => {
    if (selectedProducts.length === 0 || !folderName) return;

    setIsGenerating(true);
    
    // Simulate folder generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create a simple text-based "folder" for demo purposes
    const selectedProductsData = products.filter(p => selectedProducts.includes(p.id));
    const folderContent = `
FOLDER DIGITAL - ${folderName}
=====================================

${selectedProductsData.map(product => `
Produto: ${product.name}
Categoria: ${product.category}
Código: ${product.code}
Referência: ${product.reference}
Status: ${product.stock === 'available' ? 'Disponível' : product.stock === 'out_of_stock' ? 'Esgotado' : 'Em breve'}
Descrição: ${product.description}
Visualizações: ${product.views}
---
`).join('')}

Total de produtos: ${selectedProductsData.length}
Data de geração: ${new Date().toLocaleDateString('pt-BR')}
`.trim();

    // Download the folder as a text file
    const blob = new Blob([folderContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${folderName}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setIsGenerating(false);
    setSelectedProducts([]);
    setFolderName('');

    alert('Folder digital gerado com sucesso!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Folders Digitais</h1>
        <p className="text-gray-600">
          Crie folders personalizados com produtos selecionados para enviar aos clientes
        </p>
      </div>

      {/* Folder Generator */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Criar Novo Folder
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Folder
            </label>
            <input
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
              placeholder="Ex: Produtos de Cabelo - Janeiro 2024"
            />
          </div>
          
          <div className="flex items-end space-x-2">
            <button
              onClick={selectAllProducts}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Selecionar Todos
            </button>
            <button
              onClick={clearSelection}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Limpar
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-600">
            {selectedProducts.length} produto(s) selecionado(s)
          </span>
          <button
            onClick={generateFolder}
            disabled={selectedProducts.length === 0 || !folderName || isGenerating}
            className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Gerando...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Gerar Folder</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Products Selection */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Selecionar Produtos
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="relative">
              <div
                className={`border-2 rounded-lg transition-colors ${
                  selectedProducts.includes(product.id)
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-transparent'
                }`}
              >
                <ProductCard product={product} />
                
                {/* Selection Overlay */}
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity cursor-pointer rounded-lg"
                  onClick={() => toggleProductSelection(product.id)}
                >
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                    selectedProducts.includes(product.id)
                      ? 'bg-teal-600 border-teal-600 text-white'
                      : 'bg-white border-gray-300'
                  }`}>
                    {selectedProducts.includes(product.id) && (
                      <Check className="w-5 h-5" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}