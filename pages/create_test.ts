import { Page, Locator } from '@playwright/test';

export class CreateTestPage {
  readonly page: Page;
  readonly Heading: Locator;
  readonly title: Locator;
  readonly Description: Locator;
  readonly folder: Locator;
  readonly Time_Limit: Locator;
  readonly Max_Attempts: Locator;
  readonly CreateTest_button: Locator;


  constructor(page: Page) {
    this.page = page;
    this.Heading = page.getByRole('heading', { name: 'Create New Test' });
    this.title = page.locator('input[type="text"]');
    this.Description = page.locator('textarea');
    this.folder = page.getByRole('combobox');
    this.Time_Limit = page.getByPlaceholder('No limit');
    this.Max_Attempts = page.getByRole('spinbutton').nth(1);
    this.CreateTest_button = page.getByRole('button', { name: 'Create & Add Questions' });
    

  }

async testTitle (name: string){
    await this.title.fill(name);
}
async testFolder(){
    await this.folder.selectOption('No Folder');
}
async createButton (){
    await this.CreateTest_button.click();
}



}