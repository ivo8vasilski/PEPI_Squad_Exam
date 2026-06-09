import { Page, Locator, expect } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly Explore: Locator;
  readonly Companies: Locator;
  readonly CreateTest_first: Locator;
  readonly CreateTest_second: Locator;
  readonly CreateTest_third: Locator;
  readonly LogOut_button: Locator;
  readonly Results_button: Locator;
  readonly Preview_button: Locator;
  readonly Delete_button: Locator;
  readonly Delete_pop_up: Locator;
  readonly No_Test_Message: Locator;


  constructor(page: Page) {
    this.page = page;
    this.Explore = page.getByRole('link', { name: 'Explore' });
    this.Companies = page.getByRole('link', { name: 'Companies' });
    this.CreateTest_first = page.getByRole('navigation').getByRole('link', { name: 'Create Test' });
    this.CreateTest_second = page.getByRole('main').getByRole('link', { name: 'Create Test' });
    this.CreateTest_third = page.getByRole('link', { name: 'Create your first test' });
    this.No_Test_Message = page.getByText('You haven\'t created any tests');
    this.LogOut_button = page.getByRole('button', { name: 'Logout' });
    this.Results_button = page.getByRole('link', { name: 'Results' }).first();
    this.Preview_button = page.getByRole('link', { name: 'Preview' }).first();
    this.Delete_button = page.getByRole('button', { name: 'Delete' }).first(); 
    this.Delete_pop_up = page.getByRole('button', { name: 'Delete' });

  }

async gotoExplorePage (){
    await this.Explore.click();
}

async gotoCompaniesPage() {
  const link = this.page.getByRole('link', { name: 'Companies' });

  await this.page.waitForLoadState('domcontentloaded');

  await expect(link).toBeVisible({ timeout: 15000 });

  await link.click();
}
async createTest_first (){
    await this.CreateTest_first.click();
}
async createTest_second (){
    await this.CreateTest_second.click();
}
async createTest_third (){
    await this.CreateTest_third.click();
}
async Test_Results (){
    await this.Results_button.click();
}
async Test_Preview (){
    await this.Preview_button.click();
}
async Test_Delete (){
    await this.Delete_button.click();
}
async Delete_Pop_Up_Button (){
    await Promise.all([
      this.page.waitForEvent('dialog').then(d => d.accept()),
      this.Delete_pop_up.click()
    ]);
}

}