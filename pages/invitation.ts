import { Page, Locator } from '@playwright/test';

export class InvitePage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly message: Locator;
  readonly loginButton: Locator;
  readonly signInButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.getByRole('heading', { name: 'Company Invitation' });
    this.message = page.getByText("You've been invited to join a company. Please log in or create an account to accept.");
    this.loginButton = page.getByRole('link', { name: 'Log In' });
    this.signInButton = page.getByRole('main').getByRole('link', { name: 'Sign Up' });
  }

  
  async login () {
    await this.loginButton.click();
  }
  async signIn () {
    await this.signInButton.click();
  }
}