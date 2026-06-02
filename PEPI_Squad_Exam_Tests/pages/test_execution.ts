import { Page, Locator } from '@playwright/test';

export class TestExecutionPage {
  readonly page: Page;
  readonly NameField: Locator;
  readonly StartTest_button: Locator;
  readonly Continue_button: Locator;
  readonly TestName: Locator;
  readonly Submit_Button: Locator;
  readonly Successfully_Submitted_Message_1: Locator;
  readonly Successfully_Submitted_Message_2: Locator;
  readonly Error_Message: Locator;
  readonly Error_Message1: Locator;
  readonly Explore: Locator;
  readonly Companies: Locator;
  readonly Dashboard: Locator;
  readonly Next_button: Locator;

  constructor(page: Page) {
    this.page = page;
    this.NameField = page.getByRole('textbox', { name: 'Your name (optional)' });
    this.StartTest_button = page.getByRole('button', { name: 'Start Test' }); 

    this.TestName = page.locator('h1');
    this.Submit_Button = page.getByRole('button', { name: 'Submit Test' }); 
    this.Successfully_Submitted_Message_1 = page.getByRole('heading', { name: 'Test Submitted!' });
    this.Successfully_Submitted_Message_2 = page.getByText('Thank you for completing the');

    this.Dashboard = page.getByRole('link', { name: 'Dashboard' });
    this.Explore = page.getByRole('link', { name: 'Explore' });
    this.Companies = page.getByRole('link', { name: 'Companies' });
    this.Error_Message = page.getByText('Maximum attempts reached'); 
    this.Error_Message1 = page.getByText('Invalid password'); 
    this.Continue_button = page.getByRole('button', { name: 'Continue' });
    this.Next_button = page.getByRole('button', { name: /Next/i });
  }

  async UserName (NameField: string){
      await this.NameField.fill(NameField);
  }
  async Click_Continue() {
      await this.Continue_button.click();
  }
  
  async start(name: string) {
      if (await this.NameField.isVisible()) {
          await this.NameField.fill(name); 
      }
      await this.StartTest_button.click();
      
      // Изчакваме първия заглавен елемент в съдържанието да се рендерира
      await this.page.locator('main, .container, form').first().waitFor({ state: 'visible', timeout: 10000 });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 🚀 КРАЕН ФИКС: ОПРАВЕН МЕТОД, СЪОБРАЗЕН СЪС СТРУКТУРАТА НА JSON ФАЙЛА
  // ─────────────────────────────────────────────────────────────────────────
  async answerQuestion(qData: any, giveCorrectAnswer: boolean) {
      // 👉 ФИКС: Използваме qData.text (защото така е в JSON-а) и чистим празни места
      const questionText = qData?.text ? qData.text.trim() : '';

      // Търсим контейнера, който съдържа точно заглавието на текущия въпрос
      const questionBlock = this.page.locator('div.border, section, fieldset, [class*="card"]')
          .filter({ hasText: questionText });

      // Дефинираме локаторите вътре в кутията на въпроса
      const exactAnswerInput = questionBlock.getByRole('textbox', { name: 'Type your answer' });
      const optionsLabels = questionBlock.locator('label');

      if (giveCorrectAnswer) {
          if (qData.type === 'multiple_choice') {
              await optionsLabels.first().waitFor({ state: 'visible', timeout: 3000 });
              await optionsLabels.first().click({ force: true });
          } else if (qData.type === 'multi_select' || qData.type === 'multi_choice') {
              await optionsLabels.nth(0).waitFor({ state: 'visible', timeout: 3000 });
              await optionsLabels.nth(0).click({ force: true });
          } else if (qData.type === 'exact_answer') {
              // Изчакваме текстовото поле на конкретния въпрос и пишем правилния отговор от JSON
              await exactAnswerInput.waitFor({ state: 'visible', timeout: 4000 });
              await exactAnswerInput.fill(qData.correct_answer); 
          }
      } else {
          // Умишлено бъркане за останалите студенти
          if (qData.type === 'multiple_choice') {
              await optionsLabels.last().waitFor({ state: 'visible', timeout: 3000 });
              await optionsLabels.last().click({ force: true });
          } else if (qData.type === 'multi_select' || qData.type === 'multi_choice') {
              await optionsLabels.last().waitFor({ state: 'visible', timeout: 3000 });
              await optionsLabels.last().click({ force: true });
          } else if (qData.type === 'exact_answer') {
              await exactAnswerInput.waitFor({ state: 'visible', timeout: 4000 });
              await exactAnswerInput.fill('Грешен Отговор Нарочно');
          }
      }

      if (await this.Next_button.isVisible()) {
          await this.Next_button.click();
          await this.page.waitForTimeout(200);
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