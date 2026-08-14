import { test } from '../core/fixtures/fixtures';

test.beforeEach(async ({ emptyCart }) => {
  void emptyCart;
});

test.describe('Add product to cart', () => {
  test('TC-CART-01 - Verify that the user can add a product to the cart', async ({
    homePage,
    cartPage,
    primaryProduct,
  }) => {
    await homePage.open();
    await homePage.addProductToCart(primaryProduct.name);
    await homePage.expectCartCount('1');
    await homePage.openCartPage();
    await cartPage.expectProductInCart(primaryProduct.name, 1);
  });
  test('TC-CART-02 - Verify that adding the same product again increases its quantity', async ({
    homePage,
    cartPage,
    primaryProduct,
  }) => {
    await homePage.open();
    await homePage.addProductToCart(primaryProduct.name);
    await homePage.addProductToCart(primaryProduct.name);
    await homePage.expectCartCount('2');
    await homePage.openCartPage();
    await cartPage.expectProductInCart(primaryProduct.name, 2);
  });
});

test.describe('Remove product from cart', () => {
  test('TC-CART-03 - Verify that the user can remove a product from the cart', async ({
    homePage,
    cartPage,
    primaryProduct,
  }) => {
    await homePage.open();
    await homePage.addProductToCart(primaryProduct.name);
    await homePage.openCartPage();
    await cartPage.removeItem(primaryProduct.name);
    await cartPage.expectProductNotInCart(primaryProduct.name);
    await cartPage.expectCartEmpty();
  });
  test('TC-CART-04 - Verify that the user can remove multiple products from the cart', async ({
    homePage,
    cartPage,
    primaryProduct,
    secondaryProduct,
  }) => {
    await homePage.open();
    await homePage.addProductToCart(primaryProduct.name);
    await homePage.addProductToCart(secondaryProduct.name);
    await homePage.openCartPage();
    await cartPage.removeItem(primaryProduct.name);
    await cartPage.expectProductNotInCart(primaryProduct.name);
    await cartPage.expectProductInCart(secondaryProduct.name, 1);

    await cartPage.removeItem(secondaryProduct.name);
    await cartPage.expectProductNotInCart(secondaryProduct.name);
    await cartPage.expectCartEmpty();
  });
});
test.describe('Checkout process', () => {
  test('TC-CART-05 - Verify that the user can proceed to checkout', async ({
    homePage,
    cartPage,
    primaryProduct,
  }) => {
    await homePage.open();
    await homePage.addProductToCart(primaryProduct.name);
    await homePage.openCartPage();
    await cartPage.proceedToCheckout();
  });
});
