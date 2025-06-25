import React, { useEffect } from 'react';
import { X, Heart, HeartOff, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'favorite' | 'unfavorite';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type, isVisible, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      case 'favorite':
        return <Heart className="w-5 h-5 text-red-500 fill-current" />;
      case 'unfavorite':
        return <HeartOff className="w-5 h-5 text-gray-500" />;
      default:
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
      case 'favorite':
        return 'bg-white border-emerald-200';
      case 'error':
        return 'bg-white border-red-200';
      case 'info':
        return 'bg-white border-blue-200';
      case 'unfavorite':
        return 'bg-white border-gray-200';
      default:
        return 'bg-white border-emerald-200';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
      <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg shadow-lg border-l-4 ${getBgColor()}`}>
        {getIcon()}
        <p className="text-sm font-medium text-gray-900">{message}</p>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
} 