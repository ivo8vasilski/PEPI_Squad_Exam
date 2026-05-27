import { Page, Locator } from '@playwright/test';

export class TestExecutionPage {
  readonly page: Page;
  readonly NameField: Locator;
  readonly StartTest_button: Locator;
  readonly Continue_button: Locator;
  readonly TestName: Locator;
  readonly Radio_button: Locator;
  readonly Checkbox_button: Locator;
  readonly Exact_Answer: Locator;
  readonly Submit_Button: Locator;
  readonly Successfully_Submitted_Message_1: Locator;
  readonly Successfully_Submitted_Message_2: Locator;
  readonly Error_Message: Locator;
  readonly Error_Message1: Locator;
  readonly Explore: Locator;
  readonly Companies: Locator;
  readonly Dashboard: Locator;
 


  constructor(page: Page) {
    this.page = page;
    this.NameField = page.getByRole('textbox', { name: 'Your name (optional)' });
    this.StartTest_button = page.getByRole('button', { name: 'Start Test' }); 

    this.TestName = page.locator('h1');
    this.Radio_button = page.getByRole('radio');
    this.Checkbox_button = page.getByRole('checkbox');  
    this.Exact_Answer = page.getByRole('textbox', { name: 'Type your answer' });
    this.Submit_Button = page.getByRole('button', { name: 'Submit Test' }); 
    this.Successfully_Submitted_Message_1 = page.getByRole('heading', { name: 'Test Submitted!' });
    this.Successfully_Submitted_Message_2 = page.getByText('Thank you for completing the');

    this.Dashboard = page.getByRole('link', { name: 'Dashboard' });
    this.Explore = page.getByRole('link', { name: 'Explore' });
    this.Companies = page.getByRole('link', { name: 'Companies' });
    this.Error_Message = page.getByText('Maximum attempts reached');
    this.Error_Message1 = page.getByText('Invalid password');
    this.Continue_button = page.getByRole('button', { name: 'Continue' });


  }

async UserName (NameField: string){
    await this.NameField.fill(NameField);
}
async Click_Continue() {
    await this.Continue_button.click();
}
async Start_Test (){
    await this.StartTest_button.click();
}
async Click_radio1 (){
    await this.Radio_button.click();
}
async Click_CheckBox_1 (){
    await this.Checkbox_button.click();
}
async Fill_Exact_Answer (Exact_Answer1: string){
    await this.Exact_Answer.fill(Exact_Answer1);
}
async Submit_Test (){
    await this.Submit_Button.click();
}
async gotoDashboardPage (){
    await this.Dashboard.click();
}

}