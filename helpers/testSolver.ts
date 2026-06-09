import { BrowserContext, expect } from '@playwright/test';
import { CompanyManagementPage } from '../pages/company_management';
import { TestExecutionPage } from '../pages/test_execution';

function normalizeQuestionType(type: string): string {
  const normalized = (type || '').trim().toLowerCase();

  switch (normalized) {
    case 'single choice':
    case 'single_choice':
    case 'single-select':
    case 'single select':
      return 'Single Choice';

    case 'multiple select':
    case 'multiple_choice':
    case 'multi select':
    case 'multi-select':
    case 'multi_select':
      return 'Multiple Select';

    case 'exact answer':
    case 'exact_answer':
    case 'text':
      return 'Exact Answer';

    default:
      return type;
  }
}

export async function solveTest(
  context: BrowserContext,
  companyManagement: CompanyManagementPage,
  testData: any,
  studentName: string,
  successRate: number
) {
  const pagePromise = context.waitForEvent('page');

  await companyManagement.takeBel(testData.testTitle);

  const childPage = await pagePromise;
  await childPage.waitForLoadState('domcontentloaded');
  await childPage.waitForURL(/\/t\//);

  const testExecution = new TestExecutionPage(childPage);

  await testExecution.addName(studentName);
  await testExecution.startTest();

  const totalQuestions = testData.questions.length;
  const correctCount = Math.round(totalQuestions * successRate / 100);
  const indices = Array.from({ length: totalQuestions }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const correctIndices = new Set(indices.slice(0, correctCount));

  for (let i = 0; i < totalQuestions; i++) {
    await answerQuestion(testExecution, testData.questions[i], correctIndices.has(i));
  }

  await testExecution.submitTest();

  await testExecution.successfullMessage_1.waitFor({
    state: 'visible',
    timeout: 20000
  });

  await expect(testExecution.successfullMessage_1).toBeVisible();

  await childPage.close();
}

async function answerQuestion(
  testExecution: TestExecutionPage,
  question: any,
  correct: boolean
) {
  const type = normalizeQuestionType(question.type);

  /* ---------------- EXACT ---------------- */
  if (type === 'Exact Answer') {
    const answer = correct
      ? question.correct_answer
      : 'ГрешенОтговор';

    await testExecution.fillExactAnswer(question.text, answer);
    return;
  }

  /* ---------------- SINGLE CHOICE ---------------- */
  if (type === 'Single Choice') {
    const answers = correct
      ? question.answers.filter((a: any) => a.correct)
      : question.answers.filter((a: any) => !a.correct);

    const answer = answers[Math.floor(Math.random() * answers.length)];

    const option = testExecution.page
      .locator('label')
      .filter({ hasText: answer.text })
      .first();

    await expect(option).toBeVisible();
    await option.click({ force: true });

    return;
  }

  /* ---------------- MULTIPLE SELECT ---------------- */
  if (type === 'Multiple Select') {
    const answers = correct
      ? question.answers.filter((a: any) => a.correct)
      : question.answers.filter((a: any) => !a.correct);

    for (const answer of answers) {
      const option = testExecution.page
        .locator('label')
        .filter({ hasText: answer.text })
        .first();

      await expect(option).toBeVisible();
      await option.click({ force: true });
    }

    return;
  }

  throw new Error(`Unknown question type: ${question.type}`);
}