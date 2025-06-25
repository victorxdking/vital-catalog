# 💄 Vital Catalog

<div align="center">
  <img src="public/vital_cosmeticos.png" alt="Vital Cosméticos" width="200" height="200" style="border-radius: 10px;">
  
  ### Catálogo Digital de Cosméticos Vital
  
  [![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
</div>

---

## 📖 Sobre o Projeto

O **Vital Catalog** é uma aplicação web moderna e responsiva desenvolvida para a Vital Cosméticos, oferecendo uma experiência completa de catálogo digital de produtos de beleza. A plataforma combina um design elegante com funcionalidades avançadas para proporcionar a melhor experiência tanto para clientes quanto para administradores.

### ✨ Principais Funcionalidades

#### 🛍️ **Para Clientes**
- **Catálogo Interativo**: Navegação fluida através dos produtos com filtros avançados
- **Sistema de Favoritos**: Salve seus produtos preferidos para consulta posterior
- **Busca Inteligente**: Encontre produtos rapidamente por nome, categoria ou características
- **Chat Flutuante**: Tire dúvidas sobre produtos específicos em tempo real
- **Design Responsivo**: Experiência otimizada para desktop, tablet e mobile
- **Páginas Informativas**: Seções dedicadas sobre a empresa e oportunidades de carreira

#### 👨‍💼 **Para Administradores**
- **Dashboard Completo**: Visão geral de estatísticas e métricas importantes
- **Gestão de Produtos**: CRUD completo com upload de imagens
- **Gerenciamento de Pastas**: Organização e exportação de catálogos em PDF
- **Central de Contatos**: Acompanhamento de leads e interações
- **Configurações**: Personalização de informações da empresa
- **Sistema de Autenticação**: Acesso seguro com diferentes níveis de permissão

---

## 🚀 Tecnologias Utilizadas

### **Frontend**
- **[React 18](https://reactjs.org/)** - Biblioteca JavaScript para interfaces de usuário
- **[TypeScript](https://www.typescriptlang.org/)** - Superset do JavaScript com tipagem estática
- **[Vite](https://vitejs.dev/)** - Build tool moderna e rápida
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utilitário
- **[React Router DOM](https://reactrouter.com/)** - Roteamento do lado do cliente
- **[React Hook Form](https://react-hook-form.com/)** - Gerenciamento de formulários performático
- **[Lucide React](https://lucide.dev/)** - Biblioteca de ícones moderna

### **Backend & Banco de Dados**
- **[Supabase](https://supabase.com/)** - Backend as a Service (BaaS)
  - Banco de dados PostgreSQL
  - Autenticação integrada
  - Storage para imagens
  - APIs RESTful automáticas

### **Funcionalidades Especiais**
- **[html2canvas](https://html2canvas.hertzen.com/)** - Captura de tela de elementos HTML
- **[jsPDF](https://github.com/parallax/jsPDF)** - Geração de PDFs do lado do cliente
- **[React Select](https://react-select.com/)** - Componentes de seleção avançados

### **Desenvolvimento**
- **[ESLint](https://eslint.org/)** - Linting de código
- **[PostCSS](https://postcss.org/)** - Processamento de CSS
- **[Autoprefixer](https://autoprefixer.github.io/)** - Prefixos CSS automáticos

---

## 📁 Estrutura do Projeto

```
vital-catalog/
├── public/                     # Arquivos públicos
│   ├── vital_cosmeticos.png   # Logo da empresa
│   └── vital 1.mp4           # Vídeo promocional
├── src/
│   ├── components/            # Componentes reutilizáveis
│   │   ├── admin/            # Componentes da área administrativa
│   │   ├── Header.tsx        # Cabeçalho principal
│   │   ├── Footer.tsx        # Rodapé
│   │   ├── ProductCard.tsx   # Card de produto
│   │   ├── FloatingChat.tsx  # Chat flutuante
│   │   └── ...
│   ├── pages/                # Páginas da aplicação
│   │   ├── admin/           # Páginas administrativas
│   │   ├── Home.tsx         # Página inicial
│   │   ├── About.tsx        # Sobre a empresa
│   │   ├── Careers.tsx      # Carreiras
│   │   ├── Favorites.tsx    # Favoritos
│   │   └── Login.tsx        # Login
│   ├── context/             # Context API
│   ├── hooks/               # Custom hooks
│   ├── lib/                 # Configurações (Supabase)
│   ├── types/               # Definições TypeScript
│   └── main.tsx            # Ponto de entrada
├── package.json
└── README.md
```

---

## ⚙️ Configuração e Instalação

### **Pré-requisitos**
- Node.js 18+ 
- npm ou yarn
- Conta no Supabase

### **1. Clone o repositório**
```bash
git clone https://github.com/seu-usuario/vital-catalog.git
cd vital-catalog
```

### **2. Instale as dependências**
```bash
npm install
```

### **3. Configure as variáveis de ambiente**
Crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

### **4. Configure o Supabase**
1. Crie um novo projeto no [Supabase](https://supabase.com/)
2. Configure as tabelas necessárias (schema SQL disponível na documentação)
3. Configure as políticas de RLS (Row Level Security)
4. Configure o Storage para upload de imagens

### **5. Execute o projeto**
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

---

## 🎯 Scripts Disponíveis

```bash
npm run dev      # Inicia o servidor de desenvolvimento
npm run build    # Gera build de produção
npm run preview  # Preview do build de produção
npm run lint     # Executa o linting do código
```

---

## 🌟 Funcionalidades Detalhadas

### **Sistema de Autenticação**
- Login seguro com email e senha
- Diferentes níveis de acesso (cliente/admin)
- Proteção de rotas administrativas
- Sessão persistente

### **Gestão de Produtos**
- CRUD completo de produtos
- Upload múltiplo de imagens
- Categorização flexível
- Filtros avançados (preço, categoria, disponibilidade)
- Busca em tempo real

### **Sistema de Favoritos**
- Adicionar/remover produtos dos favoritos
- Persistência no localStorage
- Sincronização com conta do usuário
- Interface intuitiva

### **Chat Flutuante**
- Interface de chat moderna
- Integração com produtos selecionados
- Notificações em tempo real
- Design responsivo

### **Geração de PDFs**
- Catálogos personalizados
- Layout profissional
- Exportação de listas de produtos
- Otimização para impressão

---

## 📱 Design Responsivo

O Vital Catalog foi desenvolvido com uma abordagem **mobile-first**, garantindo uma experiência excepcional em todos os dispositivos:

- **📱 Mobile**: Interface otimizada para telas pequenas
- **📱 Tablet**: Layout adaptativo para tablets
- **🖥️ Desktop**: Experiência completa para desktops
- **🖨️ Print**: Estilos específicos para impressão

---

## 🎨 Paleta de Cores

- **Primária**: `#183263` (Azul Corporativo)
- **Secundária**: `#2563eb` (Azul Vibrante)
- **Accent**: `#ec4899` (Rosa)
- **Neutros**: Tons de cinza para textos e backgrounds

---

## 🔒 Segurança

- **Autenticação JWT** via Supabase
- **Row Level Security (RLS)** no banco de dados
- **Validação de entrada** em todos os formulários
- **Sanitização de dados** antes do armazenamento
- **HTTPS obrigatório** em produção

---

## 📈 Performance

- **Lazy Loading** de imagens
- **Code Splitting** automático
- **Otimização de bundle** com Vite
- **Cache inteligente** de requests
- **Compressão de imagens**

---

## 🤝 Contribuindo

1. Faça o fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 📞 Contato

**Vital Cosméticos**
- 📧 Email: contato@vitalcosmeticos.com.br
- 📱 WhatsApp: (11) 99999-9999
- 🌐 Website: [www.vitalcosmeticos.com.br](https://www.vitalcosmeticos.com.br)

---

<div align="center">
  <p>Desenvolvido com ❤️ pela equipe Vital Cosméticos</p>
  <p>© 2024 Vital Cosméticos. Todos os direitos reservados.</p>
</div> 