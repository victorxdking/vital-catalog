import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import { useApp } from '../context/AppContext';
import BannerVideo from '../components/BannerVideo';

interface LoginForm {
  email: string;
  password: string;
}

export function Login() {
  const navigate = useNavigate();
  const { dispatch } = useApp();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, setError } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication
    if (data.email === 'admin@vital.com' && data.password === 'admin123') {
      dispatch({
        type: 'SET_USER',
        payload: {
          id: '1',
          email: data.email,
          name: 'Administrador',
          role: 'admin',
        },
      });
      navigate('/admin');
    } else if (data.email === 'cliente@teste.com' && data.password === 'cliente123') {
      dispatch({
        type: 'SET_USER',
        payload: {
          id: '2',
          email: data.email,
          name: 'Cliente Teste',
          role: 'client',
        },
      });
      navigate('/');
    } else {
      setError('email', { message: 'Email ou senha incorretos' });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Banner de vídeo tela cheia */}
      <div className="absolute inset-0 z-0">
        <BannerVideo fullScreen />
      </div>
      <div className="absolute inset-0 bg-black bg-opacity-40 z-10 pointer-events-none" />
      <div className="relative z-20 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <img 
            src="/vital_cosmeticos.png" 
            alt="Vital Cosméticos" 
            className="w-24 h-24 object-contain drop-shadow-lg"
          />
        </div>
        <h2 className="text-center text-3xl font-extrabold text-white drop-shadow-lg">
          Entre na sua conta
        </h2>
        <p className="mt-2 text-center text-sm text-white drop-shadow-md">
          Acesse o catálogo Vital Cosméticos
        </p>
      </div>
      <div className="relative z-20 mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-2xl rounded-lg sm:px-10 backdrop-blur-sm bg-white/95">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  {...register('email', {
                    required: 'Email é obrigatório',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email inválido',
                    },
                  })}
                  type="email"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                  placeholder="seu@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="mt-1 relative">
                <input
                  {...register('password', {
                    required: 'Senha é obrigatória',
                    minLength: {
                      value: 6,
                      message: 'Senha deve ter pelo menos 6 caracteres',
                    },
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Sua senha"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Contas de teste</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="text-sm text-gray-600">
                <strong>Administrador:</strong>
                <br />
                Email: admin@vital.com
                <br />
                Senha: admin123
              </div>
              <div className="text-sm text-gray-600">
                <strong>Cliente:</strong>
                <br />
                Email: cliente@teste.com
                <br />
                Senha: cliente123
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}