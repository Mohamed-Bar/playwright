import  {test as _baseTest} from '@playwright/test';
import loginPage from '../pages/loginpage/loginpage';
import ProductPage from '../pages/productpage/productpage';

type    pages = {
    loginPage: loginPage;
    ProductPage: ProductPage;

}
const testpages = _baseTest.extend<pages>({
    loginPage: async ({page}, use) => {
        await use(new loginPage(page));
    },
    ProductPage: async ({page}, use) => {
        await use(new ProductPage(page));
    }
})
export const test = testpages;
export const expect = testpages.expect;
