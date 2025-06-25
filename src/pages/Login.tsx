import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import BannerVideo from '../components/BannerVideo';

interface LoginForm {
  email: string;
  password: string;
  name?: string;
}

export function Login() {
  const navigate = useNavigate();
  const { signIn, signUp, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setError(null);
    
    try {
      if (isSignUp) {
        const { error } = await signUp(data.email, data.password, data.name);
        if (error) {
          setError(error.message);
        } else {
          setError('Cadastro realizado! Verifique seu email para confirmar a conta.');
          reset();
          setIsSignUp(false);
        }
      } else {
        const { error } = await signIn(data.email, data.password);
        if (error) {
          setError('Email ou senha incorretos');
        } else {
          navigate('/');
        }
      }
    } catch {
      setError('Erro inesperado. Tente novamente.');
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError(null);
    reset();
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
          {isSignUp ? 'Criar conta' : 'Entre na sua conta'}
        </h2>
        <p className="mt-2 text-center text-sm text-white drop-shadow-md">
          {isSignUp ? 'Cadastre-se no catálogo Vital Cosméticos' : 'Acesse o catálogo Vital Cosméticos'}
        </p>
      </div>
      <div className="relative z-20 mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-2xl rounded-lg sm:px-10 backdrop-blur-sm bg-white/95">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {isSignUp && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nome
                </label>
                <div className="mt-1">
                  <input
                    {...register('name', {
                      required: isSignUp ? 'Nome é obrigatório' : false,
                    })}
                    type="text"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                    placeholder="Seu nome completo"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>
              </div>
            )}

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

            {error && (
              <div className={`text-sm p-3 rounded ${error.includes('Cadastro realizado') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Carregando...' : isSignUp ? 'Criar conta' : 'Entrar'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  {isSignUp ? 'Já tem conta?' : 'Não tem conta?'}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={toggleMode}
                className="w-full flex justify-center items-center space-x-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                <span>{isSignUp ? 'Fazer login' : 'Criar conta'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}