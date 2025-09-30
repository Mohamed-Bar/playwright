import BasePage from "../basepage";

 
 export default class ProductPage extends  BasePage {
    private readonly addToCartButton = this.page.locator('[id="add-to-cart-sauce-labs-backpack"]');
    private readonly shoppingCartIcon = this.page.locator('[id="shopping_cart_container"]');   
    async clickOnAddToCartButton() {
        await this.clcikonElement(this.addToCartButton);
    }       
    async clickOnShoppingCartIcon() {
        await this.clcikonElement(this.shoppingCartIcon);
    }
    }
