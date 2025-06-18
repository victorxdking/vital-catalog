import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './useAuth';

export function useFavorites() {
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
    const { data, error } = await supabase
      .from('favorites')
      .select('product_id')
      .eq('user_id', user.id);

    if (!error && data) {
      setFavorites(data.map(fav => fav.product_id));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFavorites();
  }, [user]);

  // Adicionar produto aos favoritos
  const addToFavorites = async (productId: string) => {
    if (!user) return { error: 'Usuário não logado' };

    const { error } = await supabase
      .from('favorites')
      .insert({
        user_id: user.id,
        product_id: productId
      });

    if (!error) {
      setFavorites(prev => [...prev, productId]);
    }

    return { error };
  };

  // Remover produto dos favoritos
  const removeFromFavorites = async (productId: string) => {
    if (!user) return { error: 'Usuário não logado' };

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId);

    if (!error) {
      setFavorites(prev => prev.filter(id => id !== productId));
    }

    return { error };
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

  return {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    favoritesCount: favorites.length,
    refetchFavorites: fetchFavorites
  };
} 