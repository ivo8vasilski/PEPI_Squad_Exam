import { test, expect, BrowserContext } from "@playwright/test";
import test_data from '../data/test_data.json';
import { LoginPage } from "../pages/login";
import { DashboardPage } from "../pages/dashboard";
import { CompaniesPage } from "../pages/companies";
import { CompanyManagementPage } from '../pages/company_management';
import { InvitePage } from "../pages/invitation";
import { CreateTestPage } from "../pages/create_test";
import { AddQuestionPage } from "../pages/add_question";
import { solveTest } from '../helpers/testSolver';
import { TestResultPage } from "../pages/test_result";


test("Create a company and Invite Members", async ({ context }) => {

const page = await context.newPage();
const loginPage = new LoginPage(page);
const dashboard = new DashboardPage (page);
const companies = new CompaniesPage (page);
const companyManagement = new CompanyManagementPage(page);
const invitepage = new InvitePage (page);
const createtest = new CreateTestPage (page);
const addquestion = new AddQuestionPage (page);
const adminPass = test_data.users.admin.password;
const adminEmail = test_data.users.admin.email;
const companyName = test_data.companyName;
const instructorEmail = test_data.users.instructor.email;
const instructorPass = test_data.users.instructor.password;
const student1Email = test_data.users.students[0].email;
const student1Pass = test_data.users.students[0].password;
const student1Name = test_data.users.students[0].first_name;
const student2Email = test_data.users.students[1].email;
const student2Pass = test_data.users.students[1].password;
const student2Name = test_data.users.students[1].first_name;
const student3Email = test_data.users.students[2].email;
const student3Pass = test_data.users.students[2].password;
const student3Name = test_data.users.students[2].first_name;
const test1 = test_data.topics[0];
const test2 = test_data.topics[1];
const test3 = test_data.topics[2];


// Създаване на компания
await loginPage.gotoLoginPage();
await loginPage.login(adminEmail,adminPass);
await dashboard.gotoCompaniesPage();
await companies.createCompany();
await companies.fillCompanyName(companyName);
await companies.create();

//Проверка на заглавието на страницата и името на компанията
await expect (companies.pageTitle).toBeVisible();
await expect(companies.companyLink.filter({ hasText: companyName })).toHaveCount(1);
// Проверка на ролята на потребителя в компанията
await companies.openCompany(companyName);
await expect(companyManagement.userRole).toContainText("admin");

// Изпращане на покани
await companyManagement.ManageMembersButton();

// Покана инструктор
await companyManagement.fillmemberName(instructorEmail);
await companyManagement.selectInstructor();
await companyManagement.inviteButton();
await expect (companyManagement.confirmMessage).toBeVisible();
const inviteLink1 = await companyManagement.getLink();

// Покана студент1
await companyManagement.fillmemberName(student1Email);
await companyManagement.selectStudent();
await companyManagement.inviteButton();
await expect (companyManagement.confirmMessage).toBeVisible();
const inviteLink2 = await companyManagement.getLink();

// Покана студент2
await companyManagement.fillmemberName(student2Email);
await companyManagement.selectStudent();
await companyManagement.inviteButton();
await expect (companyManagement.confirmMessage).toBeVisible();
const inviteLink3 = await companyManagement.getLink();

// Покана студент3
await companyManagement.fillmemberName(student3Email);
await companyManagement.selectStudent();
await companyManagement.inviteButton();
await expect (companyManagement.confirmMessage).toBeVisible();
const inviteLink4 = await companyManagement.getLink();

// Приемане на поканите
await companies.logoutAction();
await page.goto(inviteLink1);
await expect (invitepage.pageTitle).toBeVisible();
await expect (invitepage.message).toBeVisible();
await invitepage.login();
await loginPage.login(instructorEmail,instructorPass);
await expect(companyManagement.userRole).toContainText("instructor");

await companies.logoutAction();
await page.goto(inviteLink2);
await expect (invitepage.pageTitle).toBeVisible();
await expect (invitepage.message).toBeVisible();
await invitepage.login();
await loginPage.login(student1Email,student1Pass);
await expect(companyManagement.userRole).toContainText('student');

await companies.logoutAction();
await page.goto(inviteLink3);
await expect (invitepage.pageTitle).toBeVisible();
await expect (invitepage.message).toBeVisible();
await invitepage.login();
await loginPage.login(student2Email,student2Pass);
await expect(companyManagement.userRole).toContainText('student');

await companies.logoutAction();
await page.goto(inviteLink4);
await expect (invitepage.pageTitle).toBeVisible();
await expect (invitepage.message).toBeVisible();
await invitepage.login();
await loginPage.login(student3Email,student3Pass);
await expect(companyManagement.userRole).toContainText('student');


// Създаване на тестове
await companies.logoutAction();
await loginPage.gotoLoginPage();
await loginPage.login(instructorEmail,instructorPass);
await dashboard.gotoCompaniesPage();

//Проверка на заглавието на страницата и името на компанията
await expect (companies.pageTitle).toBeVisible();
await expect(companies.companyLink.filter({ hasText: companyName })).toHaveCount(1);

// Проверка на ролята на потребителя в компанията
await companies.openCompany(companyName);
await expect(companyManagement.userRole).toContainText("instructor");

//Създаване на папки
await companyManagement.addNewFolder();
await companyManagement.fillfolderName(test1.folder);
await expect(companyManagement.createNewFolder).toBeVisible();
await companyManagement.createFolder();
await expect(companyManagement.newFolderName).not.toBeVisible();

await expect(companyManagement.newFolder).toBeVisible();
await companyManagement.addNewFolder();
await companyManagement.fillfolderName(test2.folder);
await expect(companyManagement.createNewFolder).toBeVisible();
await companyManagement.createFolder();

await expect(companyManagement.newFolderName).not.toBeVisible();

await expect(companyManagement.newFolder).toBeVisible();
await companyManagement.addNewFolder();
await companyManagement.fillfolderName(test3.folder);
await expect(companyManagement.createNewFolder).toBeVisible();
await companyManagement.createFolder();


//Създаване на тест1
await companyManagement.CreateTestButton();
await createtest.testTitle(test1.testTitle)
await (createtest.folder).selectOption(test1.folder)
await createtest.createButton();

//Добавяне на въпроси Tест1
await expect (addquestion.testName).toContainText(test1.testTitle);
await addquestion.questionButton();
await addquestion.selectFolder(test1.folder);
await addquestion.addQuestion(test1.questions[0].text);
await addquestion.selectType(test1.questions[0].type);
await addquestion.answer1(test1.questions[0].answers![0].text);
await addquestion.answer2(test1.questions[0].answers![1].text);
await addquestion.radio();
await addquestion.saveQuestion();

//Въпрос 2
await addquestion.questionButton();
await addquestion.selectFolder(test1.folder);
await addquestion.addQuestion(test1.questions[1].text);
await addquestion.selectType(test1.questions[1].type);
await addquestion.addField();
await addquestion.answer1(test1.questions[1].answers![0].text);
await addquestion.answer2(test1.questions[1].answers![1].text);
await addquestion.answer3(test1.questions[1].answers![2].text);
await addquestion.checkBoxes.nth(0).click();
await addquestion.checkBoxes.nth(1).click();
await addquestion.saveQuestion();

//Въпрос 3
await addquestion.questionButton();
await addquestion.selectFolder(test1.folder);
await addquestion.addQuestion(test1.questions[2].text);
await addquestion.selectType(test1.questions[2].type);
await addquestion.exact(test1.questions[2].correct_answer!);
await addquestion.saveQuestion();

//Въпрос 4
await addquestion.questionButton();
await addquestion.selectFolder(test1.folder);
await addquestion.addQuestion(test1.questions[3].text);
await addquestion.selectType(test1.questions[3].type);
await addquestion.answer1(test1.questions[3].answers![0].text);
await addquestion.answer2(test1.questions[3].answers![1].text);
await addquestion.radio();
await addquestion.saveQuestion();

//Въпрос 5
await addquestion.questionButton();
await addquestion.selectFolder(test1.folder);
await addquestion.addQuestion(test1.questions[4].text);
await addquestion.selectType(test1.questions[4].type);
await addquestion.addField();
await addquestion.answer1(test1.questions[4].answers![0].text);
await addquestion.answer2(test1.questions[4].answers![1].text);
await addquestion.answer3(test1.questions[4].answers![2].text);
await addquestion.checkBoxes.nth(0).click();
await addquestion.checkBoxes.nth(1).click();
await addquestion.saveQuestion();

//Въпрос 6
await addquestion.questionButton();
await addquestion.selectFolder(test1.folder);
await addquestion.addQuestion(test1.questions[5].text);
await addquestion.selectType(test1.questions[5].type);
await addquestion.exact(test1.questions[5].correct_answer!);
await addquestion.saveQuestion();

//Въпрос 7
await addquestion.questionButton();
await addquestion.selectFolder(test1.folder);
await addquestion.addQuestion(test1.questions[6].text);
await addquestion.selectType(test1.questions[6].type);
await addquestion.answer1(test1.questions[6].answers![0].text);
await addquestion.answer2(test1.questions[6].answers![1].text);
await addquestion.radio();
await addquestion.saveQuestion();

//Въпрос 8
await addquestion.questionButton();
await addquestion.selectFolder(test1.folder);
await addquestion.addQuestion(test1.questions[7].text);
await addquestion.selectType(test1.questions[7].type);
await addquestion.addField();
await addquestion.answer1(test1.questions[7].answers![0].text);
await addquestion.answer2(test1.questions[7].answers![1].text);
await addquestion.answer3(test1.questions[7].answers![2].text);
await addquestion.checkBoxes.nth(0).click();
await addquestion.checkBoxes.nth(1).click();
await addquestion.saveQuestion();

//Въпрос 9
await addquestion.questionButton();
await addquestion.selectFolder(test1.folder);
await addquestion.addQuestion(test1.questions[8].text);
await addquestion.selectType(test1.questions[8].type);
await addquestion.exact(test1.questions[8].correct_answer!);
await addquestion.saveQuestion();

//Въпрос 10
await addquestion.questionButton();
await addquestion.selectFolder(test1.folder);
await addquestion.addQuestion(test1.questions[9].text);
await addquestion.selectType(test1.questions[9].type);
await addquestion.answer1(test1.questions[9].answers![0].text);
await addquestion.answer2(test1.questions[9].answers![1].text);
await addquestion.radio();
await addquestion.saveQuestion();


//Създаване на тест2
await addquestion.gotoCompany();
await companyManagement.CreateTestButton();
await createtest.testTitle(test2.testTitle)
await (createtest.folder).selectOption(test2.folder)
await createtest.createButton();

//Добавяне на въпроси Tест2
await expect (addquestion.testName).toContainText(test2.testTitle);
await addquestion.questionButton();
await addquestion.selectFolder(test2.folder);
await addquestion.addQuestion(test2.questions[0].text);
await addquestion.selectType(test2.questions[0].type);
await addquestion.answer1(test2.questions[0].answers![0].text);
await addquestion.answer2(test2.questions[0].answers![1].text);
await addquestion.radio();
await addquestion.saveQuestion();

//Въпрос 2
await addquestion.questionButton();
await addquestion.selectFolder(test2.folder);
await addquestion.addQuestion(test2.questions[1].text);
await addquestion.selectType(test2.questions[1].type);
await addquestion.addField();
await addquestion.answer1(test2.questions[1].answers![0].text);
await addquestion.answer2(test2.questions[1].answers![1].text);
await addquestion.answer3(test2.questions[1].answers![2].text);
await addquestion.checkBoxes.nth(0).click();
await addquestion.checkBoxes.nth(1).click();
await addquestion.saveQuestion();

//Въпрос 3
await addquestion.questionButton();
await addquestion.selectFolder(test2.folder);
await addquestion.addQuestion(test2.questions[2].text);
await addquestion.selectType(test2.questions[2].type);
await addquestion.exact(test2.questions[2].correct_answer!);
await addquestion.saveQuestion();

//Въпрос 4
await addquestion.questionButton();
await addquestion.selectFolder(test2.folder);
await addquestion.addQuestion(test2.questions[3].text);
await addquestion.selectType(test2.questions[3].type);
await addquestion.answer1(test2.questions[3].answers![0].text);
await addquestion.answer2(test2.questions[3].answers![1].text);
await addquestion.radio();
await addquestion.saveQuestion();

//Въпрос 5
await addquestion.questionButton();
await addquestion.selectFolder(test2.folder);
await addquestion.addQuestion(test2.questions[4].text);
await addquestion.selectType(test2.questions[4].type);
await addquestion.addField();
await addquestion.answer1(test2.questions[4].answers![0].text);
await addquestion.answer2(test2.questions[4].answers![1].text);
await addquestion.answer3(test2.questions[4].answers![2].text);
await addquestion.checkBoxes.nth(0).click();
await addquestion.checkBoxes.nth(1).click();
await addquestion.saveQuestion();

//Въпрос 6
await addquestion.questionButton();
await addquestion.selectFolder(test2.folder);
await addquestion.addQuestion(test2.questions[5].text);
await addquestion.selectType(test2.questions[5].type);
await addquestion.exact(test2.questions[5].correct_answer!);
await addquestion.saveQuestion();

//Въпрос 7
await addquestion.questionButton();
await addquestion.selectFolder(test2.folder);
await addquestion.addQuestion(test2.questions[6].text);
await addquestion.selectType(test2.questions[6].type);
await addquestion.answer1(test2.questions[6].answers![0].text);
await addquestion.answer2(test2.questions[6].answers![1].text);
await addquestion.radio();
await addquestion.saveQuestion();

//Въпрос 8
await addquestion.questionButton();
await addquestion.selectFolder(test2.folder);
await addquestion.addQuestion(test2.questions[7].text);
await addquestion.selectType(test2.questions[7].type);
await addquestion.addField();
await addquestion.answer1(test2.questions[7].answers![0].text);
await addquestion.answer2(test2.questions[7].answers![1].text);
await addquestion.answer3(test2.questions[7].answers![2].text);
await addquestion.checkBoxes.nth(0).click();
await addquestion.checkBoxes.nth(1).click();
await addquestion.saveQuestion();

//Въпрос 9
await addquestion.questionButton();
await addquestion.selectFolder(test2.folder);
await addquestion.addQuestion(test2.questions[8].text);
await addquestion.selectType(test2.questions[8].type);
await addquestion.exact(test2.questions[8].correct_answer!);
await addquestion.saveQuestion();

//Въпрос 10
await addquestion.questionButton();
await addquestion.selectFolder(test2.folder);
await addquestion.addQuestion(test2.questions[9].text);
await addquestion.selectType(test2.questions[9].type);
await addquestion.answer1(test2.questions[9].answers![0].text);
await addquestion.answer2(test2.questions[9].answers![1].text);
await addquestion.radio();
await addquestion.saveQuestion();


//Създаване на тест3
await addquestion.gotoCompany();
await companyManagement.CreateTestButton();
await createtest.testTitle(test3.testTitle)
await (createtest.folder).selectOption(test3.folder)
await createtest.createButton();

//Добавяне на въпроси Tест3
await expect (addquestion.testName).toContainText(test3.testTitle);
await addquestion.questionButton();
await addquestion.selectFolder(test3.folder);
await addquestion.addQuestion(test3.questions[0].text);
await addquestion.selectType(test3.questions[0].type);
await addquestion.answer1(test3.questions[0].answers![0].text);
await addquestion.answer2(test3.questions[0].answers![1].text);
await addquestion.radio();
await addquestion.saveQuestion();

//Въпрос 2
await addquestion.questionButton();
await addquestion.selectFolder(test3.folder);
await addquestion.addQuestion(test3.questions[1].text);
await addquestion.selectType(test3.questions[1].type);
await addquestion.addField();
await addquestion.answer1(test3.questions[1].answers![0].text);
await addquestion.answer2(test3.questions[1].answers![1].text);
await addquestion.answer3(test3.questions[1].answers![2].text);
await addquestion.checkBoxes.nth(0).click();
await addquestion.checkBoxes.nth(1).click();
await addquestion.saveQuestion();

//Въпрос 3
await addquestion.questionButton();
await addquestion.selectFolder(test3.folder);
await addquestion.addQuestion(test3.questions[2].text);
await addquestion.selectType(test3.questions[2].type);
await addquestion.exact(test3.questions[2].correct_answer!);
await addquestion.saveQuestion();

//Въпрос 4
await addquestion.questionButton();
await addquestion.selectFolder(test3.folder);
await addquestion.addQuestion(test3.questions[3].text);
await addquestion.selectType(test3.questions[3].type);
await addquestion.answer1(test3.questions[3].answers![0].text);
await addquestion.answer2(test3.questions[3].answers![1].text);
await addquestion.radio();
await addquestion.saveQuestion();

//Въпрос 5
await addquestion.questionButton();
await addquestion.selectFolder(test3.folder);
await addquestion.addQuestion(test3.questions[4].text);
await addquestion.selectType(test3.questions[4].type);
await addquestion.addField();
await addquestion.answer1(test3.questions[4].answers![0].text);
await addquestion.answer2(test3.questions[4].answers![1].text);
await addquestion.answer3(test3.questions[4].answers![2].text);
await addquestion.checkBoxes.nth(0).click();
await addquestion.checkBoxes.nth(1).click();
await addquestion.saveQuestion();

//Въпрос 6
await addquestion.questionButton();
await addquestion.selectFolder(test3.folder);
await addquestion.addQuestion(test3.questions[5].text);
await addquestion.selectType(test3.questions[5].type);
await addquestion.exact(test3.questions[5].correct_answer!);
await addquestion.saveQuestion();

//Въпрос 7
await addquestion.questionButton();
await addquestion.selectFolder(test3.folder);
await addquestion.addQuestion(test3.questions[6].text);
await addquestion.selectType(test3.questions[6].type);
await addquestion.answer1(test3.questions[6].answers![0].text);
await addquestion.answer2(test3.questions[6].answers![1].text);
await addquestion.radio();
await addquestion.saveQuestion();

//Въпрос 8
await addquestion.questionButton();
await addquestion.selectFolder(test3.folder);
await addquestion.addQuestion(test3.questions[7].text);
await addquestion.selectType(test3.questions[7].type);
await addquestion.addField();
await addquestion.answer1(test3.questions[7].answers![0].text);
await addquestion.answer2(test3.questions[7].answers![1].text);
await addquestion.answer3(test3.questions[7].answers![2].text);
await addquestion.checkBoxes.nth(0).click();
await addquestion.checkBoxes.nth(1).click();
await addquestion.saveQuestion();

//Въпрос 9
await addquestion.questionButton();
await addquestion.selectFolder(test3.folder);
await addquestion.addQuestion(test3.questions[8].text);
await addquestion.selectType(test3.questions[8].type);
await addquestion.exact(test3.questions[8].correct_answer!);
await addquestion.saveQuestion();

//Въпрос 10
await addquestion.questionButton();
await addquestion.selectFolder(test3.folder);
await addquestion.addQuestion(test3.questions[9].text);
await addquestion.selectType(test3.questions[9].type);
await addquestion.answer1(test3.questions[9].answers![0].text);
await addquestion.answer2(test3.questions[9].answers![1].text);
await addquestion.radio();
await addquestion.saveQuestion();

//Студент1
await companies.logoutAction();
await loginPage.login(student1Email, student1Pass);

await dashboard.gotoCompaniesPage();
await companies.openCompany(companyName);

const tests = [test1, test2, test3];

for (const testData of tests) {
  await solveTest(
    context,
    companyManagement,
    testData,
    student1Name,
    100
  );
}


//Студент2
await companies.logoutAction();
await loginPage.login(student2Email, student2Pass);

await dashboard.gotoCompaniesPage();
await companies.openCompany(companyName);
for (const testData of tests) {
  await solveTest(
    context,
    companyManagement,
    testData,
    student2Name,
    80
  );
}

//Студент3
await companies.logoutAction();
await loginPage.login(student3Email, student3Pass);

await dashboard.gotoCompaniesPage();
await companies.openCompany(companyName);
for (const testData of tests) {
  await solveTest(
    context,
    companyManagement,
    testData,
    student3Name,

    40
  );
}

// Проверка на резултатите от инструктора
await companies.logoutAction();
await loginPage.login(instructorEmail, instructorPass);

const testResultPage = new TestResultPage(page);

for (const testData of tests) {
  await dashboard.openResults(testData.testTitle);
  await expect(page.getByText('Test Results')).toBeVisible();

  await testResultPage.Analytic_button();

  const results = await testResultPage.getUsersScores();

  const best  = results.reduce((a, b) => a.score > b.score ? a : b);
  const worst = results.reduce((a, b) => a.score < b.score ? a : b);

  expect(best.name).toContain(student1Name);
  expect(worst.name).toContain(student3Name);

  await companies.gotoDashboard();
}

});