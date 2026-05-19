import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

test('Task 6: Single Choice test with 4 questions, visible to all', async ({ page, request }) => {

    test.setTimeout(300_000); // 5 минути таймаут

    // ── Config ────────────────────────────────────────────────────────────────
    const password = process.env.TEST_USER_PASSWORD;
    if (!password) {
        throw new Error('ГРЕШКА: TEST_USER_PASSWORD не е дефинирана в .env файла!');
    }

    const host       = 'https://exampractices.com';
    const baseUrl    = `${host}/api`;
    const uniqueId   = Date.now();
    const userEmail  = `task6user_${uniqueId}@test.com`;
    const testTitle  = `Single Choice Test - ${uniqueId}`;
    
    let accessToken: string | null = '';

    // ─────────────────────────────────────────────────────────────────────────
    // STEP 1 – Регистрация
    // ─────────────────────────────────────────────────────────────────────────
    await test.step('Step 1: Register new user', async () => {
        const response = await request.post(`${baseUrl}/auth/register/`, {
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            data: {
                email:            userEmail,
                first_name:       'Single',
                last_name:        'Choice',
                password,
                password_confirm: password,
            },
        });
        expect(response.status()).toBe(201);
    });

    // ─────────────────────────────────────────────────────────────────────────
    // STEP 2 – Логване
    // ─────────────────────────────────────────────────────────────────────────
    await test.step('Step 2: Login', async () => {
        await page.goto(`${host}/login`);
        await page.locator('input[type="email"]').fill(userEmail);
        await page.locator('input[type="password"]').fill(password);
        await page.getByRole('button', { name: /Sign In/i }).click();
        
        await page.waitForURL(`${host}/dashboard`, { timeout: 30_000 });

        accessToken = await page.evaluate(() =>
            localStorage.getItem('access')       ||
            localStorage.getItem('token')        ||
            localStorage.getItem('access_token') ||
            localStorage.getItem('jwt')
        );

        if (!accessToken) {
            const cookies = await page.context().cookies();
            const authCookie = cookies.find(c => c.name === 'access' || c.name === 'token' || c.name === 'sessionid');
            if (authCookie) accessToken = authCookie.value;
        }
        expect(accessToken).not.toBeNull();
    });

    // ─────────────────────────────────────────────────────────────────────────
    // STEP 3, 4, 5 – Създаване на тест
    // ─────────────────────────────────────────────────────────────────────────
    await test.step('Step 3-5: Create Test Setup', async () => {
        const createTestBtn = page.getByRole('link', { name: /Create Test/i }).or(page.getByRole('button', { name: /Create Test/i }));
        await createTestBtn.click();
        
        await expect(page.getByRole('heading', { name: 'Create New Test' })).toBeVisible({ timeout: 15_000 });

        await page.locator('input[type="text"]').fill(testTitle);
        
        
        await page.locator('select').first().selectOption('public');
        
        
        await page.getByRole('spinbutton').nth(1).fill('1');
        
        await page.getByRole('button', { name: 'Create & Add Questions' }).click();
    });

    // ─────────────────────────────────────────────────────────────────────────
    // STEP 6 – Добавяне на 4 въпроса 
    // ─────────────────────────────────────────────────────────────────────────
    await test.step('Step 6: Add 4 Single Choice questions', async () => {
        for (let i = 1; i <= 4; i++) {
            await page.waitForLoadState('networkidle');
            
            const btnText = (i === 1) ? 'Add your first question' : 'Add Question';
            await page.getByRole('button', { name: btnText }).click();

            
            await page.locator('textarea').first().fill(`Single Choice Question ${i}`);
            
        
            await page.locator('select').first().selectOption('multiple_choice');
            
            
            await page.getByPlaceholder('Answer 1').fill('Correct Answer');
            await page.getByPlaceholder('Answer 2').fill('Wrong Answer');
            
            
            await page.locator('input[type="radio"]').first().check({ force: true });
            
            await page.getByRole('button', { name: 'Save Question' }).click();
            await page.waitForLoadState('networkidle');
        }
    });

    // ─────────────────────────────────────────────────────────────────────────
    // STEP 7, 8, 9 – Търсене в Explore
    // ─────────────────────────────────────────────────────────────────────────
    await test.step('Step 7-9: Search in Explore, start without username and solve', async () => {
        
        await page.goto(`${host}/explore`);
        await page.waitForLoadState('networkidle');

        const searchBox = page.getByPlaceholder('Search by title...');
        await searchBox.fill(testTitle);
        await searchBox.press('Enter');
        await page.waitForLoadState('networkidle'); 
        
        await page.getByText(testTitle, { exact: true }).click();
        await page.waitForLoadState('domcontentloaded');
        
       
        await page.getByRole('button', { name: /Start|Старт/i }).click();

        
        const radioOptions = page.locator('input[type="radio"]');
        await expect(radioOptions.first()).toBeVisible({ timeout: 15_000 });

        
        const radiosCount = await radioOptions.count();
        
        
        if (radiosCount > 2) {
            
            for (let i = 0; i < 4; i++) {
                await radioOptions.nth(i * 2).check({ force: true });
            }
            await page.getByRole('button', { name: /Submit Test|Finish/i }).click();
        } 
       
        else {
            for (let i = 0; i < 4; i++) {
                await radioOptions.first().check({ force: true });
                const nextBtn = page.getByRole('button', { name: /Next|Submit|Finish/i });
                await nextBtn.click();
            }
        }
        
        await page.waitForLoadState('networkidle');
    });

    // ─────────────────────────────────────────────────────────────────────────
    // STEP 10-11 – Проверка в Analytics
    // ─────────────────────────────────────────────────────────────────────────
    await test.step('Step 10-11: Check Analytics for 1 response', async () => {
        await page.goto(`${host}/dashboard`);
        await page.waitForLoadState('networkidle');
        
        const testRow = page.locator('tr').filter({ hasText: testTitle }).first();
        await testRow.getByText('Results', { exact: true }).click();
        
        await page.getByText('Analytics', { exact: true }).click();
        await page.waitForLoadState('networkidle');

        
        const oneResponseIndicator = page.getByText('1 / 1 answered correctly').first();
        
        await expect(oneResponseIndicator).toBeVisible({ timeout: 15_000 });
    });

    // ─────────────────────────────────────────────────────────────────────────
    // STEP 12 – Изтриване на теста
    // ─────────────────────────────────────────────────────────────────────────
    await test.step('Step 12: Delete test', async () => {
        await page.goto(`${host}/dashboard`);
        await page.waitForLoadState('networkidle');

        page.once('dialog', d => d.accept());
        
        const testRow = page.locator('tr').filter({ hasText: testTitle }).first();
        await testRow.getByRole('button', { name: 'Delete' }).click();
        
        const confirmBtn = page.getByRole('button', { name: 'Delete', exact: true }).last()
            .or(page.getByRole('button', { name: 'Yes' }));
        if (await confirmBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
            await confirmBtn.click();
        }
        
        await expect(page.getByText(testTitle)).toBeHidden({ timeout: 10_000 });
    });

    // ─────────────────────────────────────────────────────────────────────────
    // STEP 13 – Изтриване на потребителя
    // ─────────────────────────────────────────────────────────────────────────
    await test.step('Step 13: Delete user via API', async () => {
        const response = await request.delete(`${baseUrl}/auth/me/`, {
            headers: { 'Authorization': `Bearer ${accessToken}` },
        });
        expect(response.status()).toBe(204);
    });
});