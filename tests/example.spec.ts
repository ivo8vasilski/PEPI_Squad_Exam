import { test, expect } from "@playwright/test";
import users from '../data/users.json';
import companies from '../data/companies.json';
import { LoginPage } from "../pages/login";

test('Login, async ({ page }) => {
  const loginPage = new LoginPage(page);
  const user = users.user1;

  await loginPage.gotoLoginPage();
  await loginPage.login(user.email, user.password);

});
  