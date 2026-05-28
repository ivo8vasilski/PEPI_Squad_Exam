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

    readonly FolderNameInput: Locator;
    readonly SaveFolderBtn: Locator;
    readonly InviteEmailInput: Locator;
    readonly RoleSelect: Locator;
    readonly CreateInviteBtn: Locator;

    constructor (page:Page) {
        this.page = page;
        this.CompanyName = page.locator('h1');
        this.EditCompanyName = page.getByRole('button', { name: 'Edit company name' });
        this.NumberOfTests = page.getByRole('heading', { name: /All Tests/i });
        this.User_Role = page.getByText(/Your role:/i); 
        this.TestName = page.locator('h3');
        this.questionCounts = page.getByText(/\d+\s+questions/i);
        this.NewFolder = page.getByRole('button', { name: '+ New' });
        
        // 🛠️ ФИКСИРАНО: Хващаме бутона директно по href атрибута му, за да няма Strict Mode грешка
        this.CreateTest = page.getByRole('main').getByRole('link', { name: 'Create Test' });
 
        
        this.ManageMembers = page.getByRole('link', { name: 'Manage Members' });
        this.DeleteCompany = page.getByRole('button', { name: 'Delete Company' });
        this.EditTest = page.getByRole('link', { name: 'Edit' });
        this.TakeTest = page.getByRole('link', { name: 'Take' });

        this.FolderNameInput = page.getByPlaceholder(/Folder name/i);
        this.SaveFolderBtn = page.getByRole('button', { name: /Create|Save/i });
        this.InviteEmailInput = page.getByPlaceholder('Email address');
        
        // 🛠️ ФИКСИРАНО: Вземаме точно първото падащо меню на екрана (за формата за покани)
        this.RoleSelect = page.getByRole('combobox').first();
        
        this.CreateInviteBtn = page.getByRole('button', { name: 'Create Invite' });
    }

    async EditCompanyNameButton (){
        await this.EditCompanyName.click();
    } 

    async createFolder(name: string) {
        await this.NewFolder.click();
        await this.FolderNameInput.fill(name);
        await this.SaveFolderBtn.click();
        await this.page.waitForTimeout(500);
        await this.page.getByText(name).click(); 
    }

    async CreateTestButton (){
        await this.CreateTest.click();
    }

    async ManageMembersButton (){
        await this.ManageMembers.click();
    }

    async inviteMember(email: string, role: 'admin' | 'instructor' | 'student') {
        // Проверяваме дали полето за имейл вече е пред нас. Ако НЕ Е, тогава кликаме на Manage Members
        if (!(await this.InviteEmailInput.isVisible())) {
            await this.ManageMembers.waitFor({ state: 'visible', timeout: 5000 });
            await this.ManageMembers.click();
        }
        
        // Сега вече пишем сигурно
        await this.InviteEmailInput.waitFor({ state: 'visible', timeout: 5000 });
        await this.InviteEmailInput.fill(email);
        
        await this.RoleSelect.selectOption(role); 
        await this.CreateInviteBtn.click();
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(500);
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