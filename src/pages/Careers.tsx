import React, { useState } from 'react';
import { ArrowLeft, Upload, Send, Users, Target, Award, Heart, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

export function Careers() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
    resume: null as File | null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        resume: file
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Aqui você pode implementar a lógica de envio do formulário
      // Por exemplo, enviar para uma API ou serviço de email
      
      // Simulando envio
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showToast('Candidatura enviada com sucesso! Entraremos em contato em breve.', 'success');
      
      // Limpar formulário
      setFormData({
        name: '',
        phone: '',
        email: '',
        message: '',
        resume: null
      });
      
      // Limpar input de arquivo
      const fileInput = document.getElementById('resume') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch {
      showToast('Erro ao enviar candidatura. Tente novamente.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#183263] to-[#3a5a8c] text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#7ed957] to-transparent transform rotate-1 origin-bottom-left"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center mb-8">
            <Link to="/" className="text-white hover:text-[#7ed957] transition-colors mr-4">
              <ArrowLeft className="w-6 h-6" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Trabalhe
                <br />
                <span className="text-[#7ed957]">Conosco</span>
              </h1>
              <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                Quer ser um representante comercial da Vital? Faça parte da nossa equipe e 
                ajude a levar beleza e qualidade para todo o Brasil.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-[#7ed957]" />
                  <span className="text-sm">Comissões atrativas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-[#7ed957]" />
                  <span className="text-sm">Suporte completo</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-[#7ed957]" />
                  <span className="text-sm">Crescimento profissional</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative z-10">
                <div className="w-full max-w-md mx-auto bg-gradient-to-br from-[#7ed957] to-[#5cb847] rounded-2xl shadow-2xl p-8 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-16 h-16 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Junte-se ao nosso time!</h3>
                    <p className="text-lg opacity-90">Seja um representante de sucesso</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#7ed957] rounded-full opacity-20"></div>
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-white rounded-full opacity-10"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Por que trabalhar conosco */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Por que trabalhar conosco?
            </h2>
            <div className="w-24 h-1 bg-[#7ed957] mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-[#183263] rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Produtos de Qualidade</h3>
              <p className="text-gray-600">Represente marcas reconhecidas e produtos de alta qualidade no mercado.</p>
            </div>

            <div className="text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-[#7ed957] rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Metas Alcançáveis</h3>
              <p className="text-gray-600">Metas realistas com suporte completo para você atingir seus objetivos.</p>
            </div>

            <div className="text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Equipe Unida</h3>
              <p className="text-gray-600">Faça parte de uma equipe colaborativa e sempre disposta a ajudar.</p>
            </div>

            <div className="text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Ambiente Positivo</h3>
              <p className="text-gray-600">Trabalhe em um ambiente que valoriza o bem-estar e o crescimento pessoal.</p>
            </div>
          </div>
        </section>

        {/* Formulário de Candidatura */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Quer ser um representante comercial da Vital? Deixe seu contato!
            </h2>
            <div className="w-24 h-1 bg-[#7ed957] mx-auto"></div>
          </div>

          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#7ed957] focus:border-transparent transition-colors"
                  placeholder="Seu nome completo"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#7ed957] focus:border-transparent transition-colors"
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  E-mail *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#7ed957] focus:border-transparent transition-colors"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Mensagem
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#7ed957] focus:border-transparent transition-colors resize-none"
                  placeholder="Conte-nos um pouco sobre você e sua experiência..."
                />
              </div>

              <div>
                <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-2">
                  Anexe o seu currículo
                </label>
                <div className="relative">
                  <input
                    type="file"
                    id="resume"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                  />
                  <label
                    htmlFor="resume"
                    className="w-full flex items-center justify-center px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#7ed957] hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        {formData.resume ? formData.resume.name : 'Clique ou arraste um arquivo para esta área para fazer upload.'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">PDF, DOC ou DOCX até 10MB</p>
                    </div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#7ed957] text-[#183263] py-4 px-6 rounded-lg font-semibold text-lg hover:bg-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-[#183263] border-t-transparent rounded-full animate-spin"></div>
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Enviar mensagem</span>
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center">
                Ao enviar este formulário, você concorda com o processamento dos seus dados pessoais 
                para fins de recrutamento e seleção.
              </p>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
} 