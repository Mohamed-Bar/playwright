import { Locator, Page, expect } from "@playwright/test";
import BasePage from "../basepage";

export default class FormAuthPage extends BasePage {
    // Locators for the login page
    private readonly usernameField: Locator = this.page.locator('[name="username"]');
    private readonly passwordField: Locator = this.page.locator('[name="password"]');
    private readonly loginButton: Locator = this.page.getByRole('button', { name: /login/i });
    
    // Locators for the secure page (after successful login)
    private readonly successMessage: Locator = this.page.locator('#flash');
    private readonly secureAreaHeading: Locator = this.page.locator('h2').filter({ hasText: 'Secure Area' });
    private readonly logoutButton: Locator = this.page.getByRole('link', { name: 'Logout' });
    
    // Locators for the main page
    private readonly formAuthLink: Locator = this.page.getByRole('link', { name: 'Form Authentication' });

    /**
     * Navigate to the main internet herokuapp page
     */
    async navigateToMainPage(): Promise<void> {
        await this.page.goto('https://the-internet.herokuapp.com/');
    }

    /**
     * Click on Form Authentication link from the main page
     */
    async clickFormAuthenticationLink(): Promise<void> {
        await this.clcikonElement(this.formAuthLink);
    }

    /**
     * Enter username in the username field
     * @param username - The username to enter
     */
    async enterUsername(username: string): Promise<void> {
        await this.enterTextToElement(this.usernameField, username);
    }

    /**
     * Enter password in the password field
     * @param password - The password to enter
     */
    async enterPassword(password: string): Promise<void> {
        await this.enterTextToElement(this.passwordField, password);
    }

    /**
     * Click the login button
     */
    async clickLoginButton(): Promise<void> {
        await this.clcikonElement(this.loginButton);
    }

    /**
     * Complete login flow with provided credentials
     * @param username - The username to use for login
     * @param password - The password to use for login
     */
    async performLogin(username: string, password: string): Promise<void> {
        await this.enterUsername(username);
        await this.enterPassword(password);
        await this.clickLoginButton();
    }

    /**
     * Assert that login was successful by checking success message
     */
    async assertLoginSuccess(): Promise<void> {
        await expect(this.successMessage).toBeVisible();
        await expect(this.successMessage).toContainText('You logged into a secure area!');
    }

    /**
     * Assert that we are on the secure page
     */
    async assertOnSecurePage(): Promise<void> {
        await expect(this.secureAreaHeading).toBeVisible();
        await expect(this.logoutButton).toBeVisible();
        await expect(this.page).toHaveURL(/.*\/secure/);
    }

    /**
     * Assert login failure by checking error message
     */
    async assertLoginFailure(): Promise<void> {
        await expect(this.successMessage).toBeVisible();
        await expect(this.successMessage).toContainText(/Your username is invalid|Your password is invalid/);
    }

    /**
     * Wait for specified duration
     * @param seconds - Number of seconds to wait
     */
    async waitForSeconds(seconds: number): Promise<void> {
        await this.page.waitForTimeout(seconds * 1000);
    }

    /**
     * Click logout button
     */
    async clickLogout(): Promise<void> {
        await this.clcikonElement(this.logoutButton);
    }
}