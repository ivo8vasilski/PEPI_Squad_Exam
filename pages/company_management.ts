import { Page, Locator } from '@playwright/test';

export class CompanyManagement_Page {
readonly page: Page;
readonly CompanyName: Locator;
readonly EditCompanyName: Locator;
readonly NumberOfTests: Locator;
readonly User_Role: Locator;
readonly TestName: Locator;
readonly questionCounts: Locator;
readonly NewFolder: Locator;
readonly CreateTest: Locator;
readonly ManageMembers: Locator;
readonly DeleteCompany: Locator;
readonly EditTest: Locator;
readonly TakeTest: Locator;


constructor (page:Page) {

    this.page = page;
    this.CompanyName = page.locator('h1');
    this.EditCompanyName = page.getByRole('button', { name: 'Edit company name' });
    this.NumberOfTests = page.getByRole('heading', { name: /All Tests/i });
    this.User_Role = page.getByText('Your role: admin');
    this.TestName = page.locator('h3');
    this.questionCounts = page.getByText(/\d+\s+questions/i);
    this.NewFolder = page.getByRole('button', { name: '+ New' });
    this.CreateTest = page.getByRole('main').getByRole('link', { name: 'Create Test' });
    this.ManageMembers = page.getByRole('link', { name: 'Manage Members' });
    this.DeleteCompany = page.getByRole('button', { name: 'Delete Company' });
    this.EditTest = page.getByRole('link', { name: 'Edit' });
    this.TakeTest = page.getByRole('link', { name: 'Take' });

}

async EditCompanyNameButton (){
    await this.EditCompanyName.click();
} 

async NewFolderButton (){
    await this.NewFolder.click();
}

async CreateTestButton (){
    await this.CreateTest.click();
}

async ManageMembersButton (){
    await this.ManageMembers.click();
}

async DeleteCompanyButton (){
    await this.DeleteCompany.click();
}

async EditTestButton (){
    await this.EditTest.click();
}

async TakeTestButton (){
    await this.TakeTest.click();
}
}

