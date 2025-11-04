import { Locator} from "@playwright/test";
import BasePage from "../basepage";

export default class LoginPage extends BasePage {
    private readonly usernamefield = this.page.locator('[id="user-name"]');
    private readonly passwordfield = this.page.locator('[id="password"]');
    private readonly loginButton = this.page.locator('#login-button');
    
    async enterusername(username: string) {
        await this.enterTextToElement(this.usernamefield, username);
    }

    async enterpassword(password: string) {
        await this.enterTextToElement(this.passwordfield, password);
    }

    async clickonloginbutton() {
        await this.clickonElement(this.loginButton);
    }
}