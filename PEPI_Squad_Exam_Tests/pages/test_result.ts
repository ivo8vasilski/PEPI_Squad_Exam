import { Page, Locator, expect } from '@playwright/test';

export class TestResultPage {
    readonly page: Page;
    readonly Analytics_Tab: Locator;
    readonly Submissions_Tab: Locator;
    readonly Rows: Locator;
    // 👉 ДОБАВЕНО: Локатор за таба "Results", който се клика първоначално в компанията
    readonly Results_Link: Locator;

    constructor(page: Page) {
        this.page = page;
        this.Results_Link = page.getByText('Results');
        
        // 👉 КОРИГИРАНО: Разделихме правилно Analytics бутона от Submissions таба
        this.Analytics_Tab = page.getByRole('button', { name: 'Analytics' });
        this.Submissions_Tab = page.getByText('Submissions'); //
        
        this.Rows = page.locator('tbody tr');
    }

    async getUsersScores() {
        const results: { name: string; score: number }[] = [];
        const rowsCount = await this.Rows.count();

        for (let i = 0; i < rowsCount; i++) {
            const row = this.Rows.nth(i);
            const name = (await row.locator('td').nth(0).textContent())?.trim() ?? '';
            const scoreText = (await row.locator('td').nth(1).textContent()) ?? '0%';
            
            // Превръщаме текста "80.0" или "100%" в чисто число
            const score = Number(scoreText.replace('%', ''));

            results.push({
                name: name.trim(),
                score,
            });
        }
        return results;
    }

    async Analytic_button (){
        await this.Analytics_Tab.click();
    }

    // 👉 ДОБАВЕНО: Този метод отваря резултатите и проверява поляризацията (Best vs Worst)
    async verifyScores() {
        // 1. Кликаме на линка "Results" в папката на компанията
        await this.Results_Link.first().click();
        
        // 2. Кликаме на под-таба "Submissions"
        await this.Submissions_Tab.click();
        await this.page.waitForLoadState('networkidle');

        // 3. Извикваме напредналия алгоритъм на Любо, за да вземем масива с чисти резултати
        const scores = await this.getUsersScores();
        
        // 4. Правим сигурни проверки, че имаме студент със 100% и студент с 0% успеваемост
        const hasPerfectScore = scores.some(s => s.score === 100);
        const hasLowestScore = scores.some(s => s.score === 0);

        expect(hasPerfectScore).toBe(true);
        expect(hasLowestScore).toBe(true);
    }
}