# 🎭 MCP Playwright no Cursor - Guia Completo

## 📋 O que foi instalado:

### ✅ **Playwright Test Framework**
- `@playwright/test` - Framework de testes automatizados
- Suporte para Chrome, Firefox, Safari e Edge
- Testes mobile (Android/iOS)
- Screenshots e vídeos automáticos

### ✅ **Configuração MCP**
- Integração com Cursor IDE
- Scripts helper personalizados
- Configuração para o projeto Vital Catalog

---

## 🚀 **Como usar no Cursor:**

### **1. Comandos Disponíveis via npm:**

```bash
# Executar todos os testes
npm run test

# Abrir interface visual do Playwright
npm run test:ui

# Executar testes com browser visível
npm run test:headed

# Debug interativo de testes
npm run test:debug

# Ver relatório de testes
npm run test:report
```

### **2. Comandos Playwright Diretos:**

```bash
# Gerar código de teste automaticamente
npx playwright codegen http://localhost:5175

# Executar apenas um teste específico
npx playwright test tests/example.spec.ts

# Executar testes apenas no Chrome
npx playwright test --project=chromium

# Executar testes mobile
npx playwright test --project="Mobile Chrome"
```

---

## 🎯 **Casos de Uso Principais:**

### **1. Testar Funcionalidades:**
- ✅ Verificar se filtros funcionam
- ✅ Testar busca de produtos
- ✅ Validar modal de produtos
- ✅ Testar responsividade mobile

### **2. Gerar Testes Automaticamente:**
```bash
# Abrir codegen para gravar ações
npx playwright codegen http://localhost:5175
```

### **3. Debug Visual:**
```bash
# Abrir UI para debug interativo
npm run test:ui
```

### **4. Executar Testes Específicos:**
```bash
# Apenas testes de login
npx playwright test --grep "login"

# Apenas testes mobile
npx playwright test --project="Mobile Chrome"
```

---

## 📁 **Estrutura de Arquivos:**

```
vital-catalog/
├── playwright.config.ts       # Configuração principal
├── tests/                     # Pasta de testes
│   └── example.spec.ts        # Teste de exemplo
├── scripts/
│   └── mcp-playwright.js      # Script helper para MCP
├── .cursor/
│   └── config.json           # Configuração do Cursor
└── test-results/             # Resultados e screenshots
```

---

## 🛠 **Configuração Atual:**

### **Base URL:** `http://localhost:5175`
### **Browsers Configurados:**
- ✅ Chrome Desktop
- ✅ Firefox Desktop  
- ✅ Safari Desktop
- ✅ Edge Desktop
- ✅ Chrome Mobile
- ✅ Safari Mobile

### **Recursos Habilitados:**
- 📸 Screenshots on failure
- 🎥 Video recording on failure
- 🔍 Trace on retry
- 📊 HTML Reports

---

## 💡 **Dicas de Uso no Cursor:**

### **1. Para criar novos testes:**
1. Use `npx playwright codegen` para gravar ações
2. Copie o código gerado para um novo arquivo `.spec.ts`
3. Customize conforme necessário

### **2. Para debug:**
1. Use `npm run test:debug` para debug interativo
2. Use `npm run test:ui` para interface visual
3. Verifique screenshots em `test-results/`

### **3. Para CI/CD:**
```bash
# Executar todos os testes sem interface
npm run test

# Gerar relatório HTML
npm run test:report
```

---

## 🔧 **Integração com Cursor:**

O MCP está configurado em `.cursor/config.json` e permite:

- 🤖 Execução de testes via AI
- 📝 Geração automática de código
- 🔍 Análise de resultados
- 🐛 Debug assistido por IA

---

## 📊 **Exemplo de Teste:**

```typescript
import { test, expect } from '@playwright/test';

test('deve testar filtro de categoria', async ({ page }) => {
  await page.goto('/');
  
  // Clicar no filtro de categoria
  await page.click('text=Cabelo');
  
  // Verificar se produtos foram filtrados
  await expect(page.locator('[data-testid="product-card"]')).toBeVisible();
  
  // Screenshot para debug
  await page.screenshot({ path: 'filtro-cabelo.png' });
});
```

---

## 🎉 **Pronto para usar!**

Agora você pode:
1. **Testar automaticamente** seu aplicativo
2. **Gerar testes** com codegen
3. **Debug visualmente** com a UI
4. **Integrar com CI/CD** facilmente

Use `npm run test:ui` para começar! 🚀 