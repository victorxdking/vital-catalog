import React from 'react';
import { MessageCircle, X, User, Package } from 'lucide-react';
import { Contact } from '../types';

interface NotificationToastProps {
  contact: Contact;
  isVisible: boolean;
  onClose: () => void;
  onViewContact: () => void;
}

export function NotificationToast({ contact, isVisible, onClose, onViewContact }: NotificationToastProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
      <div className="bg-white border border-emerald-200 rounded-lg shadow-lg p-4 max-w-sm">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-semibold text-gray-900">
                Nova Mensagem!
              </h4>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center text-sm text-gray-600">
                <User className="w-3 h-3 mr-1" />
                <span className="truncate">{contact.name}</span>
              </div>
              
              {contact.product_name && (
                <div className="flex items-center text-sm text-gray-600">
                  <Package className="w-3 h-3 mr-1" />
                  <span className="truncate">{contact.product_name}</span>
                </div>
              )}
              
              <p className="text-xs text-gray-500 line-clamp-2">
                {contact.message}
              </p>
            </div>
            
            <div className="flex space-x-2 mt-3">
              <button
                onClick={onViewContact}
                className="flex-1 bg-emerald-600 text-white text-xs px-3 py-1.5 rounded hover:bg-emerald-700 transition-colors"
              >
                Ver Contato
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded hover:bg-gray-200 transition-colors"
              >
                Dispensar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 