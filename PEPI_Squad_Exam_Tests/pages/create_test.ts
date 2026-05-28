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

  // ─────────────────────────────────────────────────────────────────────────
  // 🚀 ОБНОВЕН ДИНАМИЧЕН МЕТОД: ВЕЧЕ ПРИЕМА ЗАГЛАВИЕ И ИМЕ НА ПАПКА
  // ─────────────────────────────────────────────────────────────────────────
  async initTest(title: string, folderName: string) {
      // 1. Попълваме динамичното заглавие на теста (напр. "БЕЛ - Матура 2026")
      await this.Title.waitFor({ state: 'visible', timeout: 5000 });
      await this.Title.fill(title);
      
      // 2. Избираме динамично папката от падащото меню по нейния текст (label)
      await this.Folder.waitFor({ state: 'visible', timeout: 5000 });
      await this.Folder.selectOption({ label: folderName });
      
      // 3. Натискаме бутона за създаване и преминаване към добавяне на въпроси
      await this.CreateTest_button.click();
      await this.page.waitForLoadState('networkidle');
  }
}