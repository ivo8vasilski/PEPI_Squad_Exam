import { Page, Locator } from '@playwright/test';

export class CompaniesPage {
    readonly page: Page;
    readonly Dashboard: Locator;
    readonly Explore: Locator;
    readonly Companies: Locator;
    readonly Logout: Locator;
    readonly PageTitle: Locator;
    readonly Create_Test: Locator;
    readonly CreateCompany: Locator;
    readonly CompanyNameInput: Locator;
    readonly SubmitCreateBtn: Locator;
    readonly Company_Role: Locator;

    constructor (page: Page) {
        this.page = page;
        this.Dashboard = page.getByRole('link', { name: 'Dashboard' });
        this.Explore = page.getByRole('link', { name: 'Explore' });
        this.Companies = page.getByRole('link', { name: 'Companies' });
        this.Logout = page.getByRole('button', { name: 'Logout' });
        this.Create_Test = page.getByRole('link', { name: 'Create Test' });
        this.CreateCompany = page.getByRole('button', { name: 'Create Company' });
        
        this.CompanyNameInput = page.getByPlaceholder('Company name');
        this.SubmitCreateBtn = page.getByRole('button', { name: 'Create', exact: true }); // Фиксирано!
        
        this.Company_Role = page.locator('span.text-xs');
        this.PageTitle = page.getByRole('heading', { name: 'My Companies' });
    }

    async Explore_link (){
        await this.Explore.click();
    }

    async Dashboard_link (){
        await this.Dashboard.click();
    }

    async Companies_link (){
        await this.Companies.click();
    }

    async Logout_button (){
        await this.Logout.click();
    }

    async CreateTest_button (){
        await this.Create_Test.click();
    }

    async CreateCompany_button (name: string){
        await this.CreateCompany.click();
        await this.CompanyNameInput.fill(name);
        await this.SubmitCreateBtn.click();
        await this.page.waitForLoadState('networkidle');
    }
    async Company_button (name: string){
        // Търсим линк, чийто URL адрес започва с /company/
        const firstCompanyCard = this.page.locator('a[href*="/company/"]').first();
        
        // Изчакваме картата да се появи физически на екрана
        await firstCompanyCard.waitFor({ state: 'visible', timeout: 10000 });
        
        // Кликаме върху нея, за да влезем в управлението на компанията
        await firstCompanyCard.click();
    }
   
}