import { test, expect } from '@playwright/test';
import LoginPage from './pages/loginpage/loginpage';
import InventoryPage from './pages/inventorypage/inventorypage';
import * as users from './testdata/users.json';
import * as products from './testdata/products.json';

test.describe('SauceDemo - Inventory Module', () => {
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        
        // Login with standard user before each test
        await page.goto('https://www.saucedemo.com/');
        await loginPage.enterusername(users.standardUser.username);
        await loginPage.enterpassword(users.standardUser.password);
        await loginPage.clickonloginbutton();
        
        // Verify we're on the inventory page
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
        await inventoryPage.waitForInventoryToLoad();
    });

    test('INV-001: Verify All Products Display Correctly', async ({ page }) => {
        // Verify all 6 products are displayed
        await inventoryPage.verifyAllProductsDisplayed(6);
        
        // Verify specific product details
        const backpackInfo = await inventoryPage.getProductInfo('Sauce Labs Backpack');
        expect(backpackInfo.name).toBe('Sauce Labs Backpack');
        expect(backpackInfo.price).toBe(29.99);
        expect(backpackInfo.description).toContain('Sly Pack'); // Match actual description
        
        // Take screenshot of product display
        await inventoryPage.takeInventoryScreenshot('inv-001-product-display.png');
    });

    test('INV-002: Product Sorting - Name A to Z', async ({ page }) => {
        // Sort products A to Z
        await inventoryPage.sortProductsBy('az');
        
        // Verify alphabetical sort
        await inventoryPage.verifyAlphabeticalSortAZ();
        
        // Take screenshot of sorted products
        await inventoryPage.takeInventoryScreenshot('inv-002-sort-az.png');
    });

    test('INV-003: Product Sorting - Name Z to A', async ({ page }) => {
        // Sort products Z to A
        await inventoryPage.sortProductsBy('za');
        
        // Verify reverse alphabetical sort
        await inventoryPage.verifyAlphabeticalSortZA();
        
        // Take screenshot of sorted products
        await inventoryPage.takeInventoryScreenshot('inv-003-sort-za.png');
    });

    test('INV-004: Product Sorting - Price Low to High', async ({ page }) => {
        // Sort products by price low to high
        await inventoryPage.sortProductsBy('lohi');
        
        // Verify price sort low to high
        await inventoryPage.verifyPriceSortLowToHigh();
        
        // Verify cheapest product is first
        const productNames = await inventoryPage.getProductNames();
        expect(productNames[0]).toBe('Sauce Labs Onesie'); // $7.99
        
        // Take screenshot of sorted products
        await inventoryPage.takeInventoryScreenshot('inv-004-sort-price-lohi.png');
    });

    test('INV-005: Product Sorting - Price High to Low', async ({ page }) => {
        // Sort products by price high to low
        await inventoryPage.sortProductsBy('hilo');
        
        // Verify price sort high to low
        await inventoryPage.verifyPriceSortHighToLow();
        
        // Verify most expensive product is first
        const productNames = await inventoryPage.getProductNames();
        expect(productNames[0]).toBe('Sauce Labs Fleece Jacket'); // $49.99
        
        // Take screenshot of sorted products
        await inventoryPage.takeInventoryScreenshot('inv-005-sort-price-hilo.png');
    });

    test('INV-006: Add Single Product to Cart', async ({ page }) => {
        // Get initial cart count
        const initialCartCount = await inventoryPage.getCartItemCount();
        expect(initialCartCount).toBe(0);
        
        // Add Sauce Labs Backpack to cart
        await inventoryPage.addProductToCart('Sauce Labs Backpack');
        
        // Verify product is in cart
        await inventoryPage.verifyProductInCart('Sauce Labs Backpack');
        
        // Verify cart count updated
        const newCartCount = await inventoryPage.getCartItemCount();
        expect(newCartCount).toBe(1);
        
        // Take screenshot of product in cart
        await inventoryPage.takeInventoryScreenshot('inv-006-single-product-cart.png');
    });

    test('INV-007: Add Multiple Products to Cart', async ({ page }) => {
        const productsToAdd = [
            'Sauce Labs Backpack',
            'Sauce Labs Bike Light',
            'Sauce Labs Bolt T-Shirt'
        ];
        
        // Add multiple products
        await inventoryPage.addMultipleProductsToCart(productsToAdd);
        
        // Verify all products are in cart
        for (const product of productsToAdd) {
            await inventoryPage.verifyProductInCart(product);
        }
        
        // Verify cart count
        const cartCount = await inventoryPage.getCartItemCount();
        expect(cartCount).toBe(3);
        
        // Take screenshot of multiple products in cart
        await inventoryPage.takeInventoryScreenshot('inv-007-multiple-products-cart.png');
    });

    test('INV-008: Add All Products to Cart', async ({ page }) => {
        // Add all products to cart
        await inventoryPage.addAllProductsToCart();
        
        // Verify cart shows 6 items
        const cartCount = await inventoryPage.getCartItemCount();
        expect(cartCount).toBe(6);
        
        // Verify all products show Remove button
        const allProducts = await inventoryPage.getProductNames();
        for (const product of allProducts) {
            await inventoryPage.verifyProductInCart(product);
        }
        
        // Take screenshot of full cart
        await inventoryPage.takeInventoryScreenshot('inv-008-all-products-cart.png');
    });

    test('INV-009: Remove Product from Cart', async ({ page }) => {
        // First add a product
        await inventoryPage.addProductToCart('Sauce Labs Backpack');
        await inventoryPage.verifyProductInCart('Sauce Labs Backpack');
        
        // Remove the product
        await inventoryPage.removeProductFromCart('Sauce Labs Backpack');
        
        // Verify product is no longer in cart
        await inventoryPage.verifyProductNotInCart('Sauce Labs Backpack');
        
        // Verify cart count is 0
        const cartCount = await inventoryPage.getCartItemCount();
        expect(cartCount).toBe(0);
        
        // Take screenshot of empty cart
        await inventoryPage.takeInventoryScreenshot('inv-009-remove-product-cart.png');
    });

    test('INV-010: Navigate to Product Details', async ({ page }) => {
        // Click on product name to view details
        await inventoryPage.clickProductDetails('Sauce Labs Backpack');
        
        // Verify we're on product detail page
        await expect(page).toHaveURL(/.*inventory-item.html\?id=4/);
        
        // Verify product details are displayed
        await expect(page.locator('.inventory_details_name')).toBeVisible();
        await expect(page.locator('.inventory_details_price')).toBeVisible();
        await expect(page.locator('.inventory_details_desc')).toBeVisible();
        
        // Verify Back to products button exists
        await expect(page.locator('#back-to-products')).toBeVisible();
        
        // Take screenshot of product detail page
        await inventoryPage.takeScreenshot('./tests/screenshots/inv-010-product-details.png');
    });

    test('INV-011: Navigate to Shopping Cart', async ({ page }) => {
        // Add a product to cart first
        await inventoryPage.addProductToCart('Sauce Labs Backpack');
        
        // Click shopping cart icon
        await inventoryPage.clickShoppingCart();
        
        // Verify we're on cart page
        await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
        
        // Verify cart page elements
        await expect(page.locator('.cart_list')).toBeVisible();
        await expect(page.locator('#continue-shopping')).toBeVisible();
        await expect(page.locator('#checkout')).toBeVisible();
        
        // Take screenshot of cart page
        await inventoryPage.takeScreenshot('./tests/screenshots/inv-011-cart-page.png');
    });

    test('INV-012: Reset App State', async ({ page }) => {
        // Add products to cart
        await inventoryPage.addMultipleProductsToCart([
            'Sauce Labs Backpack',
            'Sauce Labs Bike Light'
        ]);
        
        // Verify products are in cart
        let cartCount = await inventoryPage.getCartItemCount();
        expect(cartCount).toBe(2);
        
        // Reset app state
        await inventoryPage.resetAppState();
        
        // Verify cart is empty
        cartCount = await inventoryPage.getCartItemCount();
        expect(cartCount).toBe(0);
        
        // Verify all buttons show "Add to cart"
        const allProducts = await inventoryPage.getProductNames();
        for (const product of allProducts) {
            await inventoryPage.verifyProductNotInCart(product);
        }
        
        // Take screenshot after reset
        await inventoryPage.takeInventoryScreenshot('inv-012-reset-app-state.png');
    });

    test.afterEach(async ({ page }) => {
        // Clean up: logout after each test
        try {
            if (page.url().includes('inventory.html') || page.url().includes('cart.html') || page.url().includes('inventory-item.html')) {
                await inventoryPage.logout();
                await expect(page).toHaveURL('https://www.saucedemo.com/');
            }
        } catch (error) {
            console.log('Cleanup: Could not logout properly');
        }
    });
});