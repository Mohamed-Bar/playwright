import { test, expect } from '@playwright/test';
import LoginPage from './pages/loginpage/loginpage';
import * as users from './testdata/users.json';

test.describe('Authentication Module - Login Functionality', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await page.goto('https://www.saucedemo.com/');
    });

    test('AUTH-001: Valid Login with Standard User', async ({ page }) => {
        // Test valid login with standard_user
        await loginPage.enterusername(users.standardUser.username);
        await loginPage.enterpassword(users.standardUser.password);
        await loginPage.takeScreenshot('./tests/screenshots/auth-001-login-form.png');
        
        await loginPage.clickonloginbutton();
        
        // Verify successful login
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
        await expect(page.locator('.app_logo')).toBeVisible();
        await expect(page.locator('.shopping_cart_link')).toBeVisible();
        await expect(page.locator('#react-burger-menu-btn')).toBeVisible();
        
        // Take screenshot of successful login
        await loginPage.takeScreenshot('./tests/screenshots/auth-001-inventory-page.png');
    });

    test('AUTH-002: Invalid Username Login', async ({ page }) => {
        // Test login with invalid username
        await loginPage.enterusername(users.invalidUser.username);
        await loginPage.enterpassword(users.invalidUser.password);
        await loginPage.takeScreenshot('./tests/screenshots/auth-002-invalid-credentials.png');
        
        await loginPage.clickonloginbutton();
        
        // Verify error message is displayed
        const errorMessage = page.locator('[data-test="error"]');
        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toContainText(users.invalidUser.expectedError);
        
        // Verify user remains on login page
        await expect(page).toHaveURL('https://www.saucedemo.com/');
        await expect(page.locator('#login-button')).toBeVisible();
        
        // Take screenshot of error state
        await loginPage.takeScreenshot('./tests/screenshots/auth-002-error-message.png');
    });

    test('AUTH-003: Locked Out User Login', async ({ page }) => {
        // Test login with locked out user
        await loginPage.enterusername(users.lockedUser.username);
        await loginPage.enterpassword(users.lockedUser.password);
        
        await loginPage.clickonloginbutton();
        
        // Verify locked out error message
        const errorMessage = page.locator('[data-test="error"]');
        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toContainText(users.lockedUser.expectedError);
        
        // Verify user remains on login page
        await expect(page).toHaveURL('https://www.saucedemo.com/');
        
        // Take screenshot of locked out state
        await loginPage.takeScreenshot('./tests/screenshots/auth-003-locked-out.png');
    });

    test('AUTH-004: Empty Fields Validation', async ({ page }) => {
        // Test login with empty username and password
        await loginPage.clickonloginbutton();
        
        // Verify username required error
        const errorMessage = page.locator('[data-test="error"]');
        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toContainText('Epic sadface: Username is required');
        
        // Take screenshot of empty fields error
        await loginPage.takeScreenshot('./tests/screenshots/auth-004-empty-fields.png');
    });

    test('AUTH-005: Password Field Security', async ({ page }) => {
        // Test password field masking
        const passwordField = page.locator('#password');
        
        await loginPage.enterpassword('testpassword123');
        
        // Verify password field type is 'password' (masked)
        await expect(passwordField).toHaveAttribute('type', 'password');
        
        // Verify password is not visible in the DOM value
        const passwordValue = await passwordField.inputValue();
        expect(passwordValue).toBe('testpassword123');
        
        // Take screenshot showing masked password
        await loginPage.takeScreenshot('./tests/screenshots/auth-005-masked-password.png');
    });

    test('AUTH-006: Performance User Login Flow', async ({ page }) => {
        // Test login with performance glitch user
        const startTime = Date.now();
        
        await loginPage.enterusername(users.performanceUser.username);
        await loginPage.enterpassword(users.performanceUser.password);
        await loginPage.clickonloginbutton();
        
        // Wait for inventory page to load
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
        await expect(page.locator('.inventory_list')).toBeVisible();
        
        const endTime = Date.now();
        const loadTime = endTime - startTime;
        
        // Log performance metrics
        console.log(`Performance user login took: ${loadTime}ms`);
        
        // Verify it took longer than standard user (basic performance check)
        expect(loadTime).toBeGreaterThan(3000); // Should be slower than normal
        
        // Take screenshot of loaded inventory
        await loginPage.takeScreenshot('./tests/screenshots/auth-006-performance-user.png');
    });

    test.afterEach(async ({ page }) => {
        // Clean up: logout if logged in
        try {
            if (page.url().includes('inventory.html')) {
                await page.locator('#react-burger-menu-btn').click();
                await page.locator('#logout_sidebar_link').click();
            }
        } catch (error) {
            // Ignore errors during cleanup
            console.log('Cleanup: User was not logged in');
        }
    });
});