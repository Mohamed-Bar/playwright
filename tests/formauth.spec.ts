import { test, expect } from '@playwright/test';
import FormAuthPage from './pages/formauthpage/formauthpage';

test.describe('Form Authentication Tests', () => {
    let formAuthPage: FormAuthPage;

    test.beforeEach(async ({ page }) => {
        formAuthPage = new FormAuthPage(page);
    });

    test('Should successfully login with valid credentials', async ({ page }) => {
        // Navigate to the main page
        await formAuthPage.navigateToMainPage();
        
        // Click on Form Authentication link
        await formAuthPage.clickFormAuthenticationLink();
        
        // Perform login with valid credentials from page context
        await formAuthPage.performLogin('tomsmith', 'SuperSecretPassword!');
        
        // Assert successful login
        await formAuthPage.assertLoginSuccess();
        await formAuthPage.assertOnSecurePage();
        
        // Wait for 10 seconds as requested
        await formAuthPage.waitForSeconds(10);
        
        // Take a screenshot for evidence
        await formAuthPage.takeScreenshot('tests/screenshots/successful-login.png');
    });

    test('Should show error message with invalid username', async ({ page }) => {
        // Navigate to the main page
        await formAuthPage.navigateToMainPage();
        
        // Click on Form Authentication link
        await formAuthPage.clickFormAuthenticationLink();
        
        // Perform login with invalid username
        await formAuthPage.performLogin('invaliduser', 'SuperSecretPassword!');
        
        // Assert login failure
        await formAuthPage.assertLoginFailure();
        
        // Take a screenshot for evidence
        await formAuthPage.takeScreenshot('tests/screenshots/invalid-username-login.png');
    });

    test('Should show error message with invalid password', async ({ page }) => {
        // Navigate to the main page
        await formAuthPage.navigateToMainPage();
        
        // Click on Form Authentication link
        await formAuthPage.clickFormAuthenticationLink();
        
        // Perform login with invalid password
        await formAuthPage.performLogin('tomsmith', 'invalidpassword');
        
        // Assert login failure
        await formAuthPage.assertLoginFailure();
        
        // Take a screenshot for evidence
        await formAuthPage.takeScreenshot('tests/screenshots/invalid-password-login.png');
    });

    test('Should show error message with both invalid credentials', async ({ page }) => {
        // Navigate to the main page
        await formAuthPage.navigateToMainPage();
        
        // Click on Form Authentication link
        await formAuthPage.clickFormAuthenticationLink();
        
        // Perform login with both invalid credentials
        await formAuthPage.performLogin('invaliduser', 'invalidpassword');
        
        // Assert login failure
        await formAuthPage.assertLoginFailure();
        
        // Take a screenshot for evidence
        await formAuthPage.takeScreenshot('tests/screenshots/invalid-credentials-login.png');
    });

    test('Should be able to logout after successful login', async ({ page }) => {
        // Navigate to the main page
        await formAuthPage.navigateToMainPage();
        
        // Click on Form Authentication link
        await formAuthPage.clickFormAuthenticationLink();
        
        // Perform login with valid credentials
        await formAuthPage.performLogin('tomsmith', 'SuperSecretPassword!');
        
        // Assert successful login
        await formAuthPage.assertLoginSuccess();
        await formAuthPage.assertOnSecurePage();
        
        // Logout
        await formAuthPage.clickLogout();
        
        // Verify we're back to login page
        await expect(page).toHaveURL(/.*\/login/);
        
        // Take a screenshot for evidence
        await formAuthPage.takeScreenshot('tests/screenshots/successful-logout.png');
    });
});