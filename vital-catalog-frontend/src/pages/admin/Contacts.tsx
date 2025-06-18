import React, { useEffect, useState } from 'react';
import { MessageCircle, Phone, Calendar, User, Mail, Edit } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useToast } from '../../context/ToastContext';
import { LoadingSpinner } from '../../components/LoadingSpinner';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  product_id?: string;
  product_name?: string;
  status: 'pending' | 'contacted' | 'completed';
  created_at: string;
  updated_at: string;
}

export function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (error: any) {
      showToast('Erro ao carregar contatos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateContactStatus = async (id: string, status: Contact['status']) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      
      setContacts(prev => 
        prev.map(contact => 
          contact.id === id ? { ...contact, status } : contact
        )
      );
      
      showToast('Status atualizado com sucesso!', 'success');
    } catch (error: any) {
      showToast('Erro ao atualizar status', 'error');
    }
  };

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
                {contacts.filter(c => c.status === 'pending').length}
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
                {contacts.filter(c => c.status === 'contacted').length}
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
                {contacts.filter(c => c.status === 'completed').length}
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
          {contacts.map((contact) => (
            <div key={contact.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-medium text-gray-900">
                      {contact.name}
                    </h3>
                    {getStatusBadge(contact.status)}
                  </div>
                  
                  {contact.product_name && (
                    <div className="mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                        Produto: {contact.product_name}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center text-sm text-gray-500 mb-3 flex-wrap gap-4">
                    <span className="flex items-center">
                      <Phone className="w-4 h-4 mr-1" />
                      {contact.phone}
                    </span>
                    <span className="flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      {contact.email}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(contact.created_at).toLocaleDateString('pt-BR')} às{' '}
                      {new Date(contact.created_at).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <p className="text-gray-700 mb-4">{contact.message}</p>
                </div>

                <div className="ml-4 flex flex-col space-y-2">
                  <button
                    onClick={() => handleWhatsApp(contact.phone, contact.name)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Responder</span>
                  </button>
                  
                  <select
                    value={contact.status}
                    onChange={(e) => updateContactStatus(contact.id, e.target.value as Contact['status'])}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-[#183263] focus:border-[#183263]"
                  >
                    <option value="pending">Pendente</option>
                    <option value="contacted">Contatado</option>
                    <option value="completed">Concluído</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>

        {contacts.length === 0 && (
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