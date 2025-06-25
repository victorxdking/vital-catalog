import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth';

interface FavoritesContextType {
  favorites: string[];
  loading: boolean;
  favoritesCount: number;
  addToFavorites: (productId: string) => Promise<{ error?: string }>;
  removeFromFavorites: (productId: string) => Promise<{ error?: string }>;
  toggleFavorite: (productId: string) => Promise<{ error?: string }>;
  isFavorite: (productId: string) => boolean;
  refetchFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Buscar favoritos do usuário logado
  const fetchFavorites = async () => {
    if (!user) {
      setFavorites([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('product_id')
        .eq('user_id', user.id);

      if (!error && data) {
        setFavorites(data.map(fav => fav.product_id));
      }
    } catch (error) {
      console.error('Erro ao buscar favoritos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [user]);

  // Adicionar produto aos favoritos
  const addToFavorites = async (productId: string) => {
    if (!user) return { error: 'Usuário não logado' };

    try {
      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: user.id,
          product_id: productId
        });

      if (!error) {
        setFavorites(prev => [...prev, productId]);
      }

      return { error: error?.message };
    } catch (error: any) {
      return { error: error.message };
    }
  };

  // Remover produto dos favoritos
  const removeFromFavorites = async (productId: string) => {
    if (!user) return { error: 'Usuário não logado' };

    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (!error) {
        setFavorites(prev => prev.filter(id => id !== productId));
      }

      return { error: error?.message };
    } catch (error: any) {
      return { error: error.message };
    }
  };

  // Alternar favorito (adicionar se não está, remover se está)
  const toggleFavorite = async (productId: string) => {
    if (isFavorite(productId)) {
      return await removeFromFavorites(productId);
    } else {
      return await addToFavorites(productId);
    }
  };

  // Verificar se um produto está nos favoritos
  const isFavorite = (productId: string) => {
    return favorites.includes(productId);
  };

  const value: FavoritesContextType = {
    favorites,
    loading,
    favoritesCount: favorites.length,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    refetchFavorites: fetchFavorites
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
} 