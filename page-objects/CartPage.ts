import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { CheckoutPage } from './CheckoutPage';

export class CartPage extends BasePage {
  readonly cartItem: Locator;
  readonly checkoutButton: Locator;
  readonly emptyCartMessage: Locator;
  constructor(page: Page) {
    super(page);
    this.cartItem = page.locator('.cart-item');
    this.checkoutButton = page.getByRole('button', { name: 'Thanh toán ngay' });
    this.emptyCartMessage = page.locator('.cart-empty');
  }
  async open() {
    await this.goto('/cart');
  }
  getCartItem(productName: string): Locator {
    return this.cartItem.filter({
      has: this.page.getByRole('heading', { name: productName }),
    });
  }
  getItemQty(productName: string): Locator {
    return this.getCartItem(productName).locator('.qty-value');
  }
  async removeItem(productName: string) {
    const item = this.getCartItem(productName);
    await item.locator('.remove-btn').click();
  }

  async getItemQuantity(productName: string): Promise<number> {
    const qtyLocator = this.getItemQty(productName);
    if ((await qtyLocator.count()) === 0) return 0;
    return Number(await qtyLocator.textContent()) || 0;
  }
  async expectProductInCart(productName: string, expectedQuantity: number) {
    await expect(this.getCartItem(productName)).toBeVisible();
    await expect(this.getItemQty(productName)).toHaveText(
      expectedQuantity.toString()
    );
  }
  async expectProductNotInCart(productName: string) {
    await expect(this.getCartItem(productName)).not.toBeVisible();
  }
  async clearCart() {
    if (await this.emptyCartMessage.isVisible()) return;
    while ((await this.cartItem.count()) > 0) {
      await this.cartItem.first().locator('.remove-btn').click();
    }
    await expect(this.emptyCartMessage).toBeVisible();
  }
  async expectCartEmpty() {
    await expect(this.emptyCartMessage).toBeVisible();
  }

  async proceedToCheckout(): Promise<CheckoutPage> {
    await this.checkoutButton.click();
    await expect(this.page).toHaveURL(/checkout/);
    return new CheckoutPage(this.page);
  }
}
