import { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';

// Mock data for products
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Shampoo Hidratante Premium',
    description: 'Shampoo com fórmula exclusiva para cabelos ressecados e danificados. Contém óleo de argan e queratina.',
    category: 'Cabelo',
    code: 'SHP001',
    reference: 'REF-SHP-001',
    stock: 'available',
    images: ['https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg'],
    views: 145,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Sérum Anti-idade Renovador',
    description: 'Sérum facial com ácido hialurônico e vitamina C para rejuvenescimento da pele.',
    category: 'Pele',
    code: 'SER002',
    reference: 'REF-SER-002',
    stock: 'available',
    images: ['https://images.pexels.com/photos/7755461/pexels-photo-7755461.jpeg'],
    views: 203,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: '3',
    name: 'Base Líquida Cobertura Total',
    description: 'Base líquida com alta cobertura e longa duração. Disponível em 20 tons.',
    category: 'Maquiagem',
    code: 'BSE003',
    reference: 'REF-BSE-003',
    stock: 'available',
    images: ['https://images.pexels.com/photos/2113855/pexels-photo-2113855.jpeg'],
    views: 89,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '4',
    name: 'Perfume Floral Elegance',
    description: 'Fragrância feminina com notas florais de jasmim e rosa. Edição limitada.',
    category: 'Perfumaria',
    code: 'PRF004',
    reference: 'REF-PRF-004',
    stock: 'coming_soon',
    images: ['https://images.pexels.com/photos/1038628/pexels-photo-1038628.jpeg'],
    views: 67,
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25'),
  },
  {
    id: '5',
    name: 'Creme Corporal Nutritivo',
    description: 'Creme hidratante corporal com manteiga de karité e óleo de coco.',
    category: 'Pele',
    code: 'CRP005',
    reference: 'REF-CRP-005',
    stock: 'out_of_stock',
    images: ['https://images.pexels.com/photos/4465831/pexels-photo-4465831.jpeg'],
    views: 112,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
  },
  {
    id: '6',
    name: 'Kit Tratamento Facial Completo',
    description: 'Kit com limpador, tônico e hidratante para todos os tipos de pele.',
    category: 'Estética',
    code: 'KIT006',
    reference: 'REF-KIT-006',
    stock: 'available',
    images: ['https://images.pexels.com/photos/7755456/pexels-photo-7755456.jpeg'],
    views: 178,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
  },
];

export function useProducts() {
  const { state, dispatch } = useApp();

  useEffect(() => {
    // Simulate API call
    if (state.products.length === 0) {
      dispatch({ type: 'SET_LOADING', payload: true });
      setTimeout(() => {
        dispatch({ type: 'SET_PRODUCTS', payload: mockProducts });
        dispatch({ type: 'SET_LOADING', payload: false });
      }, 1000);
    }
  }, [state.products.length, dispatch]);

  const addProduct = (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'views'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 0,
    };
    dispatch({ type: 'ADD_PRODUCT', payload: newProduct });
  };

  const updateProduct = (product: Product) => {
    const updatedProduct = { ...product, updatedAt: new Date() };
    dispatch({ type: 'UPDATE_PRODUCT', payload: updatedProduct });
  };

  const deleteProduct = (id: string) => {
    dispatch({ type: 'DELETE_PRODUCT', payload: id });
  };

  const incrementViews = (id: string) => {
    dispatch({ type: 'INCREMENT_VIEWS', payload: id });
  };

  return {
    products: state.products,
    isLoading: state.isLoading,
    addProduct,
    updateProduct,
    deleteProduct,
    incrementViews,
  };
}