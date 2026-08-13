import { test, expect } from '../core/fixtures/fixtures';
import { OrdersApi } from '../core/api/OrdersApi';
import seedOrderTestDataJson from '../data/seedOrderTestData.json';
import { SeedOrderTestData } from '../data/seedOrder.data';

const seedOrderData = seedOrderTestDataJson as SeedOrderTestData;

test.describe('Orders page', () => {
  test('TC-ORDERS-01 - Verify a seeded order appears on the Orders page', async ({
    request,
    loginPage,
    ordersPage,
    primaryProduct: product,
    testAccount,
  }) => {
    const { username, password } = testAccount;

    const { token } = await OrdersApi.login(request, username, password);
    const ordersApi = new OrdersApi(request, token);

    const recipientName = `QA Automation ${Date.now()}`;
    const seededOrder = await ordersApi.createOrder({
      items: [
        {
          productId: product.id ?? product._id,
          name: product.name,
          price: product.price,
          quantity: 1,
          emoji: product.emoji,
        },
      ],
      recipientName,
      recipientPhone: seedOrderData.recipientPhone,
      address: seedOrderData.address,
      paymentMethod: seedOrderData.paymentMethod,
      totalPrice: product.price,
    });

    try {
      await loginPage.open();
      const homePage = await loginPage.login(username, password);
      await expect(homePage.page).toHaveURL(/home/);

      await ordersPage.open();
      await ordersPage.searchOrders(recipientName);

      const orderCard = ordersPage.getOrderCardByText(recipientName);
      await expect(orderCard).toBeVisible();
      await expect(orderCard).toContainText(product.name);
      await expect(orderCard).toContainText(seedOrderData.address);
      await expect(orderCard).toContainText(
        `${product.price.toLocaleString('vi-VN')}đ`
      );
    } finally {
      await ordersApi.deleteOrder(seededOrder.id ?? seededOrder._id);
    }
  });
});
