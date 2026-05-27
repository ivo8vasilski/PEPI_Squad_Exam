import { Page, Locator } from '@playwright/test';

export class TestResultPage {
  readonly page: Page;
  readonly Submissions: Locator;
  readonly Rows: Locator;



  constructor(page: Page) {
    this.page = page;
    this.Submissions = page.getByRole('button', { name: 'Analytics' });
    this.Rows = page.locator('tbody tr');

  }

  async getUsersScores() {
    const results: { name: string; score: number }[] = [];

    const rowsCount = await this.Rows.count();

    for (let i = 0; i < rowsCount; i++) {
      const row = this.Rows.nth(i);

      const name =
        (await row.locator('td').nth(0).textContent())?.trim() ?? '';

      const scoreText =
        (await row.locator('td').nth(1).textContent()) ?? '0%';

      const score = Number(scoreText.replace('%', ''));

      results.push({
        name: name.trim(),
        score,
      });
    }

    return results;
  }

    async Analytic_button (){
    await this.Submissions.click();
    }

}