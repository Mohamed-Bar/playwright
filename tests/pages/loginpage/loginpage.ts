import { Locator} from "@playwright/test";
import BasePage from "../basepage";

export default class loginPage extends BasePage {
    [x: string]: any;
    private readonly usernamefield = this.page.locator('[id="user-name"]');
    private readonly passwordfelid = this.page.locator('[id="password"]');
    private readonly loginButton = this.page.locator('#login-button');
    
    async enterusername() {
        await this.enterTextToElement (this.usernamefield,"standard_user");  
    }
    async enterpassword() {
        await this.enterTextToElement (this.passwordfelid,"secret_sauce");  
    }           
    async clickonloginbutton() {
        await this.clcikonElement (this.loginButton);
    
    }
    }   




