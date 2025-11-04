import { Locator, Page, expect } from "@playwright/test";
import BasePage from "../basepage";

export default class InventoryPage extends BasePage {
    // Header elements
    private readonly appLogo: Locator = this.page.locator('.app_logo');
    private readonly shoppingCartLink: Locator = this.page.locator('.shopping_cart_link');
    private readonly shoppingCartBadge: Locator = this.page.locator('.shopping_cart_badge');
    private readonly hamburgerMenuBtn: Locator = this.page.locator('#react-burger-menu-btn');
    
    // Sort functionality
    private readonly productSortDropdown: Locator = this.page.locator('[data-test="product-sort-container"]');
    
    // Product grid
    private readonly inventoryList: Locator = this.page.locator('.inventory_list');
    private readonly inventoryItems: Locator = this.page.locator('.inventory_item');
    private readonly inventoryItemNames: Locator = this.page.locator('.inventory_item_name');
    private readonly inventoryItemPrices: Locator = this.page.locator('.inventory_item_price');
    private readonly inventoryItemDescriptions: Locator = this.page.locator('.inventory_item_desc');
    
    // Hamburger menu items
    private readonly allItemsLink: Locator = this.page.locator('#inventory_sidebar_link');
    private readonly aboutLink: Locator = this.page.locator('#about_sidebar_link');
    private readonly logoutLink: Locator = this.page.locator('#logout_sidebar_link');
    private readonly resetAppStateLink: Locator = this.page.locator('#reset_sidebar_link');

    /**
     * Navigate to inventory page (assumes user is already logged in)
     */
    async navigateToInventory(): Promise<void> {
        await this.page.goto('https://www.saucedemo.com/inventory.html');
        await this.waitForInventoryToLoad();
    }

    /**
     * Wait for inventory page to fully load
     */
    async waitForInventoryToLoad(): Promise<void> {
        await expect(this.inventoryList).toBeVisible();
        await expect(this.inventoryItems.first()).toBeVisible();
    }

    /**
     * Get the count of items in the shopping cart
     */
    async getCartItemCount(): Promise<number> {
        try {
            const badgeText = await this.shoppingCartBadge.textContent();
            return badgeText ? parseInt(badgeText) : 0;
        } catch {
            return 0; // Badge not visible means 0 items
        }
    }

    /**
     * Click on shopping cart to navigate to cart page
     */
    async clickShoppingCart(): Promise<void> {
        await this.clickonElement(this.shoppingCartLink);
    }

    /**
     * Sort products by the specified option
     * @param sortOption - az, za, lohi, hilo
     */
    async sortProductsBy(sortOption: string): Promise<void> {
        // Wait for dropdown to be available and visible
        await this.productSortDropdown.waitFor({ state: 'visible', timeout: 10000 });
        await this.productSortDropdown.selectOption(sortOption);
        // Wait a moment for sorting to complete
        await this.page.waitForTimeout(1000);
        // Verify sorting completed by waiting for inventory items to be stable
        await this.inventoryItems.first().waitFor({ state: 'visible' });
    }

    /**
     * Get all product names in current order
     */
    async getProductNames(): Promise<string[]> {
        return await this.inventoryItemNames.allTextContents();
    }

    /**
     * Get all product prices in current order
     */
    async getProductPrices(): Promise<number[]> {
        const priceTexts = await this.inventoryItemPrices.allTextContents();
        return priceTexts.map(price => parseFloat(price.replace('$', '')));
    }

    /**
     * Add product to cart by product name
     * @param productName - Name of the product to add
     */
    async addProductToCart(productName: string): Promise<void> {
        // Convert product name to button ID format
        const buttonId = this.convertNameToButtonId(productName, 'add-to-cart');
        const addButton = this.page.locator(`[id="${buttonId}"]`);
        await this.clickonElement(addButton);
    }

    /**
     * Remove product from cart by product name
     * @param productName - Name of the product to remove
     */
    async removeProductFromCart(productName: string): Promise<void> {
        const buttonId = this.convertNameToButtonId(productName, 'remove');
        const removeButton = this.page.locator(`[id="${buttonId}"]`);
        await this.clickonElement(removeButton);
    }

    /**
     * Add multiple products to cart
     * @param productNames - Array of product names to add
     */
    async addMultipleProductsToCart(productNames: string[]): Promise<void> {
        for (const productName of productNames) {
            await this.addProductToCart(productName);
        }
    }

    /**
     * Add all products to cart
     */
    async addAllProductsToCart(): Promise<void> {
        const productNames = await this.getProductNames();
        await this.addMultipleProductsToCart(productNames);
    }

    /**
     * Click on a product name to navigate to product detail page
     * @param productName - Name of the product to click
     */
    async clickProductDetails(productName: string): Promise<void> {
        const productLink = this.page.locator('.inventory_item_name', { hasText: productName });
        await this.clickonElement(productLink);
    }

    /**
     * Open hamburger menu
     */
    async openHamburgerMenu(): Promise<void> {
        await this.clickonElement(this.hamburgerMenuBtn);
        // Wait for menu to animate open
        await this.page.waitForTimeout(500);
    }

    /**
     * Logout from the application
     */
    async logout(): Promise<void> {
        await this.openHamburgerMenu();
        await this.clickonElement(this.logoutLink);
    }

    /**
     * Reset application state
     */
    async resetAppState(): Promise<void> {
        await this.openHamburgerMenu();
        await this.clickonElement(this.resetAppStateLink);
    }

    /**
     * Navigate to About page
     */
    async navigateToAbout(): Promise<void> {
        await this.openHamburgerMenu();
        await this.clickonElement(this.aboutLink);
    }

    /**
     * Verify product is in cart (button shows "Remove")
     * @param productName - Name of the product to check
     */
    async verifyProductInCart(productName: string): Promise<void> {
        const removeButtonId = this.convertNameToButtonId(productName, 'remove');
        const removeButton = this.page.locator(`[id="${removeButtonId}"]`);
        await expect(removeButton).toBeVisible();
    }

    /**
     * Verify product is not in cart (button shows "Add to cart")
     * @param productName - Name of the product to check
     */
    async verifyProductNotInCart(productName: string): Promise<void> {
        const addButtonId = this.convertNameToButtonId(productName, 'add-to-cart');
        const addButton = this.page.locator(`[id="${addButtonId}"]`);
        
        // Wait a bit for the reset state to stabilize
        await this.page.waitForTimeout(500);
        
        // Check if add button is visible, if not wait a bit more and retry
        try {
            await expect(addButton).toBeVisible({ timeout: 5000 });
        } catch (error) {
            // If still not visible, try refreshing the page state
            await this.page.reload();
            await this.page.waitForLoadState('networkidle');
            await expect(addButton).toBeVisible();
        }
    }

    /**
     * Verify products are sorted alphabetically A-Z
     */
    async verifyAlphabeticalSortAZ(): Promise<void> {
        const productNames = await this.getProductNames();
        const sortedNames = [...productNames].sort();
        expect(productNames).toEqual(sortedNames);
    }

    /**
     * Verify products are sorted alphabetically Z-A
     */
    async verifyAlphabeticalSortZA(): Promise<void> {
        const productNames = await this.getProductNames();
        const sortedNames = [...productNames].sort().reverse();
        expect(productNames).toEqual(sortedNames);
    }

    /**
     * Verify products are sorted by price low to high
     */
    async verifyPriceSortLowToHigh(): Promise<void> {
        const prices = await this.getProductPrices();
        const sortedPrices = [...prices].sort((a, b) => a - b);
        expect(prices).toEqual(sortedPrices);
    }

    /**
     * Verify products are sorted by price high to low
     */
    async verifyPriceSortHighToLow(): Promise<void> {
        const prices = await this.getProductPrices();
        const sortedPrices = [...prices].sort((a, b) => b - a);
        expect(prices).toEqual(sortedPrices);
    }

    /**
     * Get product information by name
     * @param productName - Name of the product
     */
    async getProductInfo(productName: string): Promise<{name: string, price: number, description: string}> {
        const productItem = this.page.locator('.inventory_item').filter({ has: this.page.locator('.inventory_item_name', { hasText: productName }) });
        
        const name = await productItem.locator('.inventory_item_name').textContent() || '';
        const priceText = await productItem.locator('.inventory_item_price').textContent() || '$0';
        const price = parseFloat(priceText.replace('$', ''));
        const description = await productItem.locator('.inventory_item_desc').textContent() || '';
        
        return { name, price, description };
    }

    /**
     * Convert product name to button ID format
     * @param productName - Product name
     * @param buttonType - 'add-to-cart' or 'remove'
     */
    private convertNameToButtonId(productName: string, buttonType: string): string {
        // Map of product names to their actual button IDs
        const productMap: { [key: string]: string } = {
            'Sauce Labs Backpack': 'sauce-labs-backpack',
            'Sauce Labs Bike Light': 'sauce-labs-bike-light', 
            'Sauce Labs Bolt T-Shirt': 'sauce-labs-bolt-t-shirt',
            'Sauce Labs Fleece Jacket': 'sauce-labs-fleece-jacket',
            'Sauce Labs Onesie': 'sauce-labs-onesie',
            'Test.allTheThings() T-Shirt (Red)': 'test.allthethings()-t-shirt-(red)'
        };
        
        const productId = productMap[productName];
        if (!productId) {
            // Fallback to automatic conversion if product not found
            const cleanName = productName
                .toLowerCase()
                .replace(/[^a-z0-9\s]/g, '')
                .replace(/\s+/g, '-')
                .replace(/--+/g, '-');
            return `${buttonType}-${cleanName}`;
        }
        
        return `${buttonType}-${productId}`;
    }

    /**
     * Verify all expected products are displayed
     * @param expectedProductCount - Expected number of products (default: 6)
     */
    async verifyAllProductsDisplayed(expectedProductCount: number = 6): Promise<void> {
        await expect(this.inventoryItems).toHaveCount(expectedProductCount);
        
        // Verify each product has required elements
        for (let i = 0; i < expectedProductCount; i++) {
            const item = this.inventoryItems.nth(i);
            // Use more specific selectors to avoid strict mode violations
            await expect(item.locator('img.inventory_item_img')).toBeVisible();
            await expect(item.locator('.inventory_item_name')).toBeVisible();
            await expect(item.locator('.inventory_item_desc')).toBeVisible();
            await expect(item.locator('.inventory_item_price')).toBeVisible();
            await expect(item.locator('button[data-test*="add-to-cart"], button[data-test*="remove"]')).toBeVisible(); // Add to cart or Remove button
        }
    }

    /**
     * Take screenshot with descriptive filename
     * @param filename - Screenshot filename
     */
    async takeInventoryScreenshot(filename: string): Promise<void> {
        await this.takeScreenshot(`./tests/screenshots/inventory-${filename}`);
    }
}