import { Page, Locator } from '@playwright/test';

export class CompanyManagementPage {
readonly page: Page;
readonly CompanyName: Locator;
readonly EditCompanyName: Locator;
readonly NumberOfTests: Locator;
readonly User_Role: Locator;
readonly TestName: Locator;
readonly questionCounts: Locator;
readonly newFolder: Locator;
readonly newFolderName: Locator;
readonly createNewFolder: Locator;
readonly CreateTest: Locator;
readonly ManageMembers: Locator;
readonly DeleteCompany: Locator;
readonly EditTest: Locator;
readonly TakeTest: Locator;
readonly userRole: Locator;
readonly emailField: Locator;
readonly memberRole: Locator;
readonly invite: Locator;
readonly confirmMessage: Locator;
readonly inviteLink: Locator;
readonly testCards: Locator;



constructor (page:Page) {

    this.page = page;
    this.CompanyName = page.locator('h1');
    this.EditCompanyName = page.getByRole('button', { name: 'Edit company name' });
    this.NumberOfTests = page.getByRole('heading', { name: /All Tests/i });
    this.User_Role = page.getByText('Your role: admin');
    this.TestName = page.locator('h3');
    this.questionCounts = page.getByText(/\d+\s+questions/i);
    this.newFolder = page.getByRole('button', { name: '+ New' });
    this.newFolderName = page.locator('input[type="text"]');
    this.createNewFolder = page.getByRole('button', { name: 'Create' });
    this.CreateTest = page.locator('a').filter({ hasText: 'Create Test' }).last();
    this.ManageMembers = page.getByRole('link', { name: 'Manage Members' });
    this.DeleteCompany = page.getByRole('button', { name: 'Delete Company' });
    this.EditTest = page.getByRole('link', { name: 'Edit' });
    this.TakeTest = page.getByRole('link', { name: 'Take' });
    this.userRole = page.getByText(/Your role:/);
    this.emailField = page.getByRole('textbox', { name: 'Email address' });
    this.memberRole = page.getByRole('combobox').first();
    this.invite = page.getByRole ('button', {name: 'Create Invite'});
    this.confirmMessage = page.getByText('Invite created. Share the link below — email delivery is not yet configured.');
    this.inviteLink = page.getByRole('textbox').nth(1);
    this.testCards = page.locator('div.bg-white.border.rounded-lg');
    
}

async EditCompanyNameButton (){
    await this.EditCompanyName.click();
} 

async addNewFolder (){
    await this.newFolder.click();
}
async fillfolderName (folderName: string){
    await this.newFolderName.fill(folderName)
}
async createFolder (){
    await this.createNewFolder.click();
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
async fillmemberName (memberName: string){
    await this.emailField.fill(memberName);
}
async selectInstructor (){
    await this.memberRole.selectOption('Instructor');
}
async selectStudent (){
    await this.memberRole.selectOption('Student');
}
async inviteButton (){
    await this.invite.click();
}
async getLink() {
    return await this.inviteLink.inputValue();
}
 async takeBel(testTitle: string) {
  const card = this.page
    .locator('div.bg-white.border.rounded-lg')
    .filter({ hasText: testTitle });

  await card.waitFor({ state: 'visible' });

  await card.getByRole('link', { name: 'Take' }).click();
}
}

