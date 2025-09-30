import { test, expect, Page } from '@playwright/test';
import ProductPage from "./pages/productpage/productpage";
import LoginPage from "./pages/loginpage/loginpage";

import * as testdata from './testdata/testdata.json' ;


test ('E2E', async ({page})=> {
    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);
    await page.goto('https://www.saucedemo.com/');
    await loginPage.enterusername(testdata.username);
    await loginPage.enterpassword(testdata.password);
    await loginPage.takeScreenshot('./tests/screenshots/loginpage.png');
    await loginPage.clickonloginbutton();
    await productPage.clickOnAddToCartButton();
    await productPage.takeScreenshot('./tests/screenshots/productpage.png');
    await productPage.clickOnShoppingCartIcon();
    await productPage.takeScreenshot('./tests/screenshots/cartpage.png');
    page.close();

})
;