import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, LogOut, Menu, Heart, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface HeaderProps {
  onMenuToggle?: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const { state, dispatch } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: 'SET_USER', payload: null });
    navigate('/');
  };

  const isAdminArea = location.pathname.startsWith('/admin');

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          <div className="flex items-center space-x-4">
            {isAdminArea && (
              <button
                onClick={onMenuToggle}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            <Link to="/" className="flex items-center space-x-4">
              <img 
                src="/vital_cosmeticos.png" 
                alt="Vital Cosméticos" 
                className="w-20 h-20 object-contain"
              />
              <span className="text-2xl font-bold text-gray-900">
                Vital Cosméticos
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            {!isAdminArea && (
              <>
                <Link
                  to="/"
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === '/'
                      ? 'text-teal-600'
                      : 'text-gray-700 hover:text-teal-600'
                  }`}
                >
                  Catálogo
                </Link>
                <Link
                  to="/favorites"
                  className={`flex items-center space-x-1 text-sm font-medium transition-colors ${
                    location.pathname === '/favorites'
                      ? 'text-teal-600'
                      : 'text-gray-700 hover:text-teal-600'
                  }`}
                >
                  <Heart className="w-4 h-4" />
                  <span>Favoritos</span>
                  {state.favorites.length > 0 && (
                    <span className="ml-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {state.favorites.length}
                    </span>
                  )}
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {!isAdminArea && (
              <Link
                to="/search"
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Search className="w-5 h-5" />
              </Link>
            )}
            
            {state.user ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">
                  Olá, {state.user.name}
                </span>
                {state.user.role === 'admin' && !isAdminArea && (
                  <Link
                    to="/admin"
                    className="bg-teal-600 text-white px-3 py-1 rounded-md text-sm hover:bg-teal-700 transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-1 bg-teal-600 text-white px-4 py-2 rounded-md text-sm hover:bg-teal-700 transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Entrar</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}