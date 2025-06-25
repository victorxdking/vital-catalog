import React, { useState } from 'react';
import { X, Gift, Star, Sparkles } from 'lucide-react';

interface PromoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PromoModal({ isOpen, onClose }: PromoModalProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    
    // Simular envio do email (aqui você pode integrar com sua API)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSuccess(true);
    setIsSubmitting(false);
    
    // Fechar modal após 3 segundos
    setTimeout(() => {
      onClose();
      setIsSuccess(false);
      setEmail('');
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-bounce-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-[#183263] to-[#7ed957] text-white p-6 text-center relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full">
            <Sparkles className="absolute top-2 left-4 w-4 h-4 text-yellow-300 animate-pulse" />
            <Star className="absolute top-4 right-8 w-3 h-3 text-yellow-300 animate-pulse delay-300" />
            <Sparkles className="absolute bottom-4 right-4 w-4 h-4 text-yellow-300 animate-pulse delay-700" />
            <Star className="absolute bottom-2 left-8 w-3 h-3 text-yellow-300 animate-pulse delay-500" />
          </div>
          
          <div className="relative z-10">
            <Gift className="w-12 h-12 mx-auto mb-3 text-yellow-300" />
            <h2 className="text-2xl font-bold mb-2">🎉 OFERTA ESPECIAL!</h2>
            <p className="text-lg font-semibold">Ganhe 15% OFF</p>
            <p className="text-sm opacity-90">no seu primeiro pedido</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {!isSuccess ? (
            <>
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Cadastre-se agora e economize!
                </h3>
                <p className="text-gray-600 text-sm">
                  Seja o primeiro a saber sobre nossas promoções exclusivas e 
                  receba <span className="font-bold text-[#7ed957]">15% de desconto</span> na sua primeira compra.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="email"
                    placeholder="Digite seu melhor e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7ed957] focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting || !email}
                  className="w-full bg-gradient-to-r from-[#7ed957] to-[#183263] text-white py-3 px-6 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Cadastrando...</span>
                    </div>
                  ) : (
                    '🎁 QUERO MEU DESCONTO!'
                  )}
                </button>
              </form>

              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  * Válido apenas para novos clientes. Desconto aplicado automaticamente.
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-green-600 mb-2">
                🎉 Parabéns!
              </h3>
              <p className="text-gray-600 mb-4">
                Seu desconto de <span className="font-bold text-[#7ed957]">15%</span> foi enviado para seu e-mail!
              </p>
              <p className="text-sm text-gray-500">
                Verifique sua caixa de entrada e spam.
              </p>
            </div>
          )}
        </div>

        {/* Bottom decoration */}
        <div className="h-2 bg-gradient-to-r from-[#7ed957] to-[#183263]"></div>
      </div>
    </div>
  );
} 