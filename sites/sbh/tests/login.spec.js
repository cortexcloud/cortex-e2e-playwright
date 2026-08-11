const { test } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage.js');
const authData = require('../test_data/auth.json');

test.describe('SBH Site - Login', () => {

  test('Login succeed with valid physician (user1) credentials @SBH @Regression @Login @HappyPath', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const userCredentials = authData.physician;
    const password = process.env.TEST_USER1_PASSWORD || userCredentials.password;

    // Step 1: Open Welcome page & Assert visibility
    await loginPage.openWelcomePage();
    await loginPage.assertWelcomePageVisible();

    // Step 2: Click Login button to redirect to Keycloak SSO
    await loginPage.clickWelcomeLogin();

    // Step 3: Enter valid credentials and submit
    await loginPage.login(userCredentials.user, password);

    // Step 4 - 8: Assert successful login, redirection, user menu text, and active session
    await loginPage.assertLoginSuccess(userCredentials.user);
  });

  test('Login failed with invalid credentials (wrongUser) @SBH @Regression @Login @NegativePath', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const userCredentials = authData.WRONG_USER;

    // Step 1: Open Welcome page & Assert visibility
    await loginPage.openWelcomePage();
    await loginPage.assertWelcomePageVisible();

    // Step 2: Click Login button to redirect to Keycloak SSO
    await loginPage.clickWelcomeLogin();

    // Step 3: Enter invalid username & submit
    await loginPage.login(userCredentials.user, userCredentials.password);

    // Step 4: Assert login error message is displayed
    await loginPage.assertLoginError('Invalid username or password.');
  });

  test('Login failed with invalid credentials (wrongPassword) @SBH @Regression @Login @NegativePath', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const userCredentials = authData.WRONG_PASSWORD;

    // Step 1: Open Welcome page & Assert visibility
    await loginPage.openWelcomePage();
    await loginPage.assertWelcomePageVisible();

    // Step 2: Click Login button to redirect to Keycloak SSO
    await loginPage.clickWelcomeLogin();

    // Step 3: Enter invalid password & submit
    await loginPage.login(userCredentials.user, userCredentials.password);

    // Step 4: Assert login error message is displayed
    await loginPage.assertLoginError('Invalid username or password.');
  });

});
