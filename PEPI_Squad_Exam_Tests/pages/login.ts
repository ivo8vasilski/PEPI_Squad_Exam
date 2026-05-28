import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly email: Locator;
  readonly password: Locator;
  readonly signInButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.email = page.locator('input[type="email"]');
    this.password = page.locator('input[type="password"]');
    this.signInButton = page.locator('button:has-text("Sign In")');
  }

  async gotoLoginPage() {
    await this.page.goto('https://exampractices.com/login');
  }

  async login(email: string, password: string) {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.signInButton.click();
    
    // 👉 ДОБАВЕНО: Изчакваме системата да ни пренасочи към Dashboard таблото,
    // за да сме сигурни, че сесията на потребителя от JSON е заредена успешно
    await this.page.waitForURL('**/dashboard');
  }
}