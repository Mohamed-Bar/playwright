import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://the-internet.herokuapp.com/');
  await page.getByRole('heading', { name: 'Welcome to the-internet' }).click();
  await page.getByRole('heading', { name: 'Welcome to the-internet' }).click({
    button: 'right'
  });
  await page.getByRole('heading', { name: 'Welcome to the-internet' }).click();
  await page.getByRole('heading', { name: 'Welcome to the-internet' }).click();
  await expect(page.locator('h1')).toContainText('Welcome to the-internet');
  await page.getByRole('link', { name: 'Form Authentication' }).click();
  //await expect(page.locator('h2')).toContainText('Login Page');
  await expect(page.getByRole('textbox', { name: 'Username' })).toBeVisible();
  //await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Username' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('tomsmith');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('SuperSecretPassword!');
  await page.getByRole('button', { name: ' Login' }).click();
  await expect(page.getByText('You logged into a secure area')).toBeVisible();
  await expect(page.locator('#flash')).toContainText('You logged into a secure area! ×');
  await expect(page.locator('#content')).toContainText('Logout');
  await page.getByRole('link', { name: 'Logout' }).click();
});