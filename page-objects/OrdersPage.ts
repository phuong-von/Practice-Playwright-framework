import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class OrdersPage extends BasePage {
  readonly title: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly orderCards: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.getByTestId('orders-title');
    this.searchInput = page.getByTestId('orders-search-input');
    this.searchButton = page.getByTestId('orders-search-btn');
    this.orderCards = page.getByTestId('order-card');
  }

  async open() {
    await this.goto('/orders');
  }

  async searchOrders(keyword: string) {
    await this.searchInput.fill(keyword);
    await this.searchButton.click();
  }

  getOrderCardByText(text: string): Locator {
    return this.orderCards.filter({ hasText: text });
  }

  async expectOrderVisible(text: string) {
    await expect(this.getOrderCardByText(text)).toBeVisible();
  }
}
