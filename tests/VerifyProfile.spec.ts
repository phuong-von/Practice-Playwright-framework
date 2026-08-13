import { test, expect } from '../core/fixtures/fixtures';

test.beforeEach(async ({ loginPage, testAccount }) => {
  await loginPage.open();
  const homePage = await loginPage.login(
    testAccount.username,
    testAccount.password
  );
  await expect(homePage.page).toHaveURL(/home/);
  await expect(homePage.headerUsername).toContainText('Xin chào');
});

test.describe('Profile - Update full name', () => {
  test('TC-PROFILE-01 - Verify that the user can update and revert their full name', async ({
    profilePage,
  }) => {
    await profilePage.open();
    const originalName = await profilePage.getFullName();
    const newName = originalName + ' - Updated';

    try {
      await profilePage.updateFullName(newName);
      await expect(profilePage.nameInput).toHaveValue(newName);

      await profilePage.reload();
      await expect(profilePage.nameInput).toHaveValue(newName);
    } finally {
      await profilePage.reload();
      await profilePage.updateFullName(originalName);
      await expect(profilePage.nameInput).toHaveValue(originalName);
    }
  });
});
