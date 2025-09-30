import { test, expect , Page   } from "@playwright/test";  
import ProductPage from "./pages/productpage/productpage";
import LoginPage from "./pages/loginpage/loginpage";




test ('E2E', async ({page})=> {
    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);
    await page.goto('https://www.saucedemo.com/');
    await loginPage.enterusername();
    await loginPage.enterpassword();
    await loginPage.clickonloginbutton();
    await productPage.clickOnAddToCartButton();
    await productPage.clickOnShoppingCartIcon();
    await page .waitForTimeout (3000);
    page.close

});

    /*await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
await expect(page.locator('text=Sauce Labs Backpack')).toBeVisible();
await expect(page.locator('text=1')).toBeVisible();
await expect(page.locator('text=Your Cart')).toBeVisible();
    // await page.close();*/