import { LoginPage } from '../pages/login/LoginPage.js';

export async function commonLogin(page, username, password, baseUrl) {
  const loginPage = new LoginPage(page);
  await loginPage.openWelcomePage();
  await loginPage.assertWelcomePageVisible();
  await loginPage.clickWelcomeLogin();
  await loginPage.login(username, password);
  await loginPage.assertAppsPageLoaded();
  return loginPage;
}

export async function commonLogout(page) {
  const loginPage = new LoginPage(page);
  await loginPage.button.userMenu.click();
}
