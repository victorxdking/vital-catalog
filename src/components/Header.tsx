import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useFavorites } from '../context/FavoritesContext';

interface HeaderProps {
  onMenuToggle?: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const { user, signOut } = useAuth();
  const { favoritesCount } = useFavorites();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = async () => {
    await signOut();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <header className="bg-[#183263] shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo à esquerda */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="/vital_cosmeticos.png" 
                alt="Vital" 
                className="h-14 w-auto object-contain"
              />
            </Link>
          </div>
          
          {/* Menu central */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-white hover:text-[#7ed957] transition-colors font-medium text-sm uppercase tracking-wide"
            >
              HOME
            </Link>
            <Link 
              to="/sobre" 
              className="text-white hover:text-[#7ed957] transition-colors font-medium text-sm uppercase tracking-wide"
            >
              QUEM SOMOS
            </Link>
            <Link 
              to="/" 
              className="text-white hover:text-[#7ed957] transition-colors font-medium text-sm uppercase tracking-wide"
            >
              CATÁLOGO
            </Link>
            
            {/* Favoritos com coração */}
            {user && (
              <Link 
                to="/favoritos" 
                className="text-white hover:text-[#7ed957] transition-colors font-medium text-sm uppercase tracking-wide flex items-center space-x-1"
              >
                <Heart className="w-4 h-4" />
                <span>FAVORITOS</span>
                {favoritesCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-1">
                    {favoritesCount}
                  </span>
                )}
              </Link>
            )}
            
            <Link 
              to="/carreiras" 
              className="text-white hover:text-[#7ed957] transition-colors font-medium text-sm uppercase tracking-wide"
            >
              TRABALHE CONOSCO
            </Link>
          </nav>
          
          {/* Área do usuário à direita */}
          <div className="flex items-center space-x-4">
            {/* Desktop User Menu */}
            <div className="hidden md:block">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="text-white hover:text-[#7ed957] transition-colors font-medium text-sm flex items-center space-x-2"
                  >
                    <span>Olá, {user.name || user.email?.split('@')[0]}</span>
                    <User className="w-4 h-4" />
                  </button>
                  
                  {/* Dropdown do usuário */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      {user.email?.includes('admin') && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Painel Admin
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="w-4 h-4 inline mr-2" />
                        Sair
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="text-white hover:text-[#7ed957] transition-colors font-medium text-sm flex items-center space-x-2"
                >
                  <User className="w-4 h-4" />
                  <span>Entrar</span>
                </Link>
              )}
            </div>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden text-white hover:text-[#7ed957] transition-colors p-2"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {showMobileMenu && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setShowMobileMenu(false)}
          />
          
          <div className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden">
            {/* Mobile Header */}
            <div className="bg-[#183263] text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img 
                  src="/vital_cosmeticos.png" 
                  alt="Vital" 
                  className="h-10 w-auto object-contain"
                />
                <span className="font-bold text-lg">Menu</span>
              </div>
              <button
                onClick={() => setShowMobileMenu(false)}
                className="p-2 hover:bg-[#25407a] rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile User Section */}
            <div className="p-6 border-b border-gray-200">
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-[#183263] rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Olá, {user.name || user.email?.split('@')[0]}!</p>
                    <p className="text-gray-600 text-sm truncate max-w-[200px]">{user.email}</p>
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setShowMobileMenu(false)}
                  className="w-full bg-[#183263] text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">Fazer Login</span>
                </Link>
              )}
            </div>

            {/* Mobile Navigation */}
            <nav className="flex-1 py-6">
              <div className="space-y-2 px-6">
                <Link
                  to="/"
                  onClick={() => setShowMobileMenu(false)}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-gray-700 font-medium">HOME</span>
                </Link>

                <Link
                  to="/sobre"
                  onClick={() => setShowMobileMenu(false)}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-gray-700 font-medium">QUEM SOMOS</span>
                </Link>

                <Link
                  to="/"
                  onClick={() => setShowMobileMenu(false)}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-gray-700 font-medium">CATÁLOGO</span>
                </Link>

                {user && (
                  <Link
                    to="/favoritos"
                    onClick={() => setShowMobileMenu(false)}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Heart className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-700 font-medium">FAVORITOS</span>
                    </div>
                    {favoritesCount > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] h-5 flex items-center justify-center">
                        {favoritesCount}
                      </span>
                    )}
                  </Link>
                )}

                <Link
                  to="/carreiras"
                  onClick={() => setShowMobileMenu(false)}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-gray-700 font-medium">TRABALHE CONOSCO</span>
                </Link>

                {user?.email?.includes('admin') && (
                  <div className="pt-4 border-t border-gray-200 mt-4">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide px-3 mb-2">
                      Administração
                    </p>
                    <Link
                      to="/admin"
                      onClick={() => setShowMobileMenu(false)}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-[#7ed957]/10 transition-colors"
                    >
                      <span className="text-gray-700 font-medium">Painel Admin</span>
                    </Link>
                  </div>
                )}
              </div>
            </nav>

            {/* Mobile Footer */}
            {user && (
              <div className="p-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    handleLogout();
                    setShowMobileMenu(false);
                  }}
                  className="w-full bg-red-50 hover:bg-red-100 text-red-600 py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sair da Conta</span>
                </button>
              </div>
            )}
          </div>
        </>
      )}
      
      {/* Backdrop para fechar menu do usuário */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  );
}