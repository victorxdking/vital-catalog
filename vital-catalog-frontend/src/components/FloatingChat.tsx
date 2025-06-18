import React, { useState } from 'react';
import { MessageCircle, X, Send, Minimize2, Package } from 'lucide-react';
import { Product, Contact } from '../types';
import { supabase } from '../lib/supabaseClient';
import { useToast } from '../context/ToastContext';
import { useProducts } from '../hooks/useProducts';

interface FloatingChatProps {
  selectedProduct?: Product | null;
  onProductClear?: () => void;
}

export function FloatingChat({ selectedProduct, onProductClear }: FloatingChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showProductSelector, setShowProductSelector] = useState(false);
  const [internalSelectedProduct, setInternalSelectedProduct] = useState<Product | null>(selectedProduct || null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: selectedProduct 
      ? `Olá! Tenho interesse no produto ${selectedProduct.name} (Código: ${selectedProduct.code}). Gostaria de mais informações.`
      : 'Olá! Gostaria de mais informações sobre os produtos.'
  });
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const { products } = useProducts();

  // Atualizar mensagem quando produto selecionado mudar
  React.useEffect(() => {
    if (selectedProduct) {
      setInternalSelectedProduct(selectedProduct);
      setFormData(prev => ({
        ...prev,
        message: `Olá! Tenho interesse no produto ${selectedProduct.name} (Código: ${selectedProduct.code}). Gostaria de mais informações.`
      }));
      setIsOpen(true);
      setIsMinimized(false);
    }
  }, [selectedProduct]);

  const currentProduct = internalSelectedProduct || selectedProduct;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const contactData: Contact = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        product_id: currentProduct?.id,
        product_name: currentProduct?.name,
        status: 'pending'
      };

      const { error } = await supabase
        .from('contacts')
        .insert([contactData]);

      if (error) throw error;

      showToast('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
      
      // Enviar pelo WhatsApp também
      const whatsappMessage = currentProduct
        ? `*Interesse via catálogo*\n\n*Cliente:* ${formData.name}\n*Email:* ${formData.email}\n*Telefone:* ${formData.phone}\n*Produto:* ${currentProduct.name} (${currentProduct.code})\n\n*Mensagem:*\n${formData.message}`
        : `*Contato via catálogo*\n\n*Cliente:* ${formData.name}\n*Email:* ${formData.email}\n*Telefone:* ${formData.phone}\n\n*Mensagem:*\n${formData.message}`;
      
      const whatsappUrl = `https://api.whatsapp.com/send?phone=5511999999999&text=${encodeURIComponent(whatsappMessage)}`;
      window.open(whatsappUrl, '_blank');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: 'Olá! Gostaria de mais informações sobre os produtos.'
      });
      
      setIsOpen(false);
      setInternalSelectedProduct(null);
      onProductClear?.();
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      showToast('Erro ao enviar mensagem. Tente novamente.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleClose = () => {
    setIsOpen(false);
    setInternalSelectedProduct(null);
    onProductClear?.();
  };

  const handleClearProduct = () => {
    setInternalSelectedProduct(null);
    setFormData(prev => ({
      ...prev,
      message: 'Olá! Gostaria de mais informações sobre os produtos.'
    }));
    onProductClear?.();
  };

  const handleSelectProduct = (product: Product) => {
    setInternalSelectedProduct(product);
    setFormData(prev => ({
      ...prev,
      message: `Olá! Tenho interesse no produto ${product.name} (Código: ${product.code}). Gostaria de mais informações.`
    }));
    setShowProductSelector(false);
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setIsOpen(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 group"
          >
            <MessageCircle className="w-6 h-6" />
            <span className="hidden group-hover:inline-block whitespace-nowrap bg-emerald-600 px-3 py-1 rounded-full text-sm font-medium -ml-2">
              Fale Conosco
            </span>
          </button>
          
          {currentProduct && (
            <div className="absolute -top-2 -left-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
              1
            </div>
          )}
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed bottom-6 right-6 w-80 bg-white rounded-lg shadow-2xl border z-50 transition-all duration-300 ${
          isMinimized ? 'h-14' : 'h-96'
        }`}>
          {/* Header */}
          <div className="bg-emerald-500 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5" />
              <h3 className="font-semibold">Fale Conosco</h3>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:text-emerald-200 transition-colors"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleClose}
                className="text-white hover:text-emerald-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          {!isMinimized && (
            <div className="p-4 h-80 overflow-y-auto">
              {/* Botão Selecionar Produto */}
              {!currentProduct && (
                <div className="mb-4">
                  <button
                    onClick={() => setShowProductSelector(!showProductSelector)}
                    className="w-full px-3 py-2 border-2 border-dashed border-emerald-300 text-emerald-600 rounded-lg hover:border-emerald-400 hover:text-emerald-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Package className="w-4 h-4" />
                    <span>Selecionar Produto</span>
                  </button>
                </div>
              )}

              {/* Seletor de Produtos */}
              {showProductSelector && (
                <div className="mb-4 max-h-32 overflow-y-auto border border-gray-200 rounded-lg">
                  {products.slice(0, 10).map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleSelectProduct(product)}
                      className="w-full p-2 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center space-x-2"
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-8 h-8 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-900 truncate">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.code}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Produto Selecionado */}
              {currentProduct && (
                <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <img
                        src={currentProduct.images[0]}
                        alt={currentProduct.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <div>
                        <p className="text-sm font-medium text-teal-900">{currentProduct.name}</p>
                        <p className="text-xs text-teal-600">Código: {currentProduct.code}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleClearProduct}
                      className="text-teal-500 hover:text-teal-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Formulário */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Seu nome"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Seu e-mail"
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Seu telefone/WhatsApp"
                  />
                </div>

                <div>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                    placeholder="Sua mensagem..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Enviar</span>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-3 text-xs text-gray-500 text-center">
                💬 Responderemos em breve via WhatsApp!
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
} 