import { test, expect } from '../core/fixtures/fixtures';

test.describe('Login Tests', () => {
  test('TC-LOGIN-01 - Verify login fails when username and password are empty', async ({
    loginPage,
  }) => {
    await loginPage.open();
    await loginPage.login('', '');
    await expect(loginPage.errorMessage).toContainText(
      'Vui lòng nhập đầy đủ tài khoản và mật khẩu.'
    );
  });

  test('TC-LOGIN-02 - Verify login succeeds with valid username and password', async ({
    loginPage,
    testAccount,
  }) => {
    await loginPage.open();
    const homePage = await loginPage.login(
      testAccount.username,
      testAccount.password
    );
    await expect(homePage.page).toHaveURL(/home/);
    await expect(homePage.headerUsername).toContainText('Xin chào');
  });
});
