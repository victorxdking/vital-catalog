import React, { useEffect, useState } from 'react';
import { MessageCircle, Phone, Calendar, User, Mail, Edit, Trash2, Eye } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useToast } from '../../context/ToastContext';
import { useNotifications } from '../../context/NotificationContext';
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
  updated_at?: string;
}

export function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'contacted' | 'completed'>('all');
  const { showToast } = useToast();
  const { refetch } = useNotifications();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar contatos:', error);
        showToast('Erro ao carregar contatos', 'error');
        return;
      }

      setContacts(data || []);
    } catch (error) {
      console.error('Erro ao buscar contatos:', error);
      showToast('Erro ao carregar contatos', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const updateContactStatus = async (contactId: string, newStatus: Contact['status']) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', contactId);

      if (error) throw error;

      setContacts(prev => 
        prev.map(contact => 
          contact.id === contactId 
            ? { ...contact, status: newStatus, updated_at: new Date().toISOString() }
            : contact
        )
      );

      // Atualizar contexto de notificações
      refetch();

      showToast('Status atualizado com sucesso', 'success');
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      showToast('Erro ao atualizar status', 'error');
    }
  };

  const deleteContact = async (contactId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este contato?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', contactId);

      if (error) throw error;

      setContacts(prev => prev.filter(contact => contact.id !== contactId));
      
      // Atualizar contexto de notificações
      refetch();
      
      showToast('Contato excluído com sucesso', 'success');
    } catch (error) {
      console.error('Erro ao excluir contato:', error);
      showToast('Erro ao excluir contato', 'error');
    }
  };

  const filteredContacts = contacts.filter(contact => {
    if (filter === 'all') return true;
    return contact.status === filter;
  });

  const getStatusColor = (status: Contact['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'contacted': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Contact['status']) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'contacted': return 'Contatado';
      case 'completed': return 'Concluído';
      default: return 'Desconhecido';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Data inválida';
    }
  };

  const openWhatsApp = (contact: Contact) => {
    const message = contact.product_name
      ? `Olá ${contact.name}! Vi seu interesse no produto ${contact.product_name}. Como posso ajudar?`
      : `Olá ${contact.name}! Vi sua mensagem e gostaria de ajudar. Como posso auxiliá-lo?`;
    
    const phone = contact.phone.replace(/\D/g, '');
    const whatsappUrl = `https://api.whatsapp.com/send?phone=55${phone}&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Contatos</h1>
          <p className="text-gray-600">Gerencie os contatos recebidos</p>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
          {(['all', 'pending', 'contacted', 'completed'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status === 'all' ? 'Todos' : getStatusText(status)}
              <span className="ml-2 px-2 py-1 text-xs bg-white bg-opacity-20 rounded-full">
                {status === 'all' ? contacts.length : contacts.filter(c => c.status === status).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {filteredContacts.length === 0 ? (
        <div className="text-center py-12">
          <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filter === 'all' ? 'Nenhum contato encontrado' : `Nenhum contato ${getStatusText(filter).toLowerCase()}`}
          </h3>
          <p className="text-gray-500">
            {filter === 'all' 
              ? 'Os contatos aparecerão aqui quando os clientes entrarem em contato.'
              : 'Não há contatos com este status no momento.'
            }
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredContacts.map((contact) => (
            <div key={contact.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center text-gray-900">
                      <User className="w-5 h-5 mr-2 text-gray-500" />
                      <span className="font-semibold">{contact.name}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(contact.status)}`}>
                      {getStatusText(contact.status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div className="flex items-center text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      <span className="text-sm">{contact.email}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      <span className="text-sm">{contact.phone}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="text-sm">{formatDate(contact.created_at)}</span>
                    </div>
                    {contact.product_name && (
                      <div className="flex items-center text-gray-600">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        <span className="text-sm">Produto: {contact.product_name}</span>
                      </div>
                    )}
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-700">{contact.message}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 lg:flex-col">
                  <button
                    onClick={() => openWhatsApp(contact)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    WhatsApp
                  </button>

                  <div className="flex gap-2">
                    <select
                      value={contact.status}
                      onChange={(e) => updateContactStatus(contact.id, e.target.value as Contact['status'])}
                      className="px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#7ed957] focus:border-[#7ed957] bg-white hover:border-gray-400 transition-colors appearance-none cursor-pointer min-w-[120px]"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: 'right 0.5rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1.5em 1.5em',
                        paddingRight: '2.5rem'
                      }}
                    >
                      <option value="pending">Pendente</option>
                      <option value="contacted">Contatado</option>
                      <option value="completed">Concluído</option>
                    </select>

                    <button
                      onClick={() => deleteContact(contact.id)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Excluir contato"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}