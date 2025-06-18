import React from 'react';
import { MessageCircle, Phone, Calendar, User } from 'lucide-react';

// Mock data for contacts
const mockContacts = [
  {
    id: '1',
    clientName: 'Maria Silva',
    clientPhone: '(11) 99999-1234',
    message: 'Gostaria de mais informações sobre os produtos de cabelo.',
    createdAt: new Date('2024-01-15T10:30:00'),
    status: 'pending' as const,
  },
  {
    id: '2',
    clientName: 'João Santos',
    clientPhone: '(11) 99999-5678',
    message: 'Preciso de orçamento para base líquida e perfumes.',
    createdAt: new Date('2024-01-14T14:20:00'),
    status: 'contacted' as const,
  },
  {
    id: '3',
    clientName: 'Ana Costa',
    clientPhone: '(11) 99999-9012',
    message: 'Quando chega o creme corporal nutritivo?',
    createdAt: new Date('2024-01-13T09:45:00'),
    status: 'completed' as const,
  },
];

export function Contacts() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Pendente
          </span>
        );
      case 'contacted':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Contatado
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Concluído
          </span>
        );
      default:
        return null;
    }
  };

  const handleWhatsApp = (phone: string, name: string) => {
    const message = `Olá ${name}! Obrigado pelo seu contato através do nosso catálogo. Como posso ajudá-lo?`;
    const cleanPhone = phone.replace(/\D/g, '');
    const whatsappUrl = `https://api.whatsapp.com/send?phone=55${cleanPhone}&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Contatos</h1>
        <p className="text-gray-600">
          Gerencie as solicitações de contato dos clientes
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <MessageCircle className="w-8 h-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pendentes</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockContacts.filter(c => c.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Phone className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Contatados</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockContacts.filter(c => c.status === 'contacted').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <User className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Concluídos</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockContacts.filter(c => c.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contacts List */}
      <div className="bg-white shadow-sm border rounded-lg">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Solicitações de Contato
          </h2>
        </div>

        <div className="divide-y divide-gray-200">
          {mockContacts.map((contact) => (
            <div key={contact.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-medium text-gray-900">
                      {contact.clientName}
                    </h3>
                    {getStatusBadge(contact.status)}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Phone className="w-4 h-4 mr-1" />
                    <span className="mr-4">{contact.clientPhone}</span>
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>
                      {contact.createdAt.toLocaleDateString('pt-BR')} às{' '}
                      {contact.createdAt.toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <p className="text-gray-700 mb-4">{contact.message}</p>
                </div>

                <div className="ml-4">
                  <button
                    onClick={() => handleWhatsApp(contact.clientPhone, contact.clientName)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Responder</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {mockContacts.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum contato encontrado
            </h3>
            <p className="text-gray-600">
              Os contatos dos clientes aparecerão aqui quando forem enviados.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}