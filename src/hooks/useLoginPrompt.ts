import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

export function useLoginPrompt() {
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const promptLogin = (callback?: () => void) => {
    if (!user) {
      setShowLoginPrompt(true);
      return false; // Indica que o usuário não está logado
    }
    
    // Se está logado, executa o callback se fornecido
    if (callback) {
      callback();
    }
    return true; // Indica que o usuário está logado
  };

  const handleLoginRedirect = () => {
    setShowLoginPrompt(false);
    navigate('/login');
  };

  const closePrompt = () => {
    setShowLoginPrompt(false);
  };

  return {
    showLoginPrompt,
    promptLogin,
    handleLoginRedirect,
    closePrompt,
    isLoggedIn: !!user
  };
} 