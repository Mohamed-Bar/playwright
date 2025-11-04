import { test, expect } from '@playwright/test';
import LoginPage from './pages/loginpage/loginpage';
import InventoryPage from './pages/inventorypage/inventorypage';
import CartPage from './pages/cartpage/cartpage';
import * as users from './testdata/users.json';

test.describe('SauceDemo - End-to-End Shopping Journey', () => {
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;
    let cartPage: CartPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        cartPage = new CartPage(page);
    });

    test('E2E-001: Complete Happy Path Shopping Journey', async ({ page }) => {
        // Step 1: Navigate to SauceDemo
        await page.goto('https://www.saucedemo.com/');
        await loginPage.takeScreenshot('./tests/screenshots/e2e-001-01-login-page.png');
        
        // Step 2: Login with standard user
        await loginPage.enterusername(users.standardUser.username);
        await loginPage.enterpassword(users.standardUser.password);
        await loginPage.clickonloginbutton();
        
        // Verify successful login
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
        await inventoryPage.waitForInventoryToLoad();
        await inventoryPage.takeInventoryScreenshot('e2e-001-02-inventory-loaded.png');
        
        // Step 3: Browse and sort products
        await inventoryPage.sortProductsBy('lohi'); // Sort by price low to high
        await inventoryPage.verifyPriceSortLowToHigh();
        await inventoryPage.takeInventoryScreenshot('e2e-001-03-products-sorted.png');
        
        // Step 4: Add multiple products to cart
        const selectedProducts = [
            'Sauce Labs Onesie',        // Cheapest item $7.99
            'Sauce Labs Bike Light',    // $9.99
            'Sauce Labs Bolt T-Shirt'   // $15.99
        ];
        
        await inventoryPage.addMultipleProductsToCart(selectedProducts);
        
        // Verify products added to cart
        for (const product of selectedProducts) {
            await inventoryPage.verifyProductInCart(product);
        }
        
        // Verify cart badge shows 3 items
        const cartCount = await inventoryPage.getCartItemCount();
        expect(cartCount).toBe(3);
        await inventoryPage.takeInventoryScreenshot('e2e-001-04-products-added.png');
        
        // Step 5: Navigate to cart
        await inventoryPage.clickShoppingCart();
        await cartPage.waitForCartToLoad();
        
        // Verify all selected products are in cart
        await cartPage.verifyCartContainsProducts(selectedProducts);
        
        // Verify total price calculation
        const expectedTotal = 7.99 + 9.99 + 15.99; // $33.97
        const actualTotal = await cartPage.calculateCartTotal();
        expect(actualTotal).toBeCloseTo(expectedTotal, 2);
        await cartPage.takeCartScreenshot('e2e-001-05-cart-review.png');
        
        // Step 6: Proceed to checkout
        await cartPage.proceedToCheckout();
        
        // Verify we're on checkout information page
        await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');
        await expect(page.locator('#first-name')).toBeVisible();
        await cartPage.takeScreenshot('./tests/screenshots/e2e-001-06-checkout-info.png');
        
        // Step 7: Fill checkout information
        await page.locator('#first-name').fill('John');
        await page.locator('#last-name').fill('Doe');
        await page.locator('#postal-code').fill('12345');
        await page.locator('#continue').click();
        
        // Verify we're on checkout overview page
        await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html');
        await cartPage.takeScreenshot('./tests/screenshots/e2e-001-07-checkout-overview.png');
        
        // Step 8: Verify order summary
        // Verify all products are listed in the summary
        for (const product of selectedProducts) {
            await expect(page.locator('.cart_item').filter({ has: page.locator('.inventory_item_name', { hasText: product }) })).toBeVisible();
        }
        
        // Verify price calculations
        await expect(page.locator('.summary_subtotal_label')).toBeVisible();
        await expect(page.locator('.summary_tax_label')).toBeVisible();
        await expect(page.locator('.summary_total_label')).toBeVisible();
        
        // Step 9: Complete the order
        await page.locator('#finish').click();
        
        // Verify order completion page
        await expect(page).toHaveURL('https://www.saucedemo.com/checkout-complete.html');
        await expect(page.locator('.complete-header')).toBeVisible();
        await expect(page.locator('.complete-header')).toContainText('Thank you for your order!');
        await cartPage.takeScreenshot('./tests/screenshots/e2e-001-08-order-complete.png');
        
        // Step 10: Return home and verify cart is cleared
        await page.locator('#back-to-products').click();
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
        
        // Verify cart is empty (no badge should be visible)
        const finalCartCount = await inventoryPage.getCartItemCount();
        expect(finalCartCount).toBe(0);
        await inventoryPage.takeInventoryScreenshot('e2e-001-09-back-to-inventory.png');
        
        // Step 11: Logout
        await inventoryPage.logout();
        await expect(page).toHaveURL('https://www.saucedemo.com/');
        await loginPage.takeScreenshot('./tests/screenshots/e2e-001-10-logout-complete.png');
        
        console.log('✅ Complete E2E shopping journey completed successfully!');
    });

    test('E2E-002: Problem User Journey', async ({ page }) => {
        // Test the complete journey with problem_user to document UI issues
        await page.goto('https://www.saucedemo.com/');
        
        // Login with problem user
        await loginPage.enterusername(users.problemUser.username);
        await loginPage.enterpassword(users.problemUser.password);
        await loginPage.clickonloginbutton();
        
        // Verify login successful
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
        await inventoryPage.waitForInventoryToLoad();
        await inventoryPage.takeInventoryScreenshot('e2e-002-01-problem-user-inventory.png');
        
        // Try to add products (may have UI issues)
        try {
            await inventoryPage.addProductToCart('Sauce Labs Backpack');
            await inventoryPage.takeInventoryScreenshot('e2e-002-02-problem-user-product-added.png');
            
            // Navigate to cart
            await inventoryPage.clickShoppingCart();
            await cartPage.takeCartScreenshot('e2e-002-03-problem-user-cart.png');
            
        } catch (error) {
            console.log('Expected: Problem user encountered UI issues:', (error as Error).message);
            await inventoryPage.takeInventoryScreenshot('e2e-002-error-problem-user-ui-issue.png');
        }
        
        // Logout
        await inventoryPage.logout();
        await expect(page).toHaveURL('https://www.saucedemo.com/');
        
        console.log('✅ Problem user journey documented');
    });

    test('E2E-003: Performance User Journey with Timing', async ({ page }) => {
        const startTime = Date.now();
        
        // Navigate to SauceDemo
        await page.goto('https://www.saucedemo.com/');
        
        // Login with performance glitch user
        await loginPage.enterusername(users.performanceUser.username);
        await loginPage.enterpassword(users.performanceUser.password);
        
        const loginStartTime = Date.now();
        await loginPage.clickonloginbutton();
        
        // Wait for inventory to load
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
        await inventoryPage.waitForInventoryToLoad();
        const inventoryLoadTime = Date.now();
        
        console.log(`Performance user login took: ${inventoryLoadTime - loginStartTime}ms`);
        
        // Add products with timing
        const addProductStartTime = Date.now();
        await inventoryPage.addProductToCart('Sauce Labs Backpack');
        const addProductEndTime = Date.now();
        
        console.log(`Adding product took: ${addProductEndTime - addProductStartTime}ms`);
        
        // Navigate to cart with timing
        const cartNavStartTime = Date.now();
        await inventoryPage.clickShoppingCart();
        await cartPage.waitForCartToLoad();
        const cartNavEndTime = Date.now();
        
        console.log(`Cart navigation took: ${cartNavEndTime - cartNavStartTime}ms`);
        
        const totalTime = cartNavEndTime - startTime;
        console.log(`Total performance user journey took: ${totalTime}ms`);
        
        // Verify performance degradation (should be slower than normal)
        expect(totalTime).toBeGreaterThan(3000); // Should take more than 3 seconds
        
        await cartPage.takeCartScreenshot('e2e-003-performance-user-complete.png');
        
        // Logout
        await cartPage.continueShopping();
        await inventoryPage.logout();
        
        console.log('✅ Performance user journey completed with timing metrics');
    });

    test.afterEach(async ({ page }) => {
        // Ensure clean logout state
        try {
            if (!page.url().includes('saucedemo.com/') || page.url().includes('inventory') || page.url().includes('cart') || page.url().includes('checkout')) {
                await page.goto('https://www.saucedemo.com/');
            }
        } catch (error) {
            console.log('Cleanup: Navigation cleanup completed');
        }
    });
});