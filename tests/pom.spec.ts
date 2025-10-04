import { test ,expect } from './fixtures/fixtures' ;
import ProductPage from "./pages/productpage/productpage";
import LoginPage from "./pages/loginpage/loginpage";

import * as testdata from './testdata/testdata.json' ;

/*test.beforeAll (async ({page})=> {
    console.log("Tests started");
})
test.beforeEach(async ({page})=> {
    console.log("Test case started"); 
   
})
test.afterAll (async ({page})=> {
    console.log("Tests completed");
})

test.afterEach(async ({page})=> {
    console.log("Test case completed");
})*/



test ('E2E@smoke', async ({page})=> {
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
test ('E2E2@smoke', async ({page})=> {
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