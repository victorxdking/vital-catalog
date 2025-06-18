import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Product, Category } from '../types';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Buscar produtos do Supabase com join das categorias
  const fetchProducts = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (
          name
        )
      `);
    if (!error && data) {
      // Mapear os dados para incluir category como string
      const mappedProducts = data.map(product => ({
        ...product,
        category: product.categories?.name || 'Sem categoria'
      }));
      setProducts(mappedProducts as Product[]);
    }
    setIsLoading(false);
  };

  // Buscar categorias do Supabase
  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*');
    if (!error && data) {
      setCategories(data as Category[]);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const addProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'views'>) => {
    // Buscar o category_id baseado no nome da categoria
    const { data: categoryData } = await supabase
      .from('categories')
      .select('id')
      .eq('name', product.category)
      .single();

    if (!categoryData) {
      throw new Error('Categoria não encontrada');
    }

    const { data, error } = await supabase
      .from('products')
      .insert([{
        name: product.name,
        description: product.description,
        category_id: categoryData.id,
        code: product.code,
        reference: product.reference,
        stock: product.stock,
        images: product.images,
        views: 0
      }])
      .select(`
        *,
        categories (
          name
        )
      `)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    if (data) {
      const mappedProduct = {
        ...data,
        category: data.categories?.name || 'Sem categoria'
      };
      setProducts(prevProducts => [...prevProducts, mappedProduct as Product]);
    }

    return data;
  };

  const updateProduct = async (product: Product) => {
    // Buscar o category_id baseado no nome da categoria
    const { data: categoryData } = await supabase
      .from('categories')
      .select('id')
      .eq('name', product.category)
      .single();

    if (!categoryData) {
      throw new Error('Categoria não encontrada');
    }

    const { data, error } = await supabase
      .from('products')
      .update({
        name: product.name,
        description: product.description,
        category_id: categoryData.id,
        code: product.code,
        reference: product.reference,
        stock: product.stock,
        images: product.images,
        updated_at: new Date().toISOString()
      })
      .eq('id', product.id)
      .select(`
        *,
        categories (
          name
        )
      `)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    if (data) {
      const mappedProduct = {
        ...data,
        category: data.categories?.name || 'Sem categoria'
      };
      setProducts(prevProducts => 
        prevProducts.map(p => p.id === product.id ? mappedProduct as Product : p)
      );
    }

    return data;
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    setProducts(prevProducts => prevProducts.filter(p => p.id !== id));
  };

  const incrementViews = async (id: string) => {
    // Incrementar views no banco
    const { error } = await supabase.rpc('increment_views', { product_id: id });

    if (!error) {
      // Atualizar estado local
      setProducts(prevProducts => 
        prevProducts.map(p => p.id === id ? { ...p, views: p.views + 1 } : p)
      );
    }
  };

  return {
    products,
    categories,
    isLoading,
    refetchProducts: fetchProducts,
    refetchCategories: fetchCategories,
    addProduct,
    updateProduct,
    deleteProduct,
    incrementViews,
  };
}