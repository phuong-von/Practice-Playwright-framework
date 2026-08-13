import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProfilePage extends BasePage {
  readonly nameInput: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    super(page);
    this.nameInput = page.getByTestId('profile-name');
    this.saveButton = page.getByTestId('profile-save');
  }

  async open() {
    await this.goto('/profile');
  }

  async getFullName(): Promise<string> {
    return this.nameInput.inputValue();
  }

  async updateFullName(newName: string) {
    await this.nameInput.fill(newName);
    await this.saveButton.click();
  }

  async reload() {
    await this.page.reload();
    await this.page.waitForLoadState('networkidle');
  }
}
