import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Contact } from '../types';

interface NotificationContextType {
  unreadContacts: number;
  latestContacts: Contact[];
  newContactNotification: Contact | null;
  markAsRead: (contactId: string) => void;
  clearNotification: () => void;
  refetch: () => void;
  setEnabled: (enabled: boolean) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [unreadContacts, setUnreadContacts] = useState(0);
  const [latestContacts, setLatestContacts] = useState<Contact[]>([]);
  const [newContactNotification, setNewContactNotification] = useState<Contact | null>(null);
  const [enabled, setEnabled] = useState(false);

  const fetchUnreadContacts = useCallback(async () => {
    // Só buscar se estiver habilitado
    if (!enabled) {
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setUnreadContacts(data?.length || 0);
      setLatestContacts(data?.slice(0, 5) || []);
    } catch (error) {
      console.error('Erro ao buscar contatos não lidos:', error);
    }
  }, [enabled]);

  useEffect(() => {
    if (enabled) {
      fetchUnreadContacts();
    } else {
      // Limpar dados quando desabilitado
      setUnreadContacts(0);
      setLatestContacts([]);
      setNewContactNotification(null);
    }
  }, [enabled, fetchUnreadContacts]);

  useEffect(() => {
    // Só configurar listeners se estiver habilitado
    if (!enabled) {
      return;
    }

    // Configurar listener para novos contatos e atualizações
    const contactsSubscription = supabase
      .channel('contacts-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'contacts'
        },
        (payload) => {
          const newContact = payload.new as Contact;
          setUnreadContacts(prev => prev + 1);
          setLatestContacts(prev => [newContact, ...prev.slice(0, 4)]);
          setNewContactNotification(newContact);
          
          // Limpar notificação após 5 segundos
          setTimeout(() => {
            setNewContactNotification(null);
          }, 5000);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'contacts'
        },
        (payload) => {
          const updatedContact = payload.new as Contact;
          const oldContact = payload.old as Contact;
          
          // Se mudou de pending para outro status, diminuir contador
          if (oldContact.status === 'pending' && updatedContact.status !== 'pending') {
            setUnreadContacts(prev => Math.max(0, prev - 1));
            setLatestContacts(prev => prev.filter(contact => contact.id !== updatedContact.id));
          }
          // Se mudou de outro status para pending, aumentar contador
          else if (oldContact.status !== 'pending' && updatedContact.status === 'pending') {
            setUnreadContacts(prev => prev + 1);
            setLatestContacts(prev => [updatedContact, ...prev.slice(0, 4)]);
          }
        }
      )
      .subscribe();

    return () => {
      contactsSubscription.unsubscribe();
    };
  }, [enabled]);

  const markAsRead = (contactId: string) => {
    setLatestContacts(prev => 
      prev.filter(contact => contact.id !== contactId)
    );
    setUnreadContacts(prev => Math.max(0, prev - 1));
  };

  const clearNotification = () => {
    setNewContactNotification(null);
  };

  return (
    <NotificationContext.Provider value={{
      unreadContacts,
      latestContacts,
      newContactNotification,
      markAsRead,
      clearNotification,
      refetch: fetchUnreadContacts,
      setEnabled
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
} 