import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#183263] text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img 
                src="/vital_cosmeticos.png" 
                alt="Vital Cosméticos" 
                className="h-8 w-auto"
              />
              <h3 className="text-xl font-bold">Vital Cosméticos</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Sua beleza é nossa prioridade. Oferecemos os melhores produtos de cosméticos 
              e cuidados pessoais com qualidade e preços acessíveis desde 2017.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-[#7ed957] transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-[#7ed957] transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="text-gray-300 hover:text-[#7ed957] transition-colors text-sm"
                >
                  Catálogo
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-gray-300 hover:text-[#7ed957] transition-colors text-sm"
                >
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link 
                  to="/careers" 
                  className="text-gray-300 hover:text-[#7ed957] transition-colors text-sm"
                >
                  Trabalhe Conosco
                </Link>
              </li>
              <li>
                <Link 
                  to="/favorites" 
                  className="text-gray-300 hover:text-[#7ed957] transition-colors text-sm"
                >
                  Favoritos
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Categorias</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-gray-300 text-sm">Cabelos</span>
              </li>
              <li>
                <span className="text-gray-300 text-sm">Maquiagem</span>
              </li>
              <li>
                <span className="text-gray-300 text-sm">Cuidados com a Pele</span>
              </li>
              <li>
                <span className="text-gray-300 text-sm">Perfumaria</span>
              </li>
              <li>
                <span className="text-gray-300 text-sm">Unhas</span>
              </li>
              <li>
                <span className="text-gray-300 text-sm">Acessórios</span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contato</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-[#7ed957] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">
                    Rua das Flores, 123<br />
                    Centro - São Paulo, SP<br />
                    CEP: 01234-567
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-[#7ed957] flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">(11) 9999-9999</p>
                  <p className="text-gray-300 text-sm">(11) 8888-8888</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-[#7ed957] flex-shrink-0" />
                <p className="text-gray-300 text-sm">contato@vitalcosmeticos.com.br</p>
              </div>
              
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-[#7ed957] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">
                    Segunda à Sexta: 8h às 18h<br />
                    Sábado: 8h às 14h
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-center md:justify-end">
            <div className="flex space-x-6 text-sm">
              <button className="text-gray-400 hover:text-[#7ed957] transition-colors">
                Política de Privacidade
              </button>
              <button className="text-gray-400 hover:text-[#7ed957] transition-colors">
                Termos de Uso
              </button>
              <button className="text-gray-400 hover:text-[#7ed957] transition-colors">
                Cookies
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 