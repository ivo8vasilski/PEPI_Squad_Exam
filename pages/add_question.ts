import { Page, Locator } from '@playwright/test';

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
    this.Type = page.getByRole('combobox');
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
async Add_button_1 (){
    await this.Add_Question_1.click();
}
async Add_button_2 (){
    await this.Add_Question_2.click();
}
async Question (Question_Field: string){
    await this.Question_Field.fill(Question_Field);
}
async Question_Type_1 (){
    await this.Type.selectOption('Single Choice');
}
async Question_Type_2 (){
    await this.Type.selectOption('Multiple Select');
}
async Question_Type_3 (){
    await this.Type.selectOption('Exact Answer');
}
async Add_additional_field (){
    await this.Add_Answer_button.click();
}
async Add_Answer_1 (textbox_1: string){
    await this.textbox_1.fill(textbox_1);
}
async Add_Answer_2 (textbox_2: string){
    await this.textbox_2.fill(textbox_2);
}
async Add_Answer_3 (textbox_3: string){
    await this.textbox_3.fill(textbox_3);
}
async Mark_Radio_1 (){
    await this.radio_1.click();
}
async Mark_Radio_2 (){
    await this.radio_2.click();
}
async Mark_Radio_3 (){
    await this.radio_3.click();
}
async Mark_Checkbox_1 (){
    await this.check_box_1.click();
}
async Mark_Checkbox_2 (){
    await this.check_box_2.click();
}
async Mark_Checkbox_3 (){
    await this.check_box_3.click();
}
async Exact_Answer (Exact_Answer: string){
    await this.Exatc_Answer.fill(Exact_Answer);
}
async Save_Question (){
    await this.Save_Question_button.click();
}

}