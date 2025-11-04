import { Locator, Page, expect } from "@playwright/test";
import BasePage from "../basepage";

export default class CartPage extends BasePage {
    // Cart page elements
    private readonly cartList: Locator = this.page.locator('.cart_list');
    private readonly cartItems: Locator = this.page.locator('.cart_item');
    private readonly cartItemNames: Locator = this.page.locator('.inventory_item_name');
    private readonly cartItemPrices: Locator = this.page.locator('.inventory_item_price');
    private readonly cartItemQuantities: Locator = this.page.locator('.cart_quantity');
    
    // Action buttons
    private readonly continueShoppingBtn: Locator = this.page.locator('#continue-shopping');
    private readonly checkoutBtn: Locator = this.page.locator('#checkout');
    
    // Header elements
    private readonly shoppingCartBadge: Locator = this.page.locator('.shopping_cart_badge');

    /**
     * Navigate to cart page
     */
    async navigateToCart(): Promise<void> {
        await this.page.goto('https://www.saucedemo.com/cart.html');
        await this.waitForCartToLoad();
    }

    /**
     * Wait for cart page to load
     */
    async waitForCartToLoad(): Promise<void> {
        await expect(this.cartList).toBeVisible();
        await expect(this.continueShoppingBtn).toBeVisible();
        await expect(this.checkoutBtn).toBeVisible();
    }

    /**
     * Get the number of items in the cart
     */
    async getCartItemCount(): Promise<number> {
        try {
            // Check if page is still available
            if (this.page.isClosed()) {
                return 0;
            }
            
            // Try to get badge count first
            if (await this.shoppingCartBadge.isVisible({ timeout: 2000 })) {
                const badgeText = await this.shoppingCartBadge.textContent();
                return badgeText ? parseInt(badgeText) : 0;
            }
            
            // Fall back to counting cart items if on cart page
            if (this.page.url().includes('cart.html')) {
                return await this.cartItems.count();
            }
            
            return 0;
        } catch (error) {
            console.log('Error getting cart item count:', error instanceof Error ? error.message : String(error));
            return 0;
        }
    }

    /**
     * Get all product names in cart
     */
    async getCartProductNames(): Promise<string[]> {
        return await this.cartItemNames.allTextContents();
    }

    /**
     * Get all product prices in cart
     */
    async getCartProductPrices(): Promise<number[]> {
        const priceTexts = await this.cartItemPrices.allTextContents();
        return priceTexts.map(price => parseFloat(price.replace('$', '')));
    }

    /**
     * Get total price of all items in cart
     */
    async calculateCartTotal(): Promise<number> {
        const prices = await this.getCartProductPrices();
        return prices.reduce((total, price) => total + price, 0);
    }

    /**
     * Remove product from cart by product name
     * @param productName - Name of the product to remove
     */
    async removeProductFromCart(productName: string): Promise<void> {
        const cartItem = this.page.locator('.cart_item').filter({ 
            has: this.page.locator('.inventory_item_name', { hasText: productName }) 
        });
        
        const removeButton = cartItem.locator('button', { hasText: 'Remove' });
        await this.clickonElement(removeButton);
    }

    /**
     * Remove all products from cart
     */
    async removeAllProductsFromCart(): Promise<void> {
        const productNames = await this.getCartProductNames();
        for (const productName of productNames) {
            await this.removeProductFromCart(productName);
        }
    }

    /**
     * Continue shopping (return to inventory)
     */
    async continueShopping(): Promise<void> {
        await this.clickonElement(this.continueShoppingBtn);
    }

    /**
     * Proceed to checkout
     */
    async proceedToCheckout(): Promise<void> {
        await this.clickonElement(this.checkoutBtn);
    }

    /**
     * Verify product is in cart
     * @param productName - Name of the product to verify
     */
    async verifyProductInCart(productName: string): Promise<void> {
        const cartItem = this.page.locator('.cart_item').filter({ 
            has: this.page.locator('.inventory_item_name', { hasText: productName }) 
        });
        await expect(cartItem).toBeVisible();
    }

    /**
     * Verify product is not in cart
     * @param productName - Name of the product to verify
     */
    async verifyProductNotInCart(productName: string): Promise<void> {
        const cartItem = this.page.locator('.cart_item').filter({ 
            has: this.page.locator('.inventory_item_name', { hasText: productName }) 
        });
        await expect(cartItem).not.toBeVisible();
    }

    /**
     * Verify cart is empty
     */
    async verifyCartIsEmpty(): Promise<void> {
        // Check if page is still available
        if (this.page.isClosed()) {
            return;
        }
        
        const itemCount = await this.getCartItemCount();
        expect(itemCount).toBe(0);
        
        // Only verify cart items count if we're on the cart page
        if (this.page.url().includes('cart.html')) {
            await expect(this.cartItems).toHaveCount(0);
        }
    }

    /**
     * Get product information from cart
     * @param productName - Name of the product
     */
    async getCartProductInfo(productName: string): Promise<{name: string, price: number, quantity: number}> {
        const cartItem = this.page.locator('.cart_item').filter({ 
            has: this.page.locator('.inventory_item_name', { hasText: productName }) 
        });
        
        const name = await cartItem.locator('.inventory_item_name').textContent() || '';
        const priceText = await cartItem.locator('.inventory_item_price').textContent() || '$0';
        const price = parseFloat(priceText.replace('$', ''));
        const quantityText = await cartItem.locator('.cart_quantity').textContent() || '1';
        const quantity = parseInt(quantityText);
        
        return { name, price, quantity };
    }

    /**
     * Verify cart contains expected products
     * @param expectedProducts - Array of expected product names
     */
    async verifyCartContainsProducts(expectedProducts: string[]): Promise<void> {
        const actualProducts = await this.getCartProductNames();
        
        expect(actualProducts.length).toBe(expectedProducts.length);
        
        for (const product of expectedProducts) {
            expect(actualProducts).toContain(product);
        }
    }

    /**
     * Take screenshot of cart page
     * @param filename - Screenshot filename
     */
    async takeCartScreenshot(filename: string): Promise<void> {
        await this.takeScreenshot(`./tests/screenshots/cart-${filename}`);
    }
}