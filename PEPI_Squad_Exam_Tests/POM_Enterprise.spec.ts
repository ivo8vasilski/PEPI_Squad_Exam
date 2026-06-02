import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

// 1. Импорт на стандартните Node.js модули за файловата система
import fs from 'fs';
import path from 'path';

// 2. Импорт на страниците на Любо (точно по структурата от папка pages/)
import { LoginPage } from './pages/login';
import { DashboardPage } from './pages/dashboard';
import { CompaniesPage } from './pages/companies';
import { CompanyManagement_Page } from './pages/company_management'; 
import { CreateTestPage } from './pages/create_test';
import { AddQuestionPage } from './pages/add_question';
import { TestExecutionPage } from './pages/test_execution';
import { TestResultPage } from './pages/test_result';

dotenv.config();

// 3. ЗАРЕЖДАНЕ НА ДАННИТЕ: Файлът се чете от папка 'utils'
const testDataPath = path.join(__dirname, 'utils', 'test-data.json');
const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'));

test('Task 8: Enterprise POM Architecture Workflow fed by JSON', async ({ page, request }) => {
    test.setTimeout(900_000); // 15 минути лимит поради мащаба от 30 въпроса общо

    const password = process.env.TEST_USER_PASSWORD || 'SecurePass123!';
    const baseUrl = 'https://exampractices.com/api';
    const uniqueId = Date.now();

    // Динамично изграждане на уникални имейли въз основа на JSON конфигурацията
    const adminEmail = `admin_${uniqueId}@test.com`;
    const instructorEmail = `instructor_${uniqueId}@test.com`;
    const studentEmails = testData.users.students.map((_: any, i: number) => `student_${i + 3}_${uniqueId}@test.com`);
    const finalCompanyName = `${testData.companyName} - ${uniqueId}`;

    // Инициализиране на обектите от страниците на Любо
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const companiesPage = new CompaniesPage(page);
    const companyManagement = new CompanyManagement_Page(page);
    const createTest = new CreateTestPage(page);
    const addQuestion = new AddQuestionPage(page);
    const testResult = new TestResultPage(page);

    // ─────────────────────────────────────────────────────────────────────────
    // СТЪПКА 1 – СЪЗДАВАНЕ НА ПОТРЕБИТЕЛИТЕ (Бърз бекенд импорт през API)
    // ─────────────────────────────────────────────────────────────────────────
    await test.step('Provision all 5 users via backend API', async () => {
        await request.post(`${baseUrl}/auth/register/`, { data: { email: adminEmail, first_name: testData.users.admin.first_name, last_name: testData.users.admin.last_name, password, password_confirm: password } });
        await request.post(`${baseUrl}/auth/register/`, { data: { email: instructorEmail, first_name: testData.users.instructor.first_name, last_name: testData.users.instructor.last_name, password, password_confirm: password } });
        for (let i = 0; i < studentEmails.length; i++) {
            await request.post(`${baseUrl}/auth/register/`, { data: { email: studentEmails[i], first_name: testData.users.students[i].first_name, last_name: testData.users.students[i].last_name, password, password_confirm: password } });
        }
    });

    // ─────────────────────────────────────────────────────────────────────────
    // СТЪПКА 2 – АДМИНЪТ СЪЗДАВА КОМПАНИЯ И ПРАЩА ПОКАНИ (През POM)
    // ─────────────────────────────────────────────────────────────────────────
    let companyId: number;
    await test.step('User 1 (Admin) creates company and sends email invites', async () => {
        await loginPage.gotoLoginPage();
        await loginPage.login(adminEmail, password);
        await dashboardPage.gotoCompaniesPage();
        
        await companiesPage.CreateCompany_button(finalCompanyName);
        await companiesPage.Company_button(finalCompanyName);
        
        await page.waitForURL('**/company/**', { timeout: 15000 });
        await page.waitForLoadState('networkidle');
        
        const currentUrl = page.url();
        const urlParts = currentUrl.split('/');
        companyId = parseInt(urlParts[urlParts.indexOf('company') + 1], 10);

        await companyManagement.inviteMember(instructorEmail, 'instructor');

        for (const sEmail of studentEmails) {
            await companyManagement.inviteMember(sEmail, 'student');
        }
        
        await dashboardPage.logout();
    });

    // ─────────────────────────────────────────────────────────────────────────
    // ПОД-СТЪПКА – АВТОМАТИЧНО ПРИЕМАНЕ НА ПОКАНИТЕ (Спрямо API спецификацията)
    // ─────────────────────────────────────────────────────────────────────────
    await test.step('API Auto-accept pending invitations for the team', async () => {
        const adminLoginRes = await request.post(`${baseUrl}/auth/login/`, { data: { email: adminEmail, password } });
        const adminTokens = await adminLoginRes.json();
        
        const invitesRes = await request.get(`${baseUrl}/companies/${companyId}/invites/`, {
            headers: { 'Authorization': `Bearer ${adminTokens.access}` }
        });
        const invitesList = await invitesRes.json();

        for (const invite of invitesList) {
            const currentEmail = invite.email;
            const userLoginRes = await request.post(`${baseUrl}/auth/login/`, { data: { email: currentEmail, password } });
            const userTokens = await userLoginRes.json();

            await request.post(`${baseUrl}/invites/${invite.token}/accept/`, {
                headers: { 'Authorization': `Bearer ${userTokens.access}` }
            });
        }
    });

    // ─────────────────────────────────────────────────────────────────────────
    // СТЪПКА 3 – ИНСТРУКТОРЪТ СЪЗДАВА ПАПКИ И ТЕСТОВЕ ПРЕЗ ДРОПДАУН (Поправена срещу Флейк)
    // ─────────────────────────────────────────────────────────────────────────
    await test.step('User 2 (Instructor) populates folders and questions dynamically from JSON', async () => {
        await loginPage.gotoLoginPage();
        await loginPage.login(instructorEmail, password);
        await dashboardPage.gotoCompaniesPage();
        await companiesPage.Company_button(finalCompanyName); 
        await page.waitForLoadState('networkidle');

        // ЧАСТ 1: Първо създаваме трите папки на екрана на фирмата
        for (const topic of testData.topics) {
            await page.getByRole('button', { name: '+ New' }).click();
            await page.getByPlaceholder(/Folder name/i).fill(topic.folder);
            await page.getByRole('button', { name: /Create|Save/i }).click();
            await page.waitForTimeout(500);
        }

        // ЧАСТ 2: За всяка тема отваряме формата за тест и добавяме въпросите
        for (const topic of testData.topics) {
            await companyManagement.CreateTestButton();
            await createTest.initTest(topic.testTitle, topic.folder);

            let isFirstQuestion = true;
            for (const question of topic.questions) {
                await addQuestion.addQuestion(question);
                
                // 👉 ФИКС СРЕЩУ RACE CONDITION: Ако това е първият въпрос, изчакваме UI състоянието 
                // "No questions yet." и "Add your first question" стабилно да се демонтират от екрана.
                if (isFirstQuestion) {
                    await expect(page.getByText('No questions yet.')).toBeHidden({ timeout: 10000 });
                    await expect(page.getByRole('button', { name: 'Add your first question' })).toBeHidden({ timeout: 10000 });
                    isFirstQuestion = false;
                }

                // Застраховка за стабилност при бърза комуникация с базата данни
                await page.waitForLoadState('networkidle');
            }
            
            await dashboardPage.gotoCompaniesPage();
            await companiesPage.Company_button(finalCompanyName);
            await page.waitForLoadState('networkidle');
        }
        await dashboardPage.logout();
    });

    // ─────────────────────────────────────────────────────────────────────────
    // СТЪПКА 4 – ГРУПАТА РЕШАВА ВСИЧКИ ТЕСТОВЕ ДИРЕКТНО ОТ КАРТИТЕ (Изолирана)
    // ─────────────────────────────────────────────────────────────────────────
    await test.step('Students execute ALL tests causing score polarization', async () => {
        for (let s = 0; s < studentEmails.length; s++) {
            for (let t = 0; t < testData.topics.length; t++) {
                const topic = testData.topics[t]; 
                
                await loginPage.gotoLoginPage();
                await loginPage.login(studentEmails[s], password);
                
                await dashboardPage.gotoCompaniesPage();
                await companiesPage.Company_button(finalCompanyName);
                await page.waitForLoadState('networkidle');
                await page.waitForTimeout(500);

                // 👉 ФИКС: Филтрираме div-овете да съдържат заглавието И бутона Take.
                  // Използваме .last(), защото в DOM дървото най-вътрешният (същинският) контейнер на картата се пада последен.
                  const testCard = page.locator('div')
                      .filter({ has: page.getByRole('heading', { level: 3, name: topic.testTitle }) })
                      .filter({ has: page.getByRole('link', { name: 'Take' }) })
                      .last();

                  // 2. Бутонът "Take" вече ще бъде 100% изолиран само в пределите на тази карта
                  const currentTakeButton = testCard.getByRole('link', { name: 'Take' });
                  
                  await currentTakeButton.waitFor({ state: 'visible', timeout: 5000 });
                
                // АСИНХРОННО ПРИХВАЩАНЕ НА НОВИЯ ТАБ
                const [popupPage] = await Promise.all([
                    page.waitForEvent('popup'),
                    currentTakeButton.click(),
                ]);

                await popupPage.waitForLoadState('networkidle');

                const popupExecution = new TestExecutionPage(popupPage);
                await popupExecution.start(`Student ${s + 3}`);

                let questionIndex = 0;
                for (const question of topic.questions) {
                    
                    // 👉 ФИКС: Оставяме изцяло на интелигентния метод answerQuestion да се оправя с типовете въпроси
                    // и да попълва правилните/грешните отговори, тъй като вътре в него вече всичко е изолирано.
                    if (s === 0) {
                        // Първият студент дава само верни отговори
                        await popupExecution.answerQuestion(question, true);
                    } 
                    else if (s === 1) {
                        // Вторият студент умишлено бърка на определени индекси
                        const shouldBeCorrect = (questionIndex !== 4 && questionIndex !== 9);
                        await popupExecution.answerQuestion(question, shouldBeCorrect);
                    } 
                    else {
                        // Останалите студенти редуват верни и грешни
                        const shouldBeCorrect = (questionIndex % 3 === 0);
                        await popupExecution.answerQuestion(question, shouldBeCorrect);
                    }
                    
                    questionIndex++;
                }
                
                // Предаваме изпита и затваряме popup таба чисто
                await popupExecution.Submit_Test(); 
                await popupPage.close();
                
                // Излизаме от сесията на студента
                await dashboardPage.logout();
                await page.waitForLoadState('networkidle');
            }
        }
    });
    // ─────────────────────────────────────────────────────────────────────────
    // СТЪПКА 5 – ИНСТРУКТОРЪТ ОДИТИРА НАЙ-ДОБРИЯ И НАЙ-СЛАБИЯ РЕЗУЛТАТ
    // ─────────────────────────────────────────────────────────────────────────
    // ─────────────────────────────────────────────────────────────────────────
    // СТЪПКА 5 – ИНСТРУКТОРЪТ ОДИТИРА НАЙ-ДОБРИЯ И НАЙ-СЛАБИЯ РЕЗУЛТАТ
    // ─────────────────────────────────────────────────────────────────────────
    await test.step('Instructor verifies analytics for highest and lowest performance', async () => {
        await loginPage.gotoLoginPage();
        await loginPage.login(instructorEmail, password);
        await dashboardPage.gotoCompaniesPage();
        await companiesPage.Company_button(finalCompanyName);
        await page.waitForLoadState('networkidle');
        
        // Отваряме папката
        await page.getByRole('button', { name: testData.topics[0].folder }).click();
        
        // 👉 ФИКС: Подаваме името на теста в метода!
        await testResult.verifyScores(testData.topics[0].testTitle);
    });
});