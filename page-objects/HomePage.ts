import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly productItems: Locator;
  readonly cartBadge: Locator;
  readonly cartButton: Locator;
  readonly headerUsername: Locator;

  constructor(page: Page) {
    super(page);
    this.productItems = page.locator('.product-card');
    this.cartBadge = page.locator('.cart-badge');
    this.cartButton = page.locator('.cart-btn');
    this.headerUsername = page.getByTestId('header-username');
  }

  async open() {
    await this.goto('/home');
  }

  async addProductToCart(productName: string) {
    const card = this.productItems.filter({
      has: this.page.getByRole('heading', { name: productName }),
    });
    await card.getByRole('button').filter({ hasText: 'Thêm vào giỏ' }).click();
    await expect(this.cartBadge).toBeVisible();
  }
  async expectCartCount(expectedCount: string) {
    await expect(this.cartBadge).toHaveText(expectedCount);
  }

  async getCartCount(): Promise<number> {
    if ((await this.cartBadge.count()) === 0) return 0;
    const text = await this.cartBadge.textContent();
    return Number(text) || 0;
  }

  async openCartPage() {
    await this.cartButton.click();
    await expect(this.page).toHaveURL(/cart/);
  }

  async getHeaderUsername(): Promise<string> {
    return (await this.headerUsername.textContent()) ?? '';
  }
}
