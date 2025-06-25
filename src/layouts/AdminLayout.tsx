import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Sidebar } from '../components/admin/Sidebar';
import { NotificationToast } from '../components/NotificationToast';
import { useNotifications } from '../context/NotificationContext';

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { newContactNotification, clearNotification } = useNotifications();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 lg:ml-0">
          <div className="p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Notificação de Novo Contato */}
      {newContactNotification && (
        <NotificationToast
          contact={newContactNotification}
          isVisible={!!newContactNotification}
          onClose={clearNotification}
          onViewContact={() => {
            navigate('/admin/contacts');
            clearNotification();
          }}
        />
      )}
    </div>
  );
}