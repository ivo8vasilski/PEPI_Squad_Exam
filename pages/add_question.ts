import { Page, Locator } from '@playwright/test';

export class AddQuestionPage {
  readonly page: Page;
  readonly testName: Locator;
  readonly Result_button: Locator;
  readonly companyLink: Locator;
  readonly TestLink: Locator;
  readonly Copy_button: Locator;
  readonly Questions_Count: Locator;
  readonly Add_Question: Locator;


  readonly questionField: Locator;
  readonly questionType: Locator;
  readonly answerField1: Locator;
  readonly answerField2: Locator;
  readonly answerField3: Locator;
  readonly radioButton: Locator;
  readonly checkBoxes: Locator;
  readonly exatcAnswer: Locator;
  readonly Add_Answer_button: Locator;
  readonly Save_Question_button: Locator;
  readonly folder: Locator;


  constructor(page: Page) {
    this.page = page;
    this.testName = page.locator('h1');
    this.Result_button = page.getByRole('link', { name: 'View Results' });
    this.TestLink = page.getByRole('textbox').first();
    this.Copy_button = page.getByRole('button', { name: 'Copy' });
    this.Questions_Count = page.locator('h2');
    this.Add_Question = page.getByRole('button', { name: '+ Add Question' });
    this.folder = page.getByRole('combobox').first();
    this.companyLink = page.locator("a[class='hover:underline']");

    this.questionField = page.locator('textarea');
    this.questionType = page.locator('form').getByRole('combobox');
    this.answerField1 = page.locator("input[placeholder='Answer 1']");
    this.answerField2 = page.locator("input[placeholder='Answer 2']");
    this.answerField3 = page.locator("input[placeholder='Answer 3']");
    this.radioButton = page.getByRole('radio').first();
    this.checkBoxes = page.locator('input[type="checkbox"]');
    this.exatcAnswer = page.getByRole('textbox', { name: 'Enter the correct answer' });
    this.Add_Answer_button = page.getByRole('button', { name: '+ Add Answer' });
    this.Save_Question_button = page.getByRole('button', { name: 'Save Question' });


  }

async Copy_Link (){
    await this.Copy_button.click();
}
async View_Result (){
    await this.Result_button.click();
}
async gotoCompany (){
    await this.companyLink.click();
}
async getLink() {
    return await this.TestLink.inputValue();
}
async questionButton (){
    await this.Add_Question.click();
}
async addQuestion (Question_Field: string){
    await this.questionField.fill(Question_Field);
}
async selectFolder (folder: string){
    await this.folder.selectOption(folder)
}
async selectType (selectType: string){
    await this.questionType.selectOption(selectType);
}
async answer1 (answer1: string){
    await this.answerField1.fill(answer1);
}
async answer2 (answer2: string){
    await this.answerField2.fill(answer2);
}
async answer3 (answer3: string){
    await this.answerField3.fill(answer3);
}
async exact (text: string) {
    await this.exatcAnswer.fill(text);
}
async radio (){
    await this.radioButton.click();
}
async addField (){
    await this.Add_Answer_button.click();
}
async saveQuestion (){
    await this.Save_Question_button.click();
}

}