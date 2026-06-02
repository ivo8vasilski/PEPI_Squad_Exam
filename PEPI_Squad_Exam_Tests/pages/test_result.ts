import { Page, Locator, expect } from '@playwright/test';

export class TestResultPage {
    readonly page: Page;
    readonly Analytics_Tab: Locator;
    readonly Submissions_Tab: Locator;
    readonly Rows: Locator;

    constructor(page: Page) {
        this.page = page;
        
        this.Analytics_Tab = page.getByRole('button', { name: 'Analytics' });
        // 👉 ФИКС: По-стабилен локатор за таба със събмишъни
        this.Submissions_Tab = page.locator('a, button').filter({ hasText: 'Submissions' }).first(); 
        this.Rows = page.locator('tbody tr');
    }

    async getUsersScores() {
        const results: { name: string; score: number }[] = [];
        const rowsCount = await this.Rows.count();

        for (let i = 0; i < rowsCount; i++) {
            const row = this.Rows.nth(i);
            const name = (await row.locator('td').nth(0).textContent())?.trim() ?? '';
            const scoreText = (await row.locator('td').nth(1).textContent()) ?? '0%';
            
            const score = Number(scoreText.replace('%', ''));

            results.push({ name: name.trim(), score });
        }
        return results;
    }

    // 👉 ФИКС: Подаваме заглавието на теста като параметър, за да влезем в него
    async verifyScores(testTitle: string) {
        // 1. Кликаме на самия тест по неговото заглавие (напр. "БЕЛ - Матура 2026")
        await this.page.getByRole('heading', { name: testTitle }).first().click();
        await this.page.waitForLoadState('networkidle');
        
        // 2. Влизаме в таба с предадените работи
        await this.Submissions_Tab.waitFor({ state: 'visible', timeout: 5000 });
        await this.Submissions_Tab.click();
        await this.page.waitForLoadState('networkidle');

        // 3. Извличаме всички резултати от таблицата
        const scores = await this.getUsersScores();
        
        // 4. ПРОВЕРКА ПО УСЛОВИЕ: Търсим кой се е справил най-добре (100%) и най-зле (под 50% или 0%)
        const hasPerfectScore = scores.some(s => s.score === 100);
        const hasLowestScore = scores.some(s => s.score <= 50); // Може да го направиш и === 0

        expect(hasPerfectScore).toBeTruthy();
        expect(hasLowestScore).toBeTruthy();
    }
}