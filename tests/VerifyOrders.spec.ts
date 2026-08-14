import { test, expect } from '../core/fixtures/fixtures';
import seedOrderTestDataJson from '../data/seedOrderTestData.json';
import { SeedOrderTestData } from '../data/seedOrder.data';

const seedOrderData = seedOrderTestDataJson as SeedOrderTestData;

test.describe('Orders page', () => {
  test('TC-ORDERS-01 - Verify a seeded order appears on the Orders page', async ({
    loggedInHomePage,
    ordersPage,
    primaryProduct: product,
    seededOrder,
  }) => {
    void loggedInHomePage;
    const { recipientName } = seededOrder;

    await ordersPage.open();
    await ordersPage.searchOrders(recipientName);

    const orderCard = ordersPage.getOrderCardByText(recipientName);
    await expect(orderCard).toBeVisible();
    await expect(orderCard).toContainText(product.name);
    await expect(orderCard).toContainText(seedOrderData.address);
  });
});
