import { test, expect } from '@playwright/test';
import LoginPage from './pages/loginpage/loginpage';
import InventoryPage from './pages/inventorypage/inventorypage';
import CartPage from './pages/cartpage/cartpage';
import * as users from './testdata/users.json';

test.describe('SauceDemo - Shopping Cart Module', () => {
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;
    let cartPage: CartPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        cartPage = new CartPage(page);
        
        // Login with standard user before each test
        await page.goto('https://www.saucedemo.com/');
        await loginPage.enterusername(users.standardUser.username);
        await loginPage.enterpassword(users.standardUser.password);
        await loginPage.clickonloginbutton();
        
        // Verify we're on the inventory page
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
        await inventoryPage.waitForInventoryToLoad();
    });

    test('CART-001: Add Single Product to Cart and View', async ({ page }) => {
        // Add product to cart from inventory
        await inventoryPage.addProductToCart('Sauce Labs Backpack');
        
        // Navigate to cart
        await inventoryPage.clickShoppingCart();
        await cartPage.waitForCartToLoad();
        
        // Verify product is in cart
        await cartPage.verifyProductInCart('Sauce Labs Backpack');
        
        // Verify cart count
        const cartCount = await cartPage.getCartItemCount();
        expect(cartCount).toBe(1);
        
        // Verify product details
        const productInfo = await cartPage.getCartProductInfo('Sauce Labs Backpack');
        expect(productInfo.name).toBe('Sauce Labs Backpack');
        expect(productInfo.price).toBe(29.99);
        expect(productInfo.quantity).toBe(1);
        
        // Take screenshot
        await cartPage.takeCartScreenshot('cart-001-single-product.png');
    });

    test('CART-002: Add Multiple Products to Cart', async ({ page }) => {
        const productsToAdd = [
            'Sauce Labs Backpack',
            'Sauce Labs Bike Light',
            'Sauce Labs Bolt T-Shirt'
        ];
        
        // Add multiple products from inventory
        for (const product of productsToAdd) {
            await inventoryPage.addProductToCart(product);
        }
        
        // Navigate to cart
        await inventoryPage.clickShoppingCart();
        await cartPage.waitForCartToLoad();
        
        // Verify all products are in cart
        await cartPage.verifyCartContainsProducts(productsToAdd);
        
        // Verify cart count
        const cartCount = await cartPage.getCartItemCount();
        expect(cartCount).toBe(3);
        
        // Verify total price calculation
        const expectedTotal = 29.99 + 9.99 + 15.99; // Backpack + Bike Light + T-Shirt
        const actualTotal = await cartPage.calculateCartTotal();
        expect(actualTotal).toBeCloseTo(expectedTotal, 2);
        
        // Take screenshot
        await cartPage.takeCartScreenshot('cart-002-multiple-products.png');
    });

    test('CART-003: Remove Single Product from Cart', async ({ page }) => {
        // Add products to cart
        await inventoryPage.addMultipleProductsToCart([
            'Sauce Labs Backpack',
            'Sauce Labs Bike Light'
        ]);
        
        // Navigate to cart
        await inventoryPage.clickShoppingCart();
        await cartPage.waitForCartToLoad();
        
        // Verify initial state
        await cartPage.verifyCartContainsProducts(['Sauce Labs Backpack', 'Sauce Labs Bike Light']);
        
        // Remove one product
        await cartPage.removeProductFromCart('Sauce Labs Backpack');
        
        // Verify product is removed
        await cartPage.verifyProductNotInCart('Sauce Labs Backpack');
        await cartPage.verifyProductInCart('Sauce Labs Bike Light');
        
        // Verify cart count updated
        const cartCount = await cartPage.getCartItemCount();
        expect(cartCount).toBe(1);
        
        // Take screenshot
        await cartPage.takeCartScreenshot('cart-003-remove-product.png');
    });

    test('CART-004: Remove All Products from Cart', async ({ page }) => {
        // Add multiple products
        await inventoryPage.addMultipleProductsToCart([
            'Sauce Labs Backpack',
            'Sauce Labs Bike Light',
            'Sauce Labs Bolt T-Shirt'
        ]);
        
        // Navigate to cart
        await inventoryPage.clickShoppingCart();
        await cartPage.waitForCartToLoad();
        
        // Remove all products
        await cartPage.removeAllProductsFromCart();
        
        // Verify cart is empty
        await cartPage.verifyCartIsEmpty();
        
        // Take screenshot
        await cartPage.takeCartScreenshot('cart-004-empty-cart.png');
    });

    test('CART-005: Continue Shopping from Cart', async ({ page }) => {
        // Add a product and go to cart
        await inventoryPage.addProductToCart('Sauce Labs Backpack');
        await inventoryPage.clickShoppingCart();
        await cartPage.waitForCartToLoad();
        
        // Continue shopping
        await cartPage.continueShopping();
        
        // Verify we're back on inventory page
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
        await inventoryPage.waitForInventoryToLoad();
        
        // Verify cart still contains the product
        const cartCount = await inventoryPage.getCartItemCount();
        expect(cartCount).toBe(1);
        
        // Take screenshot
        await inventoryPage.takeInventoryScreenshot('cart-005-continue-shopping.png');
    });

    test('CART-006: Proceed to Checkout', async ({ page }) => {
        // Add products to cart
        await inventoryPage.addMultipleProductsToCart([
            'Sauce Labs Backpack',
            'Sauce Labs Bike Light'
        ]);
        
        // Navigate to cart
        await inventoryPage.clickShoppingCart();
        await cartPage.waitForCartToLoad();
        
        // Proceed to checkout
        await cartPage.proceedToCheckout();
        
        // Verify we're on checkout information page
        await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');
        
        // Verify checkout form elements are present
        await expect(page.locator('#first-name')).toBeVisible();
        await expect(page.locator('#last-name')).toBeVisible();
        await expect(page.locator('#postal-code')).toBeVisible();
        await expect(page.locator('#continue')).toBeVisible();
        
        // Take screenshot
        await cartPage.takeScreenshot('./tests/screenshots/cart-006-checkout-page.png');
    });

    test('CART-007: Empty Cart Navigation', async ({ page }) => {
        // Navigate to cart without adding products
        await inventoryPage.clickShoppingCart();
        await cartPage.waitForCartToLoad();
        
        // Verify cart is empty
        await cartPage.verifyCartIsEmpty();
        
        // Verify checkout button behavior with empty cart
        // (SauceDemo allows checkout even with empty cart, but we'll document this)
        const checkoutButton = page.locator('#checkout');
        await expect(checkoutButton).toBeVisible();
        
        // Continue shopping from empty cart
        await cartPage.continueShopping();
        
        // Verify we're back on inventory
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
        
        // Take screenshot
        await inventoryPage.takeInventoryScreenshot('cart-007-empty-cart-navigation.png');
    });

    test('CART-008: Cart Persistence Across Navigation', async ({ page }) => {
        // Add products to cart
        await inventoryPage.addMultipleProductsToCart([
            'Sauce Labs Backpack',
            'Sauce Labs Fleece Jacket'
        ]);
        
        // Navigate to cart
        await inventoryPage.clickShoppingCart();
        await cartPage.waitForCartToLoad();
        
        // Continue shopping
        await cartPage.continueShopping();
        
        // Add another product
        await inventoryPage.addProductToCart('Sauce Labs Bike Light');
        
        // Go back to cart
        await inventoryPage.clickShoppingCart();
        await cartPage.waitForCartToLoad();
        
        // Verify all 3 products are in cart
        await cartPage.verifyCartContainsProducts([
            'Sauce Labs Backpack',
            'Sauce Labs Fleece Jacket',
            'Sauce Labs Bike Light'
        ]);
        
        // Verify cart count
        const cartCount = await cartPage.getCartItemCount();
        expect(cartCount).toBe(3);
        
        // Take screenshot
        await cartPage.takeCartScreenshot('cart-008-cart-persistence.png');
    });

    test.afterEach(async ({ page }) => {
        // Clean up: logout after each test
        try {
            if (page.url().includes('inventory.html') || page.url().includes('cart.html')) {
                await inventoryPage.logout();
                await expect(page).toHaveURL('https://www.saucedemo.com/');
            }
        } catch (error) {
            console.log('Cleanup: Could not logout properly');
        }
    });
});