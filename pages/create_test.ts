import { Page, Locator } from '@playwright/test';

export class CreateTestPage {
  readonly page: Page;
  readonly Heading: Locator;
  readonly Title: Locator;
  readonly Description: Locator;
  readonly Folder: Locator;
  readonly Time_Limit: Locator;
  readonly Max_Attempts: Locator;
  readonly CreateTest_button: Locator;


  constructor(page: Page) {
    this.page = page;
    this.Heading = page.getByRole('heading', { name: 'Create New Test' });
    this.Title = page.locator('input[type="text"]');
    this.Description = page.locator('textarea');
    this.Folder = page.getByRole('combobox');
    this.Time_Limit = page.getByPlaceholder('No limit');
    this.Max_Attempts = page.getByRole('spinbutton').nth(1);
    this.CreateTest_button = page.getByRole('button', { name: 'Create & Add Questions' });
    

  }

async Test_Title (Title: string){
    await this.Title.fill(Title);
}
async Test_Folder(){
    await this.Folder.selectOption('No Folder');
}
async Create_button (){
    await this.CreateTest_button.click();
}



}