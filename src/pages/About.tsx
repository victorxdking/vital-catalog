import React from 'react';
import { ArrowLeft, Target, Eye, Heart, Award, Users, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';

export function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#183263] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link to="/" className="text-white hover:text-[#7ed957] transition-colors mr-4">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold">Sobre Nós</h1>
          </div>
          <p className="text-xl text-gray-200 max-w-3xl">
            Conheça nossa história, missão e os valores que nos guiam na jornada de oferecer 
            os melhores produtos de beleza e cosméticos.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Nossa História */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Nossa História</h2>
            <div className="w-24 h-1 bg-[#7ed957] mx-auto"></div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2">
                <img 
                  src="/vital_cosmeticos.png" 
                  alt="Vital Cosméticos" 
                  className="w-full max-w-md mx-auto object-contain"
                />
              </div>
              <div className="lg:w-1/2">
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  A <strong className="text-[#183263]">Vital Distribuidora</strong> é um sonho que se tornou realidade em 2017, 
                  onde seus dirigentes ao longo de muitos anos adquiriram conhecimentos e experiências, 
                  através das oportunidades de trabalho nessa área de distribuição de cosméticos.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  Somos muito gratos, e hoje conquistamos nosso espaço nesse mercado, sempre buscando 
                  oferecer produtos de qualidade e um atendimento diferenciado aos nossos clientes.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Nossa trajetória é marcada pela dedicação, inovação e compromisso com a excelência, 
                  valores que nos permitem crescer e evoluir constantemente no setor de cosméticos.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Missão, Visão e Valores */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Nossos Pilares</h2>
            <div className="w-24 h-1 bg-[#7ed957] mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Missão */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-[#183263] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#183263] mb-4">Missão</h3>
              </div>
              <p className="text-gray-700 leading-relaxed text-center">
                Conquistar e manter uma relação onde possamos satisfazer as expectativas de nossos 
                clientes com diferencial no atendimento, fortalecendo a cada dia nosso relacionamento 
                e confiança.
              </p>
            </div>

            {/* Visão */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-[#7ed957] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#183263] mb-4">Visão</h3>
              </div>
              <p className="text-gray-700 leading-relaxed text-center">
                Ser reconhecida como líder em inovação e qualidade no mercado de cosméticos, 
                oferecendo produtos diferenciados e soluções sustentáveis que atendam de forma 
                eficaz às necessidades dos nossos clientes.
              </p>
            </div>

            {/* Valores */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#183263] mb-4">Valores</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Lightbulb className="w-5 h-5 text-[#7ed957] mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Inovação</span>
                </div>
                <div className="flex items-center">
                  <Award className="w-5 h-5 text-[#7ed957] mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Compromisso com a qualidade</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-[#7ed957] mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Excelência no atendimento</span>
                </div>
                <div className="flex items-center">
                  <Heart className="w-5 h-5 text-[#7ed957] mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Respeito ao cliente</span>
                </div>
                <div className="flex items-center">
                  <Target className="w-5 h-5 text-[#7ed957] mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Responsabilidade social</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Por que nos escolher */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Por que nos escolher?</h2>
            <div className="w-24 h-1 bg-[#7ed957] mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-[#183263] rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Qualidade Garantida</h3>
              <p className="text-gray-600">Produtos selecionados das melhores marcas do mercado</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-[#7ed957] rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Atendimento Personalizado</h3>
              <p className="text-gray-600">Equipe especializada pronta para atender suas necessidades</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Inovação Constante</h3>
              <p className="text-gray-600">Sempre em busca das últimas tendências e novidades</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Compromisso Social</h3>
              <p className="text-gray-600">Responsabilidade com o meio ambiente e sociedade</p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-[#183263] to-[#3a5a8c] rounded-2xl shadow-lg p-12 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Faça parte da nossa história
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Descubra nossa linha completa de produtos e experimente a diferença 
              de um atendimento verdadeiramente personalizado.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="bg-[#7ed957] text-[#183263] px-8 py-3 rounded-lg font-semibold hover:bg-green-400 transition-colors"
              >
                Ver Catálogo
              </Link>
              <Link
                to="/careers"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#183263] transition-colors"
              >
                Trabalhe Conosco
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 