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
    <header className="bg-[#183263] border-b-2 border-[#3a5a8c] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24 md:h-28">
          <div className="flex-1 flex items-center justify-center md:justify-start">
            <Link to="/" className="flex items-center">
              <img 
                src="/vital_cosmeticos.png" 
                alt="Vital Cosméticos" 
                className="w-32 h-20 md:w-44 md:h-24 object-contain"
              />
            </Link>
          </div>
          <div className="md:hidden flex items-center">
            <button onClick={onMenuToggle} className="p-2 rounded-md text-white hover:text-[#7ed957] focus:outline-none">
              <Menu className="w-8 h-8" />
            </button>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`text-base font-bold uppercase tracking-wide transition-colors ${location.pathname === '/' ? 'text-white underline underline-offset-8' : 'text-white hover:text-[#7ed957]'}`}>Home</Link>
            <a href="#quem-somos" className="text-base font-bold uppercase tracking-wide text-white hover:text-[#7ed957] transition-colors">Quem Somos</a>
            <Link to="/" className="text-base font-bold uppercase tracking-wide text-white hover:text-[#7ed957] transition-colors">Catálogo</Link>
            <Link to="/favorites" className={`flex items-center space-x-1 text-base font-bold uppercase tracking-wide transition-colors ${location.pathname === '/favorites' ? 'text-white underline underline-offset-8' : 'text-white hover:text-[#7ed957]'}`}><Heart className="w-5 h-5" /><span>Favoritos</span>{state.favorites.length > 0 && (<span className="ml-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{state.favorites.length}</span>)}</Link>
            <a href="#trabalhe-conosco" className="text-base font-bold uppercase tracking-wide text-white hover:text-[#7ed957] transition-colors">Trabalhe Conosco</a>
          </nav>
          <div className="hidden md:flex items-center space-x-4 ml-4">
            {state.user ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-white">Olá, {state.user.name}</span>
                {state.user.role === 'admin' && !isAdminArea && (
                  <Link to="/admin" className="bg-[#3a5a8c] text-white px-3 py-1 rounded-md text-sm hover:bg-[#7ed957] transition-colors">Admin</Link>
                )}
                <button onClick={handleLogout} className="p-2 text-white hover:text-[#7ed957] hover:bg-[#25407a] rounded-full transition-colors"><LogOut className="w-4 h-4" /></button>
              </div>
            ) : (
              <Link to="/login" className="flex items-center space-x-1 bg-[#3a5a8c] text-white px-4 py-2 rounded-md text-sm hover:bg-[#7ed957] transition-colors"><User className="w-4 h-4" /><span>Entrar</span></Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}