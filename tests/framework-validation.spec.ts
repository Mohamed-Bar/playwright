import { test, expect } from '@playwright/test';

test.describe('Framework Validation Tests', () => {
    
    test('Test data structure validation', async () => {
        // Import and validate test data files
        const users = require('./testdata/users.json');
        const products = require('./testdata/products.json');
        
        // Validate users data
        expect(users.standardUser).toBeDefined();
        expect(users.standardUser.username).toBe('standard_user');
        expect(users.standardUser.password).toBe('secret_sauce');
        
        expect(users.lockedUser).toBeDefined();
        expect(users.lockedUser.username).toBe('locked_out_user');
        expect(users.lockedUser.expectedError).toContain('locked out');
        
        expect(users.invalidUser).toBeDefined();
        expect(users.invalidUser.expectedError).toContain('do not match');
        
        // Validate products data
        expect(products.products).toBeDefined();
        expect(products.products.length).toBe(6);
        
        // Validate specific products
        const backpack = products.products.find(p => p.name === 'Sauce Labs Backpack');
        expect(backpack).toBeDefined();
        expect(backpack?.price).toBe(29.99);
        expect(backpack?.addToCartId).toBe('add-to-cart-sauce-labs-backpack');
        
        const onesie = products.products.find(p => p.name === 'Sauce Labs Onesie');
        expect(onesie).toBeDefined();
        expect(onesie?.price).toBe(7.99); // Cheapest item
        
        console.log('✅ All test data structures are valid');
    });
    
    test('Page Object Model validation', async () => {
        // Test that page object classes can be instantiated
        // Mock page for testing
        const mockPage = {
            locator: (selector: string) => ({
                fill: async (text: string) => {},
                click: async () => {},
                textContent: async () => 'mock text',
                isVisible: async () => true,
                waitFor: async () => {}
            }),
            goto: async (url: string) => {},
            screenshot: async (options: any) => {},
            waitForTimeout: async (ms: number) => {}
        } as any;
        
        // Test BasePage
        const BasePage = (await import('./pages/basepage')).default;
        const basePage = new BasePage(mockPage);
        expect(basePage).toBeDefined();
        
        // Test LoginPage
        const LoginPage = (await import('./pages/loginpage/loginpage')).default;
        const loginPage = new LoginPage(mockPage);
        expect(loginPage).toBeDefined();
        
        // Test InventoryPage
        const InventoryPage = (await import('./pages/inventorypage/inventorypage')).default;
        const inventoryPage = new InventoryPage(mockPage);
        expect(inventoryPage).toBeDefined();
        
        // Test CartPage
        const CartPage = (await import('./pages/cartpage/cartpage')).default;
        const cartPage = new CartPage(mockPage);
        expect(cartPage).toBeDefined();
        
        console.log('✅ All Page Object Models can be instantiated');
    });
    
    test('Price calculation validation', async () => {
        // Test price calculations used in tests
        const products = require('./testdata/products.json');
        
        // Test total for multiple products (used in E2E test)
        const selectedProducts = ['Sauce Labs Onesie', 'Sauce Labs Bike Light', 'Sauce Labs Bolt T-Shirt'];
        let totalPrice = 0;
        
        selectedProducts.forEach(productName => {
            const product = products.products.find(p => p.name === productName);
            if (product) {
                totalPrice += product.price;
            }
        });
        
        expect(totalPrice).toBe(33.97); // 7.99 + 9.99 + 15.99
        
        // Test tax calculation
        const taxRate = products.taxRate;
        const taxAmount = totalPrice * taxRate;
        const totalWithTax = totalPrice + taxAmount;
        
        expect(taxRate).toBe(0.08);
        expect(Math.round(taxAmount * 100) / 100).toBe(2.72); // 8% tax
        expect(Math.round(totalWithTax * 100) / 100).toBe(36.69);
        
        console.log('✅ Price calculations are correct');
    });
    
    test('Sort validation logic', async () => {
        // Test sorting logic that would be used in browser tests
        const products = require('./testdata/products.json');
        
        const productNames = products.products.map(p => p.name);
        const productPrices = products.products.map(p => p.price);
        
        // Test alphabetical sort A-Z
        const sortedAZ = [...productNames].sort();
        expect(sortedAZ[0]).toBe('Sauce Labs Backpack');
        expect(sortedAZ[sortedAZ.length - 1]).toBe('Test.allTheThings() T-Shirt (Red)');
        
        // Test alphabetical sort Z-A
        const sortedZA = [...productNames].sort().reverse();
        expect(sortedZA[0]).toBe('Test.allTheThings() T-Shirt (Red)');
        expect(sortedZA[sortedZA.length - 1]).toBe('Sauce Labs Backpack');
        
        // Test price sort low to high
        const sortedPriceLowHigh = [...productPrices].sort((a, b) => a - b);
        expect(sortedPriceLowHigh).toEqual(products.expectedSortedPrices.lowToHigh);
        
        // Test price sort high to low  
        const sortedPriceHighLow = [...productPrices].sort((a, b) => b - a);
        expect(sortedPriceHighLow).toEqual(products.expectedSortedPrices.highToLow);
        
        console.log('✅ Sorting logic validation passed');
    });
    
    test('URL and selector validation', async () => {
        // Validate URLs and selectors used in tests
        const baseUrl = 'https://www.saucedemo.com';
        const inventoryUrl = `${baseUrl}/inventory.html`;
        const cartUrl = `${baseUrl}/cart.html`;
        const checkoutStep1Url = `${baseUrl}/checkout-step-one.html`;
        const checkoutStep2Url = `${baseUrl}/checkout-step-two.html`;
        const checkoutCompleteUrl = `${baseUrl}/checkout-complete.html`;
        
        // Validate URL patterns
        expect(inventoryUrl).toBe('https://www.saucedemo.com/inventory.html');
        expect(cartUrl).toBe('https://www.saucedemo.com/cart.html');
        expect(checkoutStep1Url).toBe('https://www.saucedemo.com/checkout-step-one.html');
        expect(checkoutStep2Url).toBe('https://www.saucedemo.com/checkout-step-two.html');
        expect(checkoutCompleteUrl).toBe('https://www.saucedemo.com/checkout-complete.html');
        
        // Validate selector formats (these should be consistent)
        const selectors = {
            loginButton: '#login-button',
            usernameField: '#user-name',
            passwordField: '#password',
            errorMessage: '[data-test="error"]',
            appLogo: '.app_logo',
            shoppingCartLink: '.shopping_cart_link',
            shoppingCartBadge: '.shopping_cart_badge',
            hamburgerMenu: '#react-burger-menu-btn',
            inventoryList: '.inventory_list',
            inventoryItems: '.inventory_item'
        };
        
        // Validate all selectors are strings and non-empty
        Object.entries(selectors).forEach(([key, selector]) => {
            expect(typeof selector).toBe('string');
            expect(selector.length).toBeGreaterThan(0);
            expect(selector).toMatch(/^[#.[].*$/); // Should start with #, ., or [
        });
        
        console.log('✅ URLs and selectors are valid');
    });
});