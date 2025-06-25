import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Product, Category } from '../types';

interface UseProductsOptions {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}

export function useProducts(options: UseProductsOptions = {}) {
  const { page = 1, limit = 12, category = '', search = '' } = options;
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  // Buscar produtos do Supabase com paginação e filtros
  const fetchProducts = async (pageNum = page, append = false) => {
    setIsLoading(true);
    
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          categories (
            name
          )
        `, { count: 'exact' });

      // Aplicar filtros
      if (category) {
        const { data: categoryData } = await supabase
          .from('categories')
          .select('id')
          .eq('name', category)
          .single();
        
        if (categoryData) {
          query = query.eq('category_id', categoryData.id);
        }
      }

      if (search) {
        query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,code.ilike.%${search}%,reference.ilike.%${search}%`);
      }

      // Paginação
      const from = (pageNum - 1) * limit;
      const to = from + limit - 1;
      
      query = query
        .range(from, to)
        .order('created_at', { ascending: false });

      const { data, error, count } = await query;

      if (error) throw error;

      if (data) {
        // Mapear os dados para incluir category como string
        const mappedProducts = data.map(product => ({
          ...product,
          category: product.categories?.name || 'Sem categoria'
        }));

        if (append) {
          setProducts(prev => [...prev, ...mappedProducts as Product[]]);
        } else {
          setProducts(mappedProducts as Product[]);
        }

        setTotalCount(count || 0);
        setHasMore((count || 0) > pageNum * limit);
      }
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Buscar todos os produtos (para filtros e estatísticas)
  const fetchAllProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (
          name
        )
      `);
    
    if (!error && data) {
      const mappedProducts = data.map(product => ({
        ...product,
        category: product.categories?.name || 'Sem categoria'
      }));
      return mappedProducts as Product[];
    }
    return [];
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
    fetchProducts(1, false);
    fetchCategories();
  }, [category, search]);

  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'views'>) => {
    // Buscar o category_id baseado no nome da categoria
    const { data: categoryData } = await supabase
      .from('categories')
      .select('id')
      .eq('name', productData.category)
      .single();

    if (!categoryData) {
      throw new Error('Categoria não encontrada');
    }

    const { data, error } = await supabase
      .from('products')
      .insert([{
        name: productData.name,
        description: productData.description,
        category_id: categoryData.id,
        code: productData.code,
        reference: productData.reference,
        stock: productData.stock,
        images: productData.images,
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
      
      // Atualizar lista local apenas se estamos na primeira página
      if (page === 1) {
        setProducts(prevProducts => [mappedProduct as Product, ...prevProducts.slice(0, limit - 1)]);
        setTotalCount(prev => prev + 1);
      }
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
    setTotalCount(prev => prev - 1);
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

  const loadMore = () => {
    if (hasMore && !isLoading) {
      fetchProducts(page + 1, true);
    }
  };

  return {
    products,
    categories,
    isLoading,
    totalCount,
    hasMore,
    currentPage: page,
    totalPages: Math.ceil(totalCount / limit),
    refetchProducts: () => fetchProducts(1, false),
    refetchCategories: fetchCategories,
    fetchAllProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    incrementViews,
    loadMore,
  };
}