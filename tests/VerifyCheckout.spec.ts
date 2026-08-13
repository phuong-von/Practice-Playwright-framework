import { test, expect } from '../core/fixtures/fixtures';
import testDataJson from '../data/testdata.json';
import { TestData } from '../data/checkout.data';

const checkoutData = testDataJson as TestData;

test.beforeEach(async ({ loginPage, cartPage, testAccount }) => {
  await loginPage.open();
  const homePage = await loginPage.login(
    testAccount.username,
    testAccount.password
  );
  await expect(homePage.page).toHaveURL(/home/);
  await expect(homePage.headerUsername).toContainText('Xin chào');

  await cartPage.open();
  await cartPage.clearCart();
});

test.describe('Checkout process', () => {
  test('TC-CHECKOUT-01 - Verify that the user can complete checkout with COD payment', async ({
    homePage,
    cartPage,
    checkoutPage,
    primaryProduct,
  }) => {
    await homePage.open();
    await homePage.addProductToCart(primaryProduct.name);
    await homePage.openCartPage();
    await cartPage.proceedToCheckout();
    await checkoutPage.checkout(checkoutData, 'cod');
    await checkoutPage.expectCheckoutSuccess();
  });
});
