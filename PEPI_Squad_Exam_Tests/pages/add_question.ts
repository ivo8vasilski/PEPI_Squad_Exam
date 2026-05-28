import { Page, Locator, expect } from '@playwright/test';

export class AddQuestionPage {
  readonly page: Page;
  readonly TestName: Locator;
  readonly Result_button: Locator;
  readonly TestLink: Locator;
  readonly Copy_button: Locator;
  readonly Questions_Count: Locator;
  readonly Add_Question_1: Locator;
  readonly Add_Question_2: Locator;

  readonly Question_Field: Locator;
  readonly Type: Locator;
  readonly textbox_1: Locator;
  readonly textbox_2: Locator;
  readonly textbox_3: Locator;
  readonly radio_1: Locator;
  readonly radio_2: Locator;
  readonly radio_3: Locator;
  readonly check_box_1: Locator;
  readonly check_box_2: Locator;
  readonly check_box_3: Locator;
  readonly Exatc_Answer: Locator;
  readonly Add_Answer_button: Locator;
  readonly Save_Question_button: Locator;

  constructor(page: Page) {
    this.page = page;
    this.TestName = page.locator('h1');
    this.Result_button = page.getByRole('link', { name: 'View Results' });
    this.TestLink = page.getByRole('textbox').first();
    this.Copy_button = page.getByRole('button', { name: 'Copy' });
    this.Questions_Count = page.locator('h2');
    this.Add_Question_1 = page.getByRole('button', { name: '+ Add Question' });
    this.Add_Question_2 = page.getByRole('button', { name: 'Add your first question' });
    
    this.Question_Field = page.locator('textarea');
    this.Type = page.locator('form').getByRole('combobox');
    this.radio_1 = page.getByRole('radio').first();
    this.radio_2 = page.getByRole('radio').nth(1);
    this.radio_3 = page.getByRole('radio').nth(2);
    this.check_box_1 = page.getByRole('checkbox').first();
    this.check_box_2 = page.getByRole('checkbox').nth(1);
    this.check_box_3 = page.getByRole('checkbox').nth(2);
    this.textbox_1 = page.getByRole('textbox', { name: 'Answer 1' });
    this.textbox_2 = page.getByRole('textbox', { name: 'Answer 2' });
    this.textbox_3 = page.getByRole('textbox', { name: 'Answer 3' });
    this.Exatc_Answer = page.getByRole('textbox', { name: 'Enter the correct answer' });
    this.Add_Answer_button = page.getByRole('button', { name: '+ Add Answer' });
    this.Save_Question_button = page.getByRole('button', { name: 'Save Question' });
  }

  async Copy_Link (){
      await this.Copy_button.click();
  }
  async View_Result (){
      await this.Result_button.click();
  }
  async getLink() {
      return await this.TestLink.inputValue();
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 🚀 МОЩЕН ДИНАМИЧЕН МЕТОД ЗА ИНЖЕКТИРАНЕ НА ВЪПРОСИ ОТ JSON
  // ─────────────────────────────────────────────────────────────────────────
  async addQuestion(qData: any) {
    // 1. Проверяваме кой бутон за нов въпрос е наличен и кликаме
    if (await this.Add_Question_2.isVisible()) {
        await this.Add_Question_2.click();
    } else {
        await this.Add_Question_1.click();
    }

    // Изчакваме формата да се зареди на екрана
    await expect(this.Save_Question_button).toBeVisible();

    // 2. Попълваме текста на въпроса от JSON
    await this.Question_Field.fill(qData.text);

    // 3. Обработка на Single Choice
    if (qData.type === 'multiple_choice') {
        await this.Type.selectOption('multiple_choice'); // Спрямо API стойността в DOM
        
        await this.textbox_1.fill(qData.answers[0].text);
        await this.textbox_2.fill(qData.answers[1].text);
        
        // Проверяваме кой отговор е верен и кликаме съответното радио на Любо
        if (qData.answers[0].correct) {
            await this.radio_1.click({ force: true });
        } else {
            await this.radio_2.click({ force: true });
        }
    } 
    // 4. Обработка на Multiple Select
    else if (qData.type === 'multi_select') {
        await this.Type.selectOption('multi_select'); // Спрямо API стойността в DOM
        
        await this.textbox_1.fill(qData.answers[0].text);
        await this.textbox_2.fill(qData.answers[1].text);
        
        // Маркираме чекбоксовете на Любо, ако данните казват, че са верни
        if (qData.answers[0].correct) await this.check_box_1.click({ force: true });
        if (qData.answers[1].correct) await this.check_box_2.click({ force: true });
    } 
    // 5. Обработка на Exact Answer
    else if (qData.type === 'exact_answer') {
        await this.Type.selectOption('exact_answer'); // Спрямо API стойността в DOM
        await this.Exatc_Answer.fill(qData.correct_answer);
    }

    // 6. Запазваме въпроса и изчакваме стабилно да се затвори
    await this.Save_Question_button.click();
    await expect(this.Save_Question_button).toBeHidden({ timeout: 15000 });
  }
}