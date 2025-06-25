import React, { createContext, useContext, useState } from 'react';
import { Toast } from '../components/Toast';

interface ToastData {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'favorite' | 'unfavorite';
  isVisible: boolean;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastData['type']) => void;
  showFavoriteToast: (productName: string, isFavorited: boolean) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = (message: string, type: ToastData['type'] = 'success') => {
    const id = Date.now().toString();
    const newToast: ToastData = {
      id,
      message,
      type,
      isVisible: true
    };

    setToasts(prev => [...prev, newToast]);
  };

  const hideToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showFavoriteToast = (productName: string, isFavorited: boolean) => {
    const message = isFavorited 
      ? `${productName} adicionado aos favoritos!`
      : `${productName} removido dos favoritos!`;
    const type = isFavorited ? 'favorite' : 'unfavorite';
    showToast(message, type);
  };

  return (
    <ToastContext.Provider value={{ showToast, showFavoriteToast }}>
      {children}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={() => hideToast(toast.id)}
        />
      ))}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
} 