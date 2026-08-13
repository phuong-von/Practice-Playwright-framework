import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { TestData } from '../data/checkout.data';

export class CheckoutPage extends BasePage {
  readonly nameInput: Locator;
  readonly phoneInput: Locator;
  readonly addressInput: Locator;
  readonly codPaymentOption: Locator;
  readonly cardPaymentOption: Locator;
  readonly checkoutButton: Locator;
  readonly successHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.nameInput = page.getByTestId('checkout-name');
    this.phoneInput = page.getByTestId('checkout-phone');
    this.addressInput = page.getByTestId('checkout-address');
    this.codPaymentOption = page.locator('label.payment-option', {
      hasText: 'Thanh toán khi nhận hàng',
    });
    this.cardPaymentOption = page.locator('label.payment-option', {
      hasText: 'Thanh toán bằng thẻ',
    });
    this.checkoutButton = page.getByTestId('checkout-submit');
    this.successHeading = page.getByTestId('checkout-success-heading');
  }
  async open() {
    await this.goto('/checkout');
  }

  async fillCheckoutForm(checkoutData: TestData) {
    await this.nameInput.fill(checkoutData.nameInput);
    await this.phoneInput.fill(checkoutData.phoneInput);
    await this.addressInput.fill(checkoutData.addressInput);
  }
  async selectCodPayment() {
    await this.codPaymentOption.click();
  }

  async selectCardPayment() {
    await this.cardPaymentOption.click();
  }

  async submitCheckout() {
    await this.checkoutButton.click();
  }

  async expectCheckoutSuccess() {
    await expect(this.successHeading).toHaveText('Đặt hàng thành công!');
  }

  async checkout(
    checkoutData: TestData,
    paymentMethod: 'cod' | 'card' = 'cod'
  ) {
    await this.fillCheckoutForm(checkoutData);
    if (paymentMethod === 'cod') {
      await this.selectCodPayment();
    } else {
      await this.selectCardPayment();
    }
    await this.submitCheckout();
  }
}
