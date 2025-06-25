import React, { useState, useEffect, useRef } from 'react';
import { Plus, FileText, Download, Mail, MessageCircle, Eye, Edit, Trash2, Package, Users, Calendar, Image } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { useToast } from '../../context/ToastContext';
import { supabase } from '../../lib/supabaseClient';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import Select from 'react-select';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface DigitalFolder {
  id: string;
  name: string;
  description: string;
  products: any[];
  client_name: string;
  client_email: string;
  client_phone: string;
  created_at: string;
  updated_at: string;
}

interface FolderFormData {
  name: string;
  description: string;
  selectedProducts: any[];
  client_name: string;
  client_email: string;
  client_phone: string;
}

export function Folders() {
  const { products } = useProducts();
  const { showToast } = useToast();
  const [folders, setFolders] = useState<DigitalFolder[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [editingFolder, setEditingFolder] = useState<DigitalFolder | null>(null);
  const [previewFolder, setPreviewFolder] = useState<DigitalFolder | null>(null);
  const [formData, setFormData] = useState<FolderFormData>({
    name: '',
    description: '',
    selectedProducts: [],
    client_name: '',
    client_email: '',
    client_phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isGeneratingPNG, setIsGeneratingPNG] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Função para converter URL da imagem para usar proxy
  const getProxyImageUrl = (originalUrl: string) => {
    if (!originalUrl) return '';
    
    // Se a URL já é local, retorna como está
    if (originalUrl.startsWith('/') || originalUrl.startsWith('http://localhost')) {
      return originalUrl;
    }
    
    // Para URLs externas, usa o proxy
    if (originalUrl.includes('vitalcosmeticos.com.br')) {
      const path = originalUrl.replace('https://vitalcosmeticos.com.br', '');
      return `/api/proxy-image${path}`;
    }
    
    return originalUrl;
  };

  // Componente para imagem com fallback
  const ProductImage = ({ product, className }: { product: any; className: string }) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const handleImageError = () => {
      setImageError(true);
    };

    const handleImageLoad = () => {
      setImageLoaded(true);
    };

    if (!product.images || !product.images[0] || imageError) {
      return (
        <div className={`${className} bg-gradient-to-br from-[#183263] to-[#3a5a8c] flex items-center justify-center rounded-lg`}>
          <div className="text-center text-white p-4">
            <Package className="w-12 h-12 mx-auto mb-2 opacity-80" />
            <p className="text-xs font-medium opacity-90 line-clamp-2">{product.name}</p>
          </div>
        </div>
      );
    }

    const imageUrl = getProxyImageUrl(product.images[0]);

    return (
      <div className={className}>
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-contain bg-gray-50 rounded-lg"
          onError={handleImageError}
          onLoad={handleImageLoad}
          crossOrigin="anonymous"
          style={{ display: imageLoaded ? 'block' : 'none' }}
        />
        {!imageLoaded && !imageError && (
          <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-[#183263] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-xs text-gray-500">Carregando...</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Buscar folders existentes
  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      const { data, error } = await supabase
        .from('digital_folders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFolders(data || []);
    } catch (error: any) {
      showToast('Erro ao carregar folders', 'error');
    }
  };

  // Opções para o select de produtos
  const productOptions = products.map(product => ({
    value: product.id,
    label: `${product.name} - ${product.category}`,
    product: product
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || formData.selectedProducts.length === 0) {
      showToast('Nome e produtos são obrigatórios', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const folderData = {
        name: formData.name,
        description: formData.description,
        products: formData.selectedProducts,
        client_name: formData.client_name,
        client_email: formData.client_email,
        client_phone: formData.client_phone
      };

      if (editingFolder) {
        // Atualizar folder
        const { error } = await supabase
          .from('digital_folders')
          .update({
            ...folderData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingFolder.id);

        if (error) throw error;
        showToast('Folder atualizado com sucesso!', 'success');
      } else {
        // Criar novo folder
        const { error } = await supabase
          .from('digital_folders')
          .insert([folderData]);

        if (error) throw error;
        showToast('Folder criado com sucesso!', 'success');
      }

      resetForm();
      fetchFolders();
    } catch (error: any) {
      showToast(error.message || 'Erro ao salvar folder', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      selectedProducts: [],
      client_name: '',
      client_email: '',
      client_phone: ''
    });
    setShowForm(false);
    setEditingFolder(null);
  };

  const handleEdit = (folder: DigitalFolder) => {
    setEditingFolder(folder);
    setFormData({
      name: folder.name,
      description: folder.description || '',
      selectedProducts: folder.products,
      client_name: folder.client_name || '',
      client_email: folder.client_email || '',
      client_phone: folder.client_phone || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este folder?')) return;

    try {
      const { error } = await supabase
        .from('digital_folders')
        .delete()
        .eq('id', id);

      if (error) throw error;
      showToast('Folder excluído com sucesso!', 'success');
      fetchFolders();
    } catch (error: any) {
      showToast(error.message || 'Erro ao excluir folder', 'error');
    }
  };

  const handlePreview = (folder: DigitalFolder) => {
    setPreviewFolder(folder);
    setShowPreview(true);
  };

  // Função para converter imagem para base64
  const convertImageToBase64 = async (imageUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = img.width;
        canvas.height = img.height;
        
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const base64 = canvas.toDataURL('image/png');
          resolve(base64);
        } else {
          reject('Erro ao criar contexto do canvas');
        }
      };
      
      img.onerror = () => {
        reject('Erro ao carregar imagem');
      };
      
      img.src = getProxyImageUrl(imageUrl);
    });
  };

  // Função para criar versão base64 do preview
  const createBase64Preview = async (folder: DigitalFolder) => {
    const previewElement = previewRef.current;
    if (!previewElement) return null;

    // Criar uma cópia do elemento para modificar
    const clonedElement = previewElement.cloneNode(true) as HTMLElement;
    
    // Encontrar todas as imagens no clone
    const images = clonedElement.querySelectorAll('img');
    
    // Converter todas as imagens para base64
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      const originalSrc = img.src;
      
      try {
        // Buscar a URL original do produto correspondente
        const productIndex = Array.from(previewElement.querySelectorAll('img')).indexOf(
          previewElement.querySelectorAll('img')[i]
        );
        
        if (folder.products[productIndex] && folder.products[productIndex].images && folder.products[productIndex].images[0]) {
          const base64 = await convertImageToBase64(folder.products[productIndex].images[0]);
          img.src = base64;
        }
      } catch (error) {
        console.log('Erro ao converter imagem para base64:', error);
        // Manter a imagem original se falhar
      }
    }
    
    return clonedElement;
  };

  const generatePDF = async (folder: DigitalFolder) => {
    if (!previewRef.current) return;

    setIsGeneratingPDF(true);
    try {
      showToast('Preparando imagens...', 'info');
      
      // Criar preview com imagens em base64
      const base64Preview = await createBase64Preview(folder);
      
      if (!base64Preview) {
        throw new Error('Erro ao preparar preview');
      }

      // Adicionar o elemento temporariamente ao DOM (invisível)
      base64Preview.style.position = 'absolute';
      base64Preview.style.left = '-9999px';
      base64Preview.style.top = '-9999px';
      base64Preview.style.width = '794px';
      base64Preview.style.minHeight = '1123px';
      base64Preview.style.padding = '40px';
      base64Preview.style.backgroundColor = '#ffffff';
      
      document.body.appendChild(base64Preview);

      // Aguardar um pouco para o DOM processar
      await new Promise(resolve => setTimeout(resolve, 500));

      showToast('Gerando PDF...', 'info');

      // Capturar com html2canvas
      const canvas = await html2canvas(base64Preview, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        onclone: (clonedDoc) => {
          // Garantir que todas as imagens estejam carregadas no clone
          const clonedImages = clonedDoc.querySelectorAll('img');
          clonedImages.forEach(img => {
            img.style.display = 'block';
          });
        }
      });

      // Remover elemento temporário
      document.body.removeChild(base64Preview);

      const imgData = canvas.toDataURL('image/png', 1.0);
      
      // Configurações do PDF para A4
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Calcular dimensões mantendo proporção
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      
      const imgDisplayWidth = imgWidth * ratio;
      const imgDisplayHeight = imgHeight * ratio;
      
      // Centralizar na página
      const x = (pdfWidth - imgDisplayWidth) / 2;
      const y = (pdfHeight - imgDisplayHeight) / 2;

      pdf.addImage(imgData, 'PNG', x, y, imgDisplayWidth, imgDisplayHeight);
      pdf.save(`${folder.name.replace(/\s+/g, '_')}_catalogo.pdf`);
      showToast('PDF gerado com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      showToast('Erro ao gerar PDF: ' + error.message, 'error');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const generatePNG = async (folder: DigitalFolder) => {
    if (!previewRef.current) return;

    setIsGeneratingPNG(true);
    try {
      showToast('Preparando imagens...', 'info');
      
      // Criar preview com imagens em base64
      const base64Preview = await createBase64Preview(folder);
      
      if (!base64Preview) {
        throw new Error('Erro ao preparar preview');
      }

      // Adicionar o elemento temporariamente ao DOM (invisível)
      base64Preview.style.position = 'absolute';
      base64Preview.style.left = '-9999px';
      base64Preview.style.top = '-9999px';
      base64Preview.style.width = '794px';
      base64Preview.style.minHeight = '1123px';
      base64Preview.style.padding = '40px';
      base64Preview.style.backgroundColor = '#ffffff';
      
      document.body.appendChild(base64Preview);

      // Aguardar um pouco para o DOM processar
      await new Promise(resolve => setTimeout(resolve, 500));

      showToast('Gerando PNG...', 'info');

      // Capturar com html2canvas
      const canvas = await html2canvas(base64Preview, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        onclone: (clonedDoc) => {
          // Garantir que todas as imagens estejam carregadas no clone
          const clonedImages = clonedDoc.querySelectorAll('img');
          clonedImages.forEach(img => {
            img.style.display = 'block';
          });
        }
      });

      // Remover elemento temporário
      document.body.removeChild(base64Preview);

      // Converter para PNG e fazer download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${folder.name.replace(/\s+/g, '_')}_catalogo.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          showToast('PNG gerado com sucesso!', 'success');
        }
      }, 'image/png', 1.0);
    } catch (error) {
      console.error('Erro ao gerar PNG:', error);
      showToast('Erro ao gerar PNG: ' + error.message, 'error');
    } finally {
      setIsGeneratingPNG(false);
    }
  };

  const sendWhatsApp = (folder: DigitalFolder) => {
    const message = `Olá! Preparei um catálogo especial para você: *${folder.name}*\n\n${folder.description || 'Confira os produtos selecionados!'}\n\nProdutos inclusos:\n${folder.products.map(p => `• ${p.name}`).join('\n')}\n\nEntre em contato para mais informações!`;
    const phone = folder.client_phone?.replace(/\D/g, '') || '';
    const whatsappUrl = `https://wa.me/55${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const sendEmail = (folder: DigitalFolder) => {
    const subject = `Catálogo Personalizado - ${folder.name}`;
    const body = `Olá ${folder.client_name || 'Cliente'},\n\nPreparei um catálogo especial para você: ${folder.name}\n\n${folder.description || 'Confira os produtos selecionados!'}\n\nProdutos inclusos:\n${folder.products.map(p => `• ${p.name} - ${p.category}`).join('\n')}\n\nPara mais informações, entre em contato conosco.\n\nAtenciosamente,\nEquipe Vital Cosméticos`;
    const mailtoUrl = `mailto:${folder.client_email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Folders Digitais</h1>
          <p className="text-gray-600">Crie catálogos personalizados para seus clientes</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-[#183263] text-white px-4 py-2 rounded-lg hover:bg-[#3a5a8c] transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Novo Folder</span>
        </button>
      </div>

      {/* Folders List */}
      <div className="bg-white rounded-lg shadow-sm border">
        {folders.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum folder encontrado</h3>
            <p className="text-gray-600 mb-6">Comece criando seu primeiro folder digital.</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-[#183263] text-white px-4 py-2 rounded-lg hover:bg-[#3a5a8c] transition-colors"
            >
              Criar Folder
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {folders.map((folder) => (
              <div key={folder.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-[#183263] rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{folder.name}</h3>
                      {folder.description && (
                        <p className="text-sm text-gray-600">{folder.description}</p>
                      )}
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="flex items-center text-sm text-gray-500">
                          <Package className="w-4 h-4 mr-1" />
                          {folder.products.length} produtos
                        </span>
                        {folder.client_name && (
                          <span className="flex items-center text-sm text-gray-500">
                            <Users className="w-4 h-4 mr-1" />
                            {folder.client_name}
                          </span>
                        )}
                        <span className="flex items-center text-sm text-gray-400">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(folder.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePreview(folder)}
                      className="p-2 text-gray-400 hover:text-[#183263] transition-colors"
                      title="Visualizar"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => generatePDF(folder)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Gerar PDF"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => generatePNG(folder)}
                      className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                      title="Gerar PNG"
                    >
                      <Image className="w-5 h-5" />
                    </button>
                    {folder.client_email && (
                      <button
                        onClick={() => sendEmail(folder)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Enviar por Email"
                      >
                        <Mail className="w-5 h-5" />
                      </button>
                    )}
                    {folder.client_phone && (
                      <button
                        onClick={() => sendWhatsApp(folder)}
                        className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                        title="Enviar por WhatsApp"
                      >
                        <MessageCircle className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(folder)}
                      className="p-2 text-gray-400 hover:text-[#183263] transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(folder.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Folder Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowForm(false)} />

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-6 pt-6 pb-4">
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900">
                      {editingFolder ? 'Editar Folder' : 'Novo Folder Digital'}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Crie um catálogo personalizado selecionando produtos específicos
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Informações do Folder */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nome do Folder *
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#183263] focus:border-[#183263]"
                          placeholder="Ex: Catálogo Cabelos Verão 2024"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Descrição
                        </label>
                        <input
                          type="text"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#183263] focus:border-[#183263]"
                          placeholder="Descrição opcional..."
                        />
                      </div>
                    </div>

                    {/* Seleção de Produtos */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Produtos *
                      </label>
                      <Select
                        isMulti
                        options={productOptions}
                        value={productOptions.filter(option => 
                          formData.selectedProducts.some(p => p.id === option.value)
                        )}
                        onChange={(selectedOptions) => {
                          const products = selectedOptions ? selectedOptions.map(option => option.product) : [];
                          setFormData({ ...formData, selectedProducts: products });
                        }}
                        placeholder="Selecione os produtos..."
                        className="basic-multi-select"
                        classNamePrefix="select"
                        styles={{
                          control: (base) => ({
                            ...base,
                            borderColor: '#d1d5db',
                            '&:hover': { borderColor: '#183263' },
                            '&:focus': { borderColor: '#183263', boxShadow: '0 0 0 1px #183263' }
                          })
                        }}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {formData.selectedProducts.length} produto(s) selecionado(s)
                      </p>
                    </div>

                    {/* Informações do Cliente */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Informações do Cliente (Opcional)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nome
                          </label>
                          <input
                            type="text"
                            value={formData.client_name}
                            onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#183263] focus:border-[#183263]"
                            placeholder="Nome do cliente"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            value={formData.client_email}
                            onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#183263] focus:border-[#183263]"
                            placeholder="email@exemplo.com"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Telefone
                          </label>
                          <input
                            type="tel"
                            value={formData.client_phone}
                            onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#183263] focus:border-[#183263]"
                            placeholder="(11) 99999-9999"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-[#183263] text-white rounded-md hover:bg-[#3a5a8c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isLoading ? (
                      <LoadingSpinner size="sm" className="text-white" />
                    ) : (
                      <>
                        <FileText className="w-4 h-4" />
                        <span>{editingFolder ? 'Salvar Alterações' : 'Criar Folder'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && previewFolder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowPreview(false)} />

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
              <div className="bg-white px-6 pt-6 pb-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    Prévia do Folder: {previewFolder.name}
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => generatePDF(previewFolder)}
                      disabled={isGeneratingPDF}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                    >
                      {isGeneratingPDF ? (
                        <LoadingSpinner size="sm" className="text-white" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                      <span>PDF</span>
                    </button>
                    <button
                      onClick={() => generatePNG(previewFolder)}
                      disabled={isGeneratingPNG}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                    >
                      {isGeneratingPNG ? (
                        <LoadingSpinner size="sm" className="text-white" />
                      ) : (
                        <Image className="w-4 h-4" />
                      )}
                      <span>PNG</span>
                    </button>
                    <button
                      onClick={() => setShowPreview(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Fechar
                    </button>
                  </div>
                </div>

                {/* PDF Preview Content */}
                <div className="max-h-[70vh] overflow-y-auto border rounded-lg">
                  <div ref={previewRef} className="bg-white" style={{ width: '794px', minHeight: '1123px', margin: '0 auto', padding: '40px' }}>
                    {/* Header com Logo */}
                    <div className="text-center mb-12 pb-8 border-b-2 border-[#7ed957]">
                      <div className="flex items-center justify-center mb-6">
                        <img 
                          src="/vital_cosmeticos.png" 
                          alt="Vital Cosméticos" 
                          className="h-20 object-contain"
                        />
                      </div>
                      <h1 className="text-4xl font-bold text-[#183263] mb-3">Vital Cosméticos</h1>
                      <div className="bg-gradient-to-r from-[#183263] to-[#7ed957] h-1 w-32 mx-auto mb-4"></div>
                      <h2 className="text-2xl font-semibold text-gray-800 mb-3">{previewFolder.name}</h2>
                      {previewFolder.description && (
                        <p className="text-lg text-gray-600 mb-4">{previewFolder.description}</p>
                      )}
                      {previewFolder.client_name && (
                        <div className="bg-[#f8f9fa] p-4 rounded-lg">
                          <p className="text-sm text-gray-600">Catálogo personalizado para:</p>
                          <p className="font-semibold text-[#183263]">{previewFolder.client_name}</p>
                        </div>
                      )}
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-3 gap-8 mb-12">
                      {previewFolder.products.map((product, index) => (
                        <div key={index} className="bg-white border-2 border-gray-200 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                          <ProductImage product={product} className="w-full h-40 object-contain rounded-lg mb-4 bg-gray-50" />
                          <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                          <p className="text-sm text-[#183263] font-semibold mb-2 bg-[#f0f9ff] px-3 py-1 rounded-full">{product.category}</p>
                          <p className="text-xs text-gray-500 mb-3">Ref: {product.reference}</p>
                          <div className="mt-3">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              product.stock === 'available' ? 'bg-green-100 text-green-800 border border-green-200' :
                              product.stock === 'out_of_stock' ? 'bg-red-100 text-red-800 border border-red-200' :
                              'bg-yellow-100 text-yellow-800 border border-yellow-200'
                            }`}>
                              {product.stock === 'available' ? '✓ Disponível' :
                               product.stock === 'out_of_stock' ? '✗ Esgotado' : '⏳ Em breve'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="mt-12 pt-8 border-t-2 border-[#7ed957] text-center">
                      <div className="bg-gradient-to-r from-[#183263] to-[#3a5a8c] text-white p-8 rounded-2xl">
                        <h3 className="text-2xl font-bold mb-4">Entre em contato conosco!</h3>
                        <p className="text-lg mb-4">Sua beleza é nossa prioridade</p>
                        <div className="flex items-center justify-center space-x-8 text-sm">
                          <div className="flex items-center space-x-2">
                            <Mail className="w-5 h-5 text-[#7ed957]" />
                            <span>contato@vitalcosmeticos.com.br</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MessageCircle className="w-5 h-5 text-[#7ed957]" />
                            <span>(11) 99999-9999</span>
                          </div>
                        </div>
                        <div className="mt-4 text-xs text-gray-300">
                          Catálogo gerado em {new Date().toLocaleDateString('pt-BR', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}