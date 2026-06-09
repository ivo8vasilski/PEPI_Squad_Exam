import { Page, Locator, expect} from '@playwright/test';
export class CompaniesPage {

readonly page: Page;
readonly dashboard: Locator;
readonly explore: Locator;
readonly companies: Locator;
readonly logout: Locator;
readonly pageTitle: Locator;
readonly createCompany_button: Locator;
readonly createTest_button: Locator;
readonly companyLink: Locator;
readonly companyRole: Locator;
readonly companyName: Locator;
readonly createButton: Locator;




constructor (page: Page) {

this.page = page;
this.dashboard = page.getByRole('link', { name: 'Dashboard' });
this.explore = page.getByRole('link', { name: 'Explore' });
this.companies = page.getByRole('link', { name: 'Companies' });
this.logout = page.getByRole('button', { name: 'Logout' });
this.pageTitle = page.getByRole('heading', { name: 'My Companies' });
this.createCompany_button = page.getByRole('button', { name: 'Create Company' });
this.companyName = page.getByRole('textbox', { name: 'Company name' });
this.createButton = page.getByText('Create', { exact: true });
this.companyLink = page.locator('h3');
this.createTest_button = page.getByRole('link', { name: 'Create Test' });
this.companyRole = page.locator('span.text-xs');


}

async explore_link (){
    await this.explore.click();
}

async dashboard_link (){
    await this.dashboard.click();
}

async companies_link (){
    await this.companies.click();
}

async logoutAction() {
  const logout = this.page.getByRole('button', { name: 'Logout' });

  // изчакай UI да се стабилизира
  await this.page.waitForLoadState('domcontentloaded');

  // ако бутонът е в меню/скрит state → дай шанс да се появи
  await expect(logout.first()).toBeVisible({ timeout: 15000 });

  await logout.first().click();
}
async createCompany (){
    await this.createCompany_button.click();
}
async fillCompanyName (companyName: string){
    await this.companyName.fill(companyName);
}
async create (){
    await this.createButton.click();
}
async openCompany(companyName: string) {
    await this.page.locator('h3', { hasText: companyName }).click();
}
async createTest (){
    await this.createTest_button.click();
}

}