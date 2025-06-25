# 🛍️ Vital Catalog

<div align="center">
  
### 📦 Sistema de Catálogo Digital para Gestão de Produtos
  
[![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

</div>

---

## 📖 Sobre o Projeto

O **Vital Catalog** é uma aplicação web moderna e responsiva para gestão e exibição de catálogos digitais de produtos. A plataforma oferece uma solução completa para empresas que desejam apresentar seus produtos de forma elegante e profissional, combinando funcionalidades avançadas tanto para clientes quanto para administradores.

### ✨ Principais Funcionalidades

#### 🛍️ **Para Clientes**
- **Catálogo Interativo**: Navegação fluida através dos produtos com filtros avançados
- **Sistema de Favoritos**: Salve produtos preferidos para consulta posterior
- **Busca Inteligente**: Encontre produtos rapidamente por nome, categoria ou características
- **Chat de Suporte**: Interface para tirar dúvidas sobre produtos específicos
- **Design Responsivo**: Experiência otimizada para desktop, tablet e mobile
- **Páginas Institucionais**: Seções sobre a empresa e oportunidades de carreira

#### 👨‍💼 **Para Administradores**
- **Dashboard Analítico**: Visão geral de estatísticas e métricas importantes
- **Gestão Completa de Produtos**: CRUD completo com upload múltiplo de imagens
- **Gerenciamento de Categorias**: Organização flexível dos produtos
- **Exportação de Catálogos**: Geração de PDFs profissionais para impressão
- **Central de Contatos**: Acompanhamento de leads e interações de clientes
- **Configurações do Sistema**: Personalização de informações da empresa
- **Sistema de Autenticação**: Controle de acesso com diferentes níveis de permissão

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
│   ├── vital_cosmeticos.png   # Logo da aplicação
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
│   │   ├── Home.tsx         # Página inicial (catálogo)
│   │   ├── About.tsx        # Sobre a empresa
│   │   ├── Careers.tsx      # Carreiras
│   │   ├── Favorites.tsx    # Produtos favoritos
│   │   └── Login.tsx        # Autenticação
│   ├── context/             # Context API (estado global)
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

⚠️ **CONFIGURAÇÃO DAS CREDENCIAIS:**

O projeto inclui um arquivo `.env` com valores de template. **Edite este arquivo com suas credenciais reais do Supabase.**

1. **Edite o arquivo `.env` na raiz do projeto:**
   ```env
   # Substitua pelos seus valores reais:
   VITE_SUPABASE_URL=https://seuprojetoid.supabase.co
   VITE_SUPABASE_ANON_KEY=sua_chave_anonima_real_aqui
   ```

2. **Onde encontrar suas credenciais do Supabase:**
   - Acesse [Supabase Dashboard](https://supabase.com/)
   - Vá em **Settings > API**
   - Copie a **Project URL** → `VITE_SUPABASE_URL`
   - Copie a **anon public key** → `VITE_SUPABASE_ANON_KEY`

**🔐 Sobre segurança:**
- O arquivo `.env` está no repositório apenas como template
- Após clonar, cada desenvolvedor edita com suas próprias credenciais
- Em produção, configure as variáveis no painel da plataforma de deploy

### **4. Configure o Supabase**
1. Crie um novo projeto no [Supabase](https://supabase.com/)
2. Configure as tabelas necessárias:
   - `products` - Armazenamento dos produtos
   - `categories` - Categorias dos produtos
   - `contacts` - Contatos/leads dos clientes
   - `users` - Usuários do sistema
3. Configure as políticas de RLS (Row Level Security)
4. Configure o Storage para upload de imagens dos produtos

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
- Upload múltiplo de imagens com preview
- Categorização flexível e personalizável
- Filtros avançados (preço, categoria, disponibilidade)
- Busca em tempo real por múltiplos campos
- Controle de estoque e disponibilidade

### **Sistema de Favoritos**
- Adicionar/remover produtos dos favoritos
- Persistência no localStorage
- Sincronização com conta do usuário
- Interface intuitiva e responsiva

### **Chat de Suporte**
- Interface de chat moderna e limpa
- Integração com produtos selecionados
- Sistema de notificações
- Design completamente responsivo

### **Geração de Catálogos PDF**
- Exportação de catálogos personalizados
- Layout profissional e customizável
- Seleção específica de produtos
- Otimização para impressão comercial

### **Dashboard Administrativo**
- Métricas em tempo real
- Gráficos e estatísticas de produtos
- Acompanhamento de interações
- Relatórios de performance

---

## 📱 Design Responsivo

Desenvolvido com abordagem **mobile-first**, garantindo experiência excepcional em todos os dispositivos:

- **📱 Mobile**: Interface otimizada para smartphones
- **📱 Tablet**: Layout adaptativo para tablets
- **🖥️ Desktop**: Experiência completa para desktops
- **🖨️ Print**: Estilos específicos para impressão

---

## 🎨 Sistema de Design

### **Paleta de Cores**
- **Primária**: `#183263` (Azul Profissional)
- **Secundária**: `#2563eb` (Azul Vibrante)
- **Accent**: `#ec4899` (Rosa Destaque)
- **Neutros**: Escala de cinzas para textos e backgrounds

### **Tipografia**
- Font system stack otimizada para legibilidade
- Hierarquia visual clara
- Responsividade em todas as telas

---

## 🔒 Segurança

- **Autenticação JWT** via Supabase
- **Row Level Security (RLS)** no banco de dados
- **Validação rigorosa** de entrada em todos os formulários
- **Sanitização de dados** antes do armazenamento
- **HTTPS obrigatório** em produção
- **Controle de permissões** por nível de usuário

---

## 📈 Performance

- **Lazy Loading** inteligente de imagens
- **Code Splitting** automático por rotas
- **Otimização de bundle** com Vite
- **Cache estratégico** de requests da API
- **Compressão automática** de assets
- **Lighthouse Score** otimizado

---

## 🚀 Deploy

### **⚠️ Antes do Deploy - Variáveis de Ambiente**

**IMPORTANTE:** O arquivo `.env` no repositório contém apenas valores de template. Em produção, você deve configurar suas credenciais reais nas variáveis de ambiente da plataforma.

**Para Vercel:**
1. Conecte seu repositório no Vercel
2. Vá em **Settings > Environment Variables**
3. Adicione suas credenciais reais:
   - `VITE_SUPABASE_URL` = `https://seuprojetoid.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `sua_chave_anonima_real`

**Para Netlify:**
1. Conecte seu repositório no Netlify
2. Vá em **Site Settings > Environment Variables**
3. Adicione as mesmas variáveis acima

### **Comandos de Deploy:**

**Vercel (Recomendado):**
```bash
npm run build
npx vercel --prod
```

**Netlify:**
```bash
npm run build
npx netlify deploy --prod --dir=dist
```

**Docker:**
```bash
# Build passando as variáveis como argumentos
docker build \
  --build-arg VITE_SUPABASE_URL=https://seuprojetoid.supabase.co \
  --build-arg VITE_SUPABASE_ANON_KEY=sua_chave_real \
  -t vital-catalog .

docker run -p 3000:80 vital-catalog
```

---

## 🤝 Contribuindo

1. Faça o fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Add: Nova funcionalidade incrível'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<div align="center">
  <p>⭐ Se este projeto foi útil para você, considere dar uma estrela!</p>
  <p>🔧 Desenvolvido com React, TypeScript e muito ☕</p>
</div>

