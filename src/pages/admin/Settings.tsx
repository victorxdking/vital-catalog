import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, Phone, Mail, MapPin } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface SettingsForm {
  companyName: string;
  phone: string;
  email: string;
  address: string;
  whatsappNumber: string;
  whatsappMessage: string;
}

export function Settings() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<SettingsForm>({
    defaultValues: {
      companyName: 'Vital Cosméticos',
      phone: '(11) 99999-9999',
      email: 'contato@vital.com',
      address: 'Rua das Flores, 123 - São Paulo, SP',
      whatsappNumber: '5511999999999',
      whatsappMessage: 'Olá! Gostaria de mais informações sobre o produto: {product_name} (Código: {product_code})',
    }
  });

  const onSubmit = async (data: SettingsForm) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Save settings (in a real app, this would be an API call)
    localStorage.setItem('app_settings', JSON.stringify(data));
    
    setIsLoading(false);
    setIsSaved(true);
    
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600">
          Gerencie as configurações da aplicação
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Company Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <SettingsIcon className="w-5 h-5 mr-2" />
            Informações da Empresa
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome da Empresa
              </label>
              <input
                {...register('companyName', { required: 'Nome da empresa é obrigatório' })}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
              />
              {errors.companyName && (
                <p className="mt-1 text-sm text-red-600">{errors.companyName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-1" />
                Telefone
              </label>
              <input
                {...register('phone', { required: 'Telefone é obrigatório' })}
                type="tel"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                Email
              </label>
              <input
                {...register('email', { 
                  required: 'Email é obrigatório',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email inválido'
                  }
                })}
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Endereço
              </label>
              <input
                {...register('address', { required: 'Endereço é obrigatório' })}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* WhatsApp Configuration */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Configurações do WhatsApp
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número do WhatsApp (com código do país)
              </label>
              <input
                {...register('whatsappNumber', { required: 'Número do WhatsApp é obrigatório' })}
                type="text"
                placeholder="5511999999999"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
              />
              {errors.whatsappNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.whatsappNumber.message}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Formato: código do país + DDD + número (exemplo: 5511999999999)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mensagem Padrão do WhatsApp
              </label>
              <textarea
                {...register('whatsappMessage', { required: 'Mensagem padrão é obrigatória' })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
              />
              {errors.whatsappMessage && (
                <p className="mt-1 text-sm text-red-600">{errors.whatsappMessage.message}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Use <code>{`{product_name}`}</code> e <code>{`{product_code}`}</code> para inserir automaticamente o nome e código do produto.
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
              isSaved
                ? 'bg-emerald-600 text-white'
                : 'bg-teal-600 text-white hover:bg-teal-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <Save className="w-4 h-4" />
            <span>
              {isLoading ? 'Salvando...' : isSaved ? 'Salvo!' : 'Salvar Configurações'}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}