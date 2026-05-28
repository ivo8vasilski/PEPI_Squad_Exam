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
  // 👉 ДОБАВЕНО: Локатор за бутона Next, за да можем да сменяме въпросите в цикъла
  readonly Next_button: Locator;

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
    this.Error_Message = page.getByText('Maximum attempts reached'); //
    this.Error_Message1 = page.getByText('Invalid password'); //
    this.Continue_button = page.getByRole('button', { name: 'Continue' });
    
    // 👉 ДОБАВЕНО: Търсим бутона Next по неговия текст
    this.Next_button = page.getByRole('button', { name: /Next/i });
  }

  async UserName (NameField: string){
      await this.NameField.fill(NameField);
  }
  async Click_Continue() {
      await this.Continue_button.click();
  }
  
  // 👉 КОРИГИРАНО: Методът вече попълва името (ако полето е видимо) и стартира теста
  async start(name: string) {
      if (await this.NameField.isVisible()) {
          await this.NameField.fill(name); //
      }
      await this.StartTest_button.click();
  }

  async Click_radio1 (){
      await this.Radio_button.first().click();
  }
  async Click_CheckBox_1 (){
      await this.Checkbox_button.first().click();
  }
  async Fill_Exact_Answer (Exact_Answer1: string){
      await this.Exact_Answer.fill(Exact_Answer1);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 🚀 ДОБАВЕН ИНТЕЛИГЕНТЕН МЕТОД ЗА АВТОМАТИЧНО ОТГОВАРЯНЕ НА ВСЕКИ ВЪПРОС
  // ─────────────────────────────────────────────────────────────────────────
  async answerQuestion(qData: any, giveCorrectAnswer: boolean) {
      if (giveCorrectAnswer) {
          // Студент 3 дава верни отговори
          if (qData.type === 'multiple_choice') {
              await this.Radio_button.first().click({ force: true });
          } else if (qData.type === 'multi_select') {
              await this.Checkbox_button.nth(0).click({ force: true });
          } else if (qData.type === 'exact_answer') {
              await this.Exact_Answer.fill(qData.correct_answer); // Взима точния отговор от JSON
          }
      } else {
          // Останалите студенти умишлено бъркат, за да генерираме нисък резултат в Analytics
          if (qData.type === 'multiple_choice') {
              await this.Radio_button.last().click({ force: true });
          } else if (qData.type === 'exact_answer') {
              await this.Exact_Answer.fill('Грешен Отговор Нарочно');
          }
      }

      // Ако бутонът "Next" е наличен на екрана, кликаме го, за да преминем напред
      if (await this.Next_button.isVisible()) {
          await this.Next_button.click();
      }
  }

  async Submit_Test (){
      await this.Submit_Button.click();
      await this.page.waitForLoadState('networkidle');
  }
  
  async gotoDashboardPage (){
      await this.Dashboard.click();
  }
}