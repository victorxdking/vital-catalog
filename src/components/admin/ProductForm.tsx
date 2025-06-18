import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Upload, Trash2 } from 'lucide-react';
import { Product } from '../../types';
import { useProducts } from '../../hooks/useProducts';
import { useApp } from '../../context/AppContext';

interface ProductFormProps {
  product?: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

interface ProductFormData {
  name: string;
  description: string;
  category: string;
  code: string;
  reference: string;
  stock: 'available' | 'out_of_stock' | 'coming_soon';
  images: string[];
}

export function ProductForm({ product, isOpen, onClose }: ProductFormProps) {
  const { addProduct, updateProduct } = useProducts();
  const { state } = useApp();
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<ProductFormData>({
    defaultValues: product ? {
      name: product.name,
      description: product.description,
      category: product.category,
      code: product.code,
      reference: product.reference,
      stock: product.stock,
      images: product.images,
    } : {
      name: '',
      description: '',
      category: '',
      code: '',
      reference: '',
      stock: 'available',
      images: [],
    }
  });

  const watchedImages = watch('images');

  if (!isOpen) return null;

  const onSubmit = async (data: ProductFormData) => {
    setIsLoading(true);
    
    try {
      if (product) {
        updateProduct({ ...product, ...data });
      } else {
        addProduct(data);
      }
      
      reset();
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addImage = () => {
    if (imageUrl && !watchedImages.includes(imageUrl)) {
      setValue('images', [...watchedImages, imageUrl]);
      setImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setValue('images', watchedImages.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  {product ? 'Editar Produto' : 'Novo Produto'}
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome do Produto *
                    </label>
                    <input
                      {...register('name', { required: 'Nome é obrigatório' })}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                      placeholder="Nome do produto"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Categoria *
                    </label>
                    <select
                      {...register('category', { required: 'Categoria é obrigatória' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                    >
                      <option value="">Selecione uma categoria</option>
                      {state.categories.map((category) => (
                        <option key={category.id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Código *
                      </label>
                      <input
                        {...register('code', { required: 'Código é obrigatório' })}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                        placeholder="ABC123"
                      />
                      {errors.code && (
                        <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Referência *
                      </label>
                      <input
                        {...register('reference', { required: 'Referência é obrigatória' })}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                        placeholder="REF-ABC-123"
                      />
                      {errors.reference && (
                        <p className="mt-1 text-sm text-red-600">{errors.reference.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status do Estoque *
                    </label>
                    <select
                      {...register('stock', { required: 'Status é obrigatório' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                    >
                      <option value="available">Disponível</option>
                      <option value="out_of_stock">Esgotado</option>
                      <option value="coming_soon">Em breve</option>
                    </select>
                    {errors.stock && (
                      <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descrição *
                    </label>
                    <textarea
                      {...register('description', { required: 'Descrição é obrigatória' })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                      placeholder="Descreva o produto..."
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Imagens do Produto
                    </label>
                    <div className="flex space-x-2 mb-2">
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                        placeholder="URL da imagem"
                      />
                      <button
                        type="button"
                        onClick={addImage}
                        className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors flex items-center space-x-1"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Adicionar</span>
                      </button>
                    </div>
                    
                    {watchedImages.length > 0 && (
                      <div className="grid grid-cols-2 gap-2">
                        {watchedImages.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image}
                              alt={`Produto ${index + 1}`}
                              className="w-full h-24 object-cover rounded border"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <p className="text-xs text-gray-500 mt-1">
                      Adicione URLs de imagens do produto. Use serviços como Pexels, Unsplash ou seu próprio servidor.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-teal-600 text-base font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Salvando...' : (product ? 'Salvar Alterações' : 'Criar Produto')}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}