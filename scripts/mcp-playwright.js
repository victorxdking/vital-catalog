#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Script helper para integração MCP Playwright com Cursor
const playwrightActions = {
  // Executar testes
  test: (args = []) => {
    return spawn('npx', ['playwright', 'test', ...args], {
      stdio: 'inherit',
      shell: true
    });
  },

  // Abrir UI do Playwright
  ui: () => {
    return spawn('npx', ['playwright', 'test', '--ui'], {
      stdio: 'inherit',
      shell: true
    });
  },

  // Gerar código de teste
  codegen: (url = 'http://localhost:5175') => {
    return spawn('npx', ['playwright', 'codegen', url], {
      stdio: 'inherit',
      shell: true
    });
  },

  // Mostrar relatório
  report: () => {
    return spawn('npx', ['playwright', 'show-report'], {
      stdio: 'inherit',
      shell: true
    });
  }
};

// Processar argumentos da linha de comando
const action = process.argv[2] || 'test';
const args = process.argv.slice(3);

if (playwrightActions[action]) {
  const process = playwrightActions[action](args);
  
  process.on('close', (code) => {
    console.log(`Playwright ${action} finalizado com código ${code}`);
  });
} else {
  console.log('Ações disponíveis: test, ui, codegen, report');
  console.log('Uso: node scripts/mcp-playwright.js [ação] [argumentos]');
} 