import {expect,test} from '@playwright/test';
test ('to be hideen',async ({page})=>{
    await page.goto('https://the-internet.herokuapp.com/dynamic_loading/1');
   // await expect    (page.locator('id="finish"')).toBeHidden();
   await expect(page.locator('id="finish"')).toBeVisible(); 
   await page .close();
});


test ('to be persent',async ({page})=>{
    await page.goto('https://the-internet.herokuapp.com/add_remove_elements/');
    await expect    (page.locator('[class="added-manually"]')).not.toHaveCount(1);
    await page.click('[onclick="addElement()"]');
    await expect    (page.locator('[class="added-manually"]')).toHaveCount(1);
   
   await page .close();
});


test('to be enabled', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/dynamic_controls');
    await expect(page.locator('xpath=//*[@id="input-example"]/input')).toBeDisabled();
    await page.locator('xpath=//*[@id="input-example"]/button').click();
    await expect(page.locator('xpath=//*[@id="input-example"]/input')).toBeEnabled();
    await page.close();
});

test('to have text', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/dynamic_controls');
    await expect(page.locator('xpath=//*[@id="input-example"]/button')).toHaveText('Enable');
    await page.close();
});

test('to have attribute', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/dynamic_controls');
    await expect(page.locator('xpath=//*[@id="input-example"]/button')).toHaveAttribute('autocomplete', 'off');
await page.close();
});

test('to have url', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/dynamic_controls');
    //full url
    await expect(page).toHaveURL('https://the-internet.herokuapp.com/dynamic_controls');
    //part of url
    await expect(page).toHaveURL(/herokuapp/);
    await page.close();
});

test('to have titel', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/dynamic_controls');
    //full titel
    await expect(page).toHaveTitle('The Internet');
    //partail of titel
    await expect(page).toHaveTitle(/.*The Internet/);
    await page.close();
});

test('to have screenshot', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/dynamic_controls');
   await expect(page).toHaveScreenshot( );
    await page.close();
});