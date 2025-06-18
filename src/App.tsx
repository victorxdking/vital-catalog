import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { Favorites } from './pages/Favorites';
import { Login } from './pages/Login';
import { AdminLayout } from './layouts/AdminLayout';
import { Dashboard } from './pages/admin/Dashboard';
import { Products } from './pages/admin/Products';
import { Folders } from './pages/admin/Folders';
import { Contacts } from './pages/admin/Contacts';
import { Settings } from './pages/admin/Settings';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { state } = useApp();
  
  if (!state.user || state.user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
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
              <Home />
            </>
          }
        />
        <Route
          path="/favorites"
          element={
            <>
              <Header />
              <Favorites />
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
      <AppRoutes />
    </AppProvider>
  );
}

export default App;