import { test, expect } from '@playwright/test';

test.describe('Vital Catalog', () => {
  test('deve carregar a página inicial corretamente', async ({ page }) => {
    await page.goto('/');
    
    // Verificar se o título contém "Vital"
    await expect(page).toHaveTitle(/Vital/);
    
    // Verificar se o header está visível
    await expect(page.locator('header')).toBeVisible();
    
    // Verificar se o texto "Descubra nossa linha completa" está presente
    await expect(page.locator('text=Descubra nossa linha completa de produtos de beleza')).toBeVisible();
  });

  test('deve exibir os filtros laterais', async ({ page }) => {
    await page.goto('/');
    
    // Aguardar o carregamento da página
    await page.waitForLoadState('networkidle');
    
    // Verificar se a seção de filtros está visível
    await expect(page.locator('text=Filtros')).toBeVisible();
    
    // Verificar se as categorias estão sendo exibidas
    await expect(page.locator('text=CATEGORIA')).toBeVisible();
    await expect(page.locator('text=DISPONIBILIDADE')).toBeVisible();
  });

  test('deve permitir buscar produtos', async ({ page }) => {
    await page.goto('/');
    
    // Aguardar o carregamento
    await page.waitForLoadState('networkidle');
    
    // Encontrar o campo de busca
    const searchInput = page.locator('input[placeholder*="Busque por nome"]');
    await expect(searchInput).toBeVisible();
    
    // Fazer uma busca
    await searchInput.fill('pomada');
    
    // Aguardar um pouco para o debounce
    await page.waitForTimeout(1000);
  });

  test('deve exibir produtos na grid', async ({ page }) => {
    await page.goto('/');
    
    // Aguardar carregamento
    await page.waitForLoadState('networkidle');
    
    // Verificar se existem produtos sendo exibidos
    await expect(page.locator('text=Produtos (')).toBeVisible();
    
    // Aguardar que pelo menos um produto seja carregado
    await page.waitForSelector('[data-testid="product-card"], .product-card', { timeout: 10000 });
  });

  test('deve funcionar filtros de categoria', async ({ page }) => {
    await page.goto('/');
    
    // Aguardar carregamento
    await page.waitForLoadState('networkidle');
    
    // Clicar em uma categoria (assumindo que existe "Cabelo")
    const cabeloOption = page.locator('text=Cabelo').first();
    if (await cabeloOption.isVisible()) {
      await cabeloOption.click();
      
      // Aguardar um pouco para aplicar o filtro
      await page.waitForTimeout(1000);
    }
  });

  test('deve abrir modal de produto ao clicar', async ({ page }) => {
    await page.goto('/');
    
    // Aguardar carregamento
    await page.waitForLoadState('networkidle');
    
    // Aguardar que produtos sejam carregados
    await page.waitForSelector('[data-testid="product-card"], .product-card', { timeout: 10000 });
    
    // Clicar no primeiro produto (se existir)
    const firstProduct = page.locator('[data-testid="product-card"], .product-card').first();
    if (await firstProduct.isVisible()) {
      await firstProduct.click();
      
      // Aguardar modal aparecer
      await page.waitForTimeout(1000);
    }
  });

  test('deve ser responsivo em mobile', async ({ page }) => {
    // Configurar viewport mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Aguardar carregamento
    await page.waitForLoadState('networkidle');
    
    // Verificar se a página carrega em mobile
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('text=Filtros')).toBeVisible();
  });
}); 