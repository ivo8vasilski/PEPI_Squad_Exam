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
  readonly successfullMessage_1: Locator;
  readonly successfullMessage_2: Locator;
  readonly Error_Message: Locator;
  readonly Error_Message1: Locator;
  readonly Explore: Locator;
  readonly Companies: Locator;
  readonly Dashboard: Locator;
  readonly labels: Locator;
  readonly exactAnswer: Locator;
 


  constructor(page: Page) {
    this.page = page;
    this.NameField = page.getByRole('textbox', { name: 'Your name (optional)' });
    this.StartTest_button = page.getByRole('button', { name: 'Start Test' }); 

    this.TestName = page.locator('h1');
    this.Radio_button = page.getByRole('radio');
    this.Checkbox_button = page.getByRole('checkbox');  
    this.Exact_Answer = page.getByRole('textbox', { name: 'Type your answer' });
    this.Submit_Button = page.getByRole('button', { name: 'Submit Test' }); 
    this.successfullMessage_1 = page.getByText(/test submitted/i);
    this.successfullMessage_2 = page.getByText('Thank you for completing the');

    this.Dashboard = page.getByRole('link', { name: 'Dashboard' });
    this.Explore = page.getByRole('link', { name: 'Explore' });
    this.Companies = page.getByRole('link', { name: 'Companies' });
    this.Error_Message = page.getByText('Maximum attempts reached');
    this.Error_Message1 = page.getByText('Invalid password');
    this.Continue_button = page.getByRole('button', { name: 'Continue' });
    this.labels = page.locator('label');
    this.exactAnswer = page.getByRole('textbox');


  }

async addName (text: string){
    await this.NameField.fill(text);
}
async continue() {
    await this.Continue_button.click();
}
async startTest (){
    await this.StartTest_button.click();
}
async Fill_Exact_Answer (Exact_Answer1: string){
    await this.Exact_Answer.fill(Exact_Answer1);
}
async submitTest (){
    await this.Submit_Button.click();
}
async gotoDashboardPage (){
    await this.Dashboard.click();
}
async fillExactAnswer(questionText: string, answer: string) {
  const question = this.page.locator('div.bg-white.border.rounded-lg.p-6').filter({
    hasText: questionText
  });

  await question
    .getByRole('textbox', { name: 'Type your answer' })
    .fill(answer);
}
}