import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';
import { NotificationProvider } from './context/NotificationContext';
import { useAuth } from './hooks/useAuth';
import { Header } from './components/Header';
import { FloatingChat } from './components/FloatingChat';
import { Home } from './pages/Home';
import { Favorites } from './pages/Favorites';
import { Login } from './pages/Login';
import { AdminLayout } from './layouts/AdminLayout';
import { Dashboard } from './pages/admin/Dashboard';
import { Products } from './pages/admin/Products';
import { Folders } from './pages/admin/Folders';
import { Contacts } from './pages/admin/Contacts';
import { Settings } from './pages/admin/Settings';
import { Product } from './types';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#183263] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando acesso...</p>
        </div>
      </div>
    );
  }
  
  // Só redireciona se não estiver loading e não for admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Public Routes with Header */}
        <Route
          path="/"
          element={
            <>
              <Header />
              <Home onProductInterest={setSelectedProduct} />
              <FloatingChat 
                selectedProduct={selectedProduct} 
                onProductClear={() => setSelectedProduct(null)} 
              />
            </>
          }
        />
        <Route
          path="/favorites"
          element={
            <>
              <Header />
              <Favorites onProductInterest={setSelectedProduct} />
              <FloatingChat 
                selectedProduct={selectedProduct} 
                onProductClear={() => setSelectedProduct(null)} 
              />
            </>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="folders" element={<Folders />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <NotificationProvider>
          <AppRoutes />
        </NotificationProvider>
      </ToastProvider>
    </AppProvider>
  );
}

export default App;