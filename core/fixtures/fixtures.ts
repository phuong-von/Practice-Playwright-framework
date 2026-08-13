import { test as base, request as apiRequest } from '@playwright/test';
import { LoginPage } from '../../page-objects/LoginPage';
import { HomePage } from '../../page-objects/HomePage';
import { CartPage } from '../../page-objects/CartPage';
import { CheckoutPage } from '../../page-objects/CheckoutPage';
import { ProfilePage } from '../../page-objects/ProfilePage';
import { OrdersPage } from '../../page-objects/OrdersPage';
import { OrdersApi, Product } from '../api/OrdersApi';

type MyFixtures = {
  loginPage: LoginPage;
  homePage: HomePage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  profilePage: ProfilePage;
  ordersPage: OrdersPage;
  primaryProduct: Product;
  secondaryProduct: Product;
};

type TestAccount = {
  username: string;
  password: string;
  name: string;
};

type WorkerFixtures = {
  catalogProducts: Product[];
  testAccount: TestAccount;
};

export const test = base.extend<MyFixtures, WorkerFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  profilePage: async ({ page }, use) => {
    await use(new ProfilePage(page));
  },
  ordersPage: async ({ page }, use) => {
    await use(new OrdersPage(page));
  },

  catalogProducts: [
    async ({ testAccount }, use) => {
      const apiContext = await apiRequest.newContext({
        baseURL: process.env.BASE_URL,
      });
      const { token } = await OrdersApi.login(
        apiContext,
        testAccount.username,
        testAccount.password
      );
      const products = await new OrdersApi(apiContext, token).getProducts();
      products.sort((a, b) => a.name.localeCompare(b.name));
      await use(products);
      await apiContext.dispose();
    },
    { scope: 'worker' },
  ],

  testAccount: [
    async ({}, use, workerInfo) => {
      const apiContext = await apiRequest.newContext({
        baseURL: process.env.BASE_URL,
      });
      const account: TestAccount = {
        username: `qa.w${workerInfo.workerIndex}.${Date.now()}`,
        password: 'QaAutomation@123',
        name: `QA Worker ${workerInfo.workerIndex}`,
      };
      await OrdersApi.register(apiContext, account);
      await use(account);
      await apiContext.dispose();
    },
    { scope: 'worker' },
  ],

  primaryProduct: async ({ catalogProducts }, use) => {
    const product = catalogProducts[0];
    if (!product)
      throw new Error('Catalog has no products to run this test with');
    await use(product);
  },

  secondaryProduct: async ({ catalogProducts }, use) => {
    const product = catalogProducts[1];
    if (!product)
      throw new Error(
        'Catalog needs at least 2 products to run this test with'
      );
    await use(product);
  },
});

export { expect } from '@playwright/test';
