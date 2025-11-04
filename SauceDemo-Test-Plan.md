# 🛍️ SauceDemo E-Commerce - Comprehensive Test Plan

## 📋 Application Overview

**SauceDemo** is a complete e-commerce application featuring user authentication, product catalog, shopping cart, checkout process, and user account management. This test plan covers all modules and user workflows to ensure comprehensive test coverage.

**Base URL**: https://www.saucedemo.com/

## 👥 Test Users & Credentials

### Valid Users
- **standard_user** / secret_sauce (Standard access)
- **problem_user** / secret_sauce (User with UI problems)
- **performance_glitch_user** / secret_sauce (Slow performance user)
- **error_user** / secret_sauce (User with errors)
- **visual_user** / secret_sauce (Visual differences user)

### Invalid Users
- **locked_out_user** / secret_sauce (Locked out user)

---

## 🎯 Test Modules

### 1. 🔐 Authentication Module

#### 1.1 Login Functionality
**Test File**: `auth-login.spec.ts`

##### 1.1.1 Valid Login Tests
- **Test ID**: AUTH-001
- **Scenario**: Login with standard_user
- **Steps**:
  1. Navigate to https://www.saucedemo.com/
  2. Enter username: "standard_user"
  3. Enter password: "secret_sauce"
  4. Click Login button
- **Expected Results**:
  - User redirected to inventory page
  - Products page displays correctly
  - User menu is accessible

##### 1.1.2 Invalid Credentials Tests
- **Test ID**: AUTH-002
- **Scenario**: Login with invalid username
- **Steps**:
  1. Navigate to login page
  2. Enter username: "invalid_user"
  3. Enter password: "secret_sauce"
  4. Click Login button
- **Expected Results**:
  - Error message displayed: "Epic sadface: Username and password do not match any user in this service"
  - User remains on login page

##### 1.1.3 Locked User Test
- **Test ID**: AUTH-003
- **Scenario**: Login with locked out user
- **Steps**:
  1. Enter username: "locked_out_user"
  2. Enter password: "secret_sauce"
  3. Click Login button
- **Expected Results**:
  - Error message: "Epic sadface: Sorry, this user has been locked out."

##### 1.1.4 Empty Fields Tests
- **Test ID**: AUTH-004
- **Scenario**: Login with empty fields
- **Steps**:
  1. Leave username and password empty
  2. Click Login button
- **Expected Results**:
  - Error message: "Epic sadface: Username is required"

##### 1.1.5 Password Field Security
- **Test ID**: AUTH-005
- **Scenario**: Password field masking
- **Steps**:
  1. Enter password in password field
- **Expected Results**:
  - Password characters are masked/hidden

#### 1.2 Logout Functionality
**Test File**: `auth-logout.spec.ts`

##### 1.2.1 Successful Logout
- **Test ID**: AUTH-006
- **Scenario**: Logout from inventory page
- **Steps**:
  1. Login successfully
  2. Click hamburger menu
  3. Click "Logout" option
- **Expected Results**:
  - User redirected to login page
  - Session cleared
  - Cannot access protected pages without re-login

---

### 2. 📦 Product Inventory Module

#### 2.1 Product Display
**Test File**: `inventory-display.spec.ts`

##### 2.1.1 Product List Loading
- **Test ID**: INV-001
- **Scenario**: Verify all products load correctly
- **Steps**:
  1. Login and navigate to inventory
- **Expected Results**:
  - All 6 products displayed
  - Each product shows: image, name, description, price
  - Add to Cart button present for each product

##### 2.1.2 Product Details
- **Test ID**: INV-002
- **Scenario**: Individual product information accuracy
- **Expected Results**:
  - Sauce Labs Backpack - $29.99
  - Sauce Labs Bike Light - $9.99
  - Sauce Labs Bolt T-Shirt - $15.99
  - Sauce Labs Fleece Jacket - $49.99
  - Sauce Labs Onesie - $7.99
  - Test.allTheThings() T-Shirt (Red) - $15.99

#### 2.2 Product Sorting
**Test File**: `inventory-sorting.spec.ts`

##### 2.2.1 Sort by Name (A to Z)
- **Test ID**: INV-003
- **Scenario**: Sort products alphabetically
- **Steps**:
  1. Select "Name (A to Z)" from sort dropdown
- **Expected Results**:
  - Products sorted alphabetically by name

##### 2.2.2 Sort by Name (Z to A)
- **Test ID**: INV-004
- **Scenario**: Sort products reverse alphabetically
- **Steps**:
  1. Select "Name (Z to A)" from sort dropdown
- **Expected Results**:
  - Products sorted reverse alphabetically

##### 2.2.3 Sort by Price (Low to High)
- **Test ID**: INV-005
- **Scenario**: Sort by ascending price
- **Steps**:
  1. Select "Price (low to high)" from sort dropdown
- **Expected Results**:
  - Products sorted by price: $7.99, $9.99, $15.99, $15.99, $29.99, $49.99

##### 2.2.4 Sort by Price (High to Low)
- **Test ID**: INV-006
- **Scenario**: Sort by descending price
- **Steps**:
  1. Select "Price (high to low)" from sort dropdown
- **Expected Results**:
  - Products sorted by price: $49.99, $29.99, $15.99, $15.99, $9.99, $7.99

#### 2.3 Product Details Page
**Test File**: `product-details.spec.ts`

##### 2.3.1 Product Detail Navigation
- **Test ID**: INV-007
- **Scenario**: Navigate to individual product page
- **Steps**:
  1. Click on product name/image
- **Expected Results**:
  - Product detail page loads
  - Large product image displayed
  - Product description, price shown
  - Add to Cart and Back to Products buttons present

##### 2.3.2 Back to Products Navigation
- **Test ID**: INV-008
- **Scenario**: Return to inventory from product details
- **Steps**:
  1. From product detail page, click "Back to products"
- **Expected Results**:
  - Returns to inventory page
  - Same sorting/filtering maintained

---

### 3. 🛒 Shopping Cart Module

#### 3.1 Add to Cart Functionality
**Test File**: `cart-add-items.spec.ts`

##### 3.1.1 Add Single Product
- **Test ID**: CART-001
- **Scenario**: Add one product to cart
- **Steps**:
  1. Click "Add to cart" for Sauce Labs Backpack
- **Expected Results**:
  - Button changes to "Remove"
  - Cart badge shows "1"
  - Product added to cart

##### 3.1.2 Add Multiple Products
- **Test ID**: CART-002
- **Scenario**: Add multiple different products
- **Steps**:
  1. Add Sauce Labs Backpack
  2. Add Sauce Labs Bike Light
  3. Add Sauce Labs Bolt T-Shirt
- **Expected Results**:
  - Cart badge shows "3"
  - All products added to cart
  - Buttons change to "Remove" for added items

##### 3.1.3 Add All Products
- **Test ID**: CART-003
- **Scenario**: Add all 6 products to cart
- **Steps**:
  1. Add all available products
- **Expected Results**:
  - Cart badge shows "6"
  - All products in cart

#### 3.2 Remove from Cart Functionality
**Test File**: `cart-remove-items.spec.ts`

##### 3.2.1 Remove from Inventory Page
- **Test ID**: CART-004
- **Scenario**: Remove product from inventory page
- **Steps**:
  1. Add product to cart
  2. Click "Remove" button
- **Expected Results**:
  - Button changes back to "Add to cart"
  - Cart badge count decreases
  - Product removed from cart

##### 3.2.2 Remove from Cart Page
- **Test ID**: CART-005
- **Scenario**: Remove product from cart page
- **Steps**:
  1. Add products to cart
  2. Navigate to cart page
  3. Click "Remove" for specific item
- **Expected Results**:
  - Product removed from cart list
  - Total price updated
  - Cart count updated

#### 3.3 Cart Page Functionality
**Test File**: `cart-page.spec.ts`

##### 3.3.1 Cart Page Navigation
- **Test ID**: CART-006
- **Scenario**: Navigate to cart page
- **Steps**:
  1. Click shopping cart icon
- **Expected Results**:
  - Cart page loads showing added items
  - Each item shows: quantity, name, description, price
  - Continue Shopping and Checkout buttons present

##### 3.3.2 Continue Shopping
- **Test ID**: CART-007
- **Scenario**: Continue shopping from cart
- **Steps**:
  1. From cart page, click "Continue Shopping"
- **Expected Results**:
  - Returns to inventory page
  - Cart contents preserved

##### 3.3.3 Empty Cart Display
- **Test ID**: CART-008
- **Scenario**: View empty cart
- **Steps**:
  1. Navigate to cart with no items
- **Expected Results**:
  - Empty cart message or no items shown
  - Checkout button behavior (disabled/hidden)

---

### 4. 💳 Checkout Module

#### 4.1 Checkout Information
**Test File**: `checkout-information.spec.ts`

##### 4.1.1 Valid Checkout Information
- **Test ID**: CHECKOUT-001
- **Scenario**: Enter valid checkout information
- **Steps**:
  1. Add items to cart and proceed to checkout
  2. Enter First Name: "John"
  3. Enter Last Name: "Doe"
  4. Enter Postal Code: "12345"
  5. Click Continue
- **Expected Results**:
  - Proceeds to checkout overview page
  - Information stored correctly

##### 4.1.2 Missing Required Fields
- **Test ID**: CHECKOUT-002
- **Scenario**: Submit with missing first name
- **Steps**:
  1. Leave First Name empty
  2. Fill Last Name and Postal Code
  3. Click Continue
- **Expected Results**:
  - Error message: "Error: First Name is required"

##### 4.1.3 Missing Last Name
- **Test ID**: CHECKOUT-003
- **Scenario**: Submit with missing last name
- **Steps**:
  1. Fill First Name and Postal Code
  2. Leave Last Name empty
  3. Click Continue
- **Expected Results**:
  - Error message: "Error: Last Name is required"

##### 4.1.4 Missing Postal Code
- **Test ID**: CHECKOUT-004
- **Scenario**: Submit with missing postal code
- **Steps**:
  1. Fill First Name and Last Name
  2. Leave Postal Code empty
  3. Click Continue
- **Expected Results**:
  - Error message: "Error: Postal Code is required"

#### 4.2 Checkout Overview
**Test File**: `checkout-overview.spec.ts`

##### 4.2.1 Order Summary Accuracy
- **Test ID**: CHECKOUT-005
- **Scenario**: Verify order summary details
- **Steps**:
  1. Complete checkout information
  2. Review checkout overview page
- **Expected Results**:
  - All cart items listed with correct prices
  - Subtotal calculated correctly
  - Tax calculated and displayed
  - Total amount correct (Subtotal + Tax)
  - Payment and shipping information displayed

##### 4.2.2 Price Calculations
- **Test ID**: CHECKOUT-006
- **Scenario**: Verify price calculations
- **Test Data**:
  - Item Total: Sum of all product prices
  - Tax: 8% of subtotal
  - Total: Item Total + Tax
- **Expected Results**:
  - Mathematical accuracy of all calculations

#### 4.3 Order Completion
**Test File**: `checkout-complete.spec.ts`

##### 4.3.1 Successful Order Completion
- **Test ID**: CHECKOUT-007
- **Scenario**: Complete order successfully
- **Steps**:
  1. Proceed through entire checkout process
  2. Click "Finish" on overview page
- **Expected Results**:
  - Success page displayed
  - "Thank you for your order!" message
  - Order confirmation details
  - Cart cleared (badge shows empty)

##### 4.3.2 Back Home Navigation
- **Test ID**: CHECKOUT-008
- **Scenario**: Return to inventory after order
- **Steps**:
  1. Complete order
  2. Click "Back Home" button
- **Expected Results**:
  - Returns to inventory page
  - Cart is empty
  - Can start new shopping session

---

### 5. 🎛️ Navigation & UI Module

#### 5.1 Header Navigation
**Test File**: `navigation-header.spec.ts`

##### 5.1.1 Hamburger Menu
- **Test ID**: NAV-001
- **Scenario**: Access hamburger menu
- **Steps**:
  1. Click hamburger menu icon (≡)
- **Expected Results**:
  - Side menu opens with options:
    - All Items
    - About
    - Logout
    - Reset App State

##### 5.1.2 About Page Navigation
- **Test ID**: NAV-002
- **Scenario**: Navigate to About page
- **Steps**:
  1. Open hamburger menu
  2. Click "About"
- **Expected Results**:
  - Redirects to Sauce Labs website
  - Opens in same/new tab as configured

##### 5.1.3 Reset App State
- **Test ID**: NAV-003
- **Scenario**: Reset application state
- **Steps**:
  1. Add items to cart
  2. Open hamburger menu
  3. Click "Reset App State"
- **Expected Results**:
  - Cart cleared
  - All "Remove" buttons reset to "Add to cart"
  - Application returns to initial state

#### 5.2 Footer Navigation
**Test File**: `navigation-footer.spec.ts`

##### 5.2.1 Social Media Links
- **Test ID**: NAV-004
- **Scenario**: Verify social media links
- **Steps**:
  1. Check footer social media links
- **Expected Results**:
  - Twitter link functional
  - Facebook link functional
  - LinkedIn link functional
  - Links open in new tab/window

##### 5.2.2 Footer Copyright
- **Test ID**: NAV-005
- **Scenario**: Verify footer information
- **Expected Results**:
  - Copyright notice displayed
  - Terms of Service link (if present)
  - Privacy Policy link (if present)

---

### 6. 🎭 User Experience & Performance Module

#### 6.1 Performance Testing
**Test File**: `performance.spec.ts`

##### 6.1.1 Performance Glitch User
- **Test ID**: PERF-001
- **Scenario**: Test with performance_glitch_user
- **Steps**:
  1. Login with performance_glitch_user
  2. Navigate through application
  3. Measure load times
- **Expected Results**:
  - Pages load slower than standard user
  - Functionality remains intact
  - Performance degradation documented

##### 6.1.2 Page Load Performance
- **Test ID**: PERF-002
- **Scenario**: Measure page load times
- **Steps**:
  1. Measure login page load
  2. Measure inventory page load
  3. Measure cart page load
  4. Measure checkout pages load
- **Expected Results**:
  - All pages load within acceptable time limits
  - Performance metrics captured

#### 6.2 Error Handling
**Test File**: `error-handling.spec.ts`

##### 6.2.1 Error User Testing
- **Test ID**: ERROR-001
- **Scenario**: Test with error_user
- **Steps**:
  1. Login with error_user
  2. Attempt various operations
- **Expected Results**:
  - Document specific errors encountered
  - Verify error messages are user-friendly
  - Confirm error recovery mechanisms

##### 6.2.2 Problem User Testing
- **Test ID**: ERROR-002
- **Scenario**: Test with problem_user
- **Steps**:
  1. Login with problem_user
  2. Navigate through application
- **Expected Results**:
  - Document UI problems encountered
  - Verify core functionality works despite issues

#### 6.3 Visual Testing
**Test File**: `visual-testing.spec.ts`

##### 6.3.1 Visual User Differences
- **Test ID**: VISUAL-001
- **Scenario**: Compare visual_user vs standard_user
- **Steps**:
  1. Take screenshots with standard_user
  2. Take screenshots with visual_user
  3. Compare visual differences
- **Expected Results**:
  - Document visual differences
  - Verify accessibility compliance
  - Confirm readability and usability

---

### 7. 🔄 Integration & E2E Workflows

#### 7.1 Complete Shopping Journey
**Test File**: `e2e-complete-journey.spec.ts`

##### 7.1.1 Happy Path E2E
- **Test ID**: E2E-001
- **Scenario**: Complete shopping experience
- **Steps**:
  1. Login with standard_user
  2. Browse products and sort
  3. Add multiple items to cart
  4. Proceed to checkout
  5. Fill checkout information
  6. Complete order
  7. Logout
- **Expected Results**:
  - Entire flow completes successfully
  - Order confirmed
  - Session properly closed

##### 7.1.2 Multi-User Session Testing
- **Test ID**: E2E-002
- **Scenario**: Test different user types in sequence
- **Steps**:
  1. Test with standard_user
  2. Test with problem_user
  3. Test with performance_glitch_user
- **Expected Results**:
  - Each user type behaves as expected
  - No cross-contamination between sessions

#### 7.2 Edge Cases & Boundary Testing
**Test File**: `edge-cases.spec.ts`

##### 7.2.1 Maximum Cart Items
- **Test ID**: EDGE-001
- **Scenario**: Test cart with all items multiple times (if possible)
- **Expected Results**:
  - System handles maximum cart size gracefully

##### 7.2.2 Rapid Button Clicking
- **Test ID**: EDGE-002
- **Scenario**: Rapidly click Add/Remove buttons
- **Expected Results**:
  - System prevents duplicate additions
  - State remains consistent

##### 7.2.3 Browser Back/Forward Navigation
- **Test ID**: EDGE-003
- **Scenario**: Use browser navigation during checkout
- **Expected Results**:
  - Cart state preserved appropriately
  - No data loss or corruption

---

## 📊 Test Data Management

### Test Data Files Structure:
```
tests/
├── testdata/
│   ├── users.json          # User credentials
│   ├── products.json       # Product data
│   ├── checkout.json       # Checkout test data
│   └── performance.json    # Performance benchmarks
```

### User Test Data (`users.json`):
```json
{
  "standardUser": {
    "username": "standard_user",
    "password": "secret_sauce",
    "description": "Standard user with full access"
  },
  "lockedUser": {
    "username": "locked_out_user", 
    "password": "secret_sauce",
    "description": "Locked out user"
  },
  "problemUser": {
    "username": "problem_user",
    "password": "secret_sauce", 
    "description": "User with UI problems"
  },
  "performanceUser": {
    "username": "performance_glitch_user",
    "password": "secret_sauce",
    "description": "User with performance issues"
  },
  "errorUser": {
    "username": "error_user",
    "password": "secret_sauce",
    "description": "User that encounters errors"
  },
  "visualUser": {
    "username": "visual_user",
    "password": "secret_sauce", 
    "description": "User with visual differences"
  }
}
```

### Product Test Data (`products.json`):
```json
{
  "products": [
    {
      "id": "sauce-labs-backpack",
      "name": "Sauce Labs Backpack",
      "price": 29.99,
      "description": "carry.allTheThings() with the sleek, streamlined Sly Pack..."
    },
    {
      "id": "sauce-labs-bike-light", 
      "name": "Sauce Labs Bike Light",
      "price": 9.99,
      "description": "A red light isn't the desired state in testing but it sure helps..."
    }
  ]
}
```

---

## 🎯 Test Execution Strategy

### Test Prioritization:
1. **P0 - Critical**: Authentication, Core Shopping Flow
2. **P1 - High**: Cart Operations, Checkout Process
3. **P2 - Medium**: Sorting, Navigation, UI Elements
4. **P3 - Low**: Performance, Visual Differences, Edge Cases

### Test Environment:
- **Browser**: Chromium, Firefox, WebKit
- **Viewport**: Desktop (1280x720), Mobile (375x667)
- **Network**: Fast 3G simulation for performance tests

### Execution Schedule:
- **Smoke Tests**: After every deployment
- **Regression Suite**: Weekly
- **Performance Tests**: Monthly
- **Full Suite**: Before major releases

---

## 📈 Success Criteria

### Functional Requirements:
- ✅ All authentication scenarios pass
- ✅ Shopping cart operations work correctly
- ✅ Checkout process completes successfully
- ✅ Navigation functions properly
- ✅ All user types handled appropriately

### Performance Requirements:
- ✅ Pages load within 3 seconds (standard user)
- ✅ Performance degradation documented for glitch user
- ✅ No memory leaks during extended sessions

### Security Requirements:
- ✅ Password fields masked
- ✅ Session management secure
- ✅ No sensitive data in console logs

---

## 🚀 Implementation Notes

### Page Objects Required:
1. **LoginPage** - Authentication functionality
2. **InventoryPage** - Product listing and sorting
3. **ProductDetailPage** - Individual product view
4. **CartPage** - Shopping cart operations
5. **CheckoutInformationPage** - Customer details
6. **CheckoutOverviewPage** - Order summary
7. **CheckoutCompletePage** - Order confirmation
8. **BasePage** - Common functionality

### Utilities Required:
1. **UserManager** - Handle different user types
2. **CartHelper** - Cart operation utilities
3. **PriceCalculator** - Verify price calculations
4. **ScreenshotUtility** - Visual testing support
5. **PerformanceMonitor** - Performance metrics

This comprehensive test plan ensures complete coverage of the SauceDemo application, providing confidence in the quality and reliability of all features and user workflows.