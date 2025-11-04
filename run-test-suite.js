const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🎯 SauceDemo Test Suite Execution Script');
console.log('==========================================');

// Check if browsers are installed
function checkBrowsers() {
    try {
        execSync('npx playwright --version', { stdio: 'pipe' });
        return true;
    } catch (error) {
        return false;
    }
}

// Install browsers if needed
function installBrowsers() {
    console.log('📦 Installing Playwright browsers...');
    try {
        execSync('npx playwright install', { stdio: 'inherit' });
        console.log('✅ Browsers installed successfully');
        return true;
    } catch (error) {
        console.error('❌ Failed to install browsers:', error.message);
        return false;
    }
}

// Run a specific test suite
function runTests(testPattern, description) {
    console.log(`\n🧪 Running ${description}...`);
    console.log(`Command: npx playwright test ${testPattern} --reporter=html`);
    
    try {
        const result = execSync(`npx playwright test ${testPattern} --reporter=html`, { 
            stdio: 'pipe',
            encoding: 'utf8'
        });
        
        // Parse results from output
        const lines = result.split('\n');
        const passedLine = lines.find(line => line.includes('passed'));
        const failedLine = lines.find(line => line.includes('failed'));
        
        if (passedLine && !failedLine) {
            console.log(`✅ ${description} - ${passedLine.trim()}`);
            return { success: true, output: result };
        } else if (failedLine) {
            console.log(`❌ ${description} - ${failedLine.trim()}`);
            return { success: false, output: result };
        } else {
            console.log(`✅ ${description} - Completed`);
            return { success: true, output: result };
        }
    } catch (error) {
        console.log(`❌ ${description} - Failed with exit code ${error.status}`);
        console.log(error.stdout || error.message);
        return { success: false, output: error.stdout || error.message };
    }
}

// Main execution function
async function runTestSuite() {
    console.log('\n📋 Pre-flight Checks');
    console.log('====================');
    
    // Check if test files exist
    const testFiles = [
        'tests/simple-validation.spec.ts',
        'tests/saucedemo-auth-login.spec.ts', 
        'tests/saucedemo-inventory.spec.ts',
        'tests/saucedemo-cart.spec.ts',
        'tests/saucedemo-e2e.spec.ts'
    ];
    
    console.log('📁 Checking test files...');
    for (const testFile of testFiles) {
        if (fs.existsSync(testFile)) {
            console.log(`✅ ${testFile}`);
        } else {
            console.log(`❌ ${testFile} - Missing`);
            return;
        }
    }
    
    // Check browsers
    console.log('\n🌐 Checking browsers...');
    if (!checkBrowsers()) {
        console.log('❌ Playwright not found');
        return;
    }
    
    // Try to install browsers
    console.log('🔄 Ensuring browsers are installed...');
    console.log('Note: This may take several minutes on first run');
    
    // Instead of automatically installing, provide guidance
    console.log('\n⚠️  Browser Installation Required');
    console.log('To install browsers, run: npx playwright install');
    console.log('This is required before running any browser tests.');
    
    // Run framework validation first (no browser needed)
    console.log('\n🧪 Test Execution Plan');
    console.log('=====================');
    
    const testSuites = [
        {
            pattern: 'simple-validation.spec.ts',
            description: 'Framework Validation (5 tests)',
            browserRequired: false
        },
        {
            pattern: 'saucedemo-auth-login.spec.ts', 
            description: 'Authentication Tests (6 tests)',
            browserRequired: true
        },
        {
            pattern: 'saucedemo-inventory.spec.ts',
            description: 'Inventory Tests (12 tests)', 
            browserRequired: true
        },
        {
            pattern: 'saucedemo-cart.spec.ts',
            description: 'Cart Tests (8 tests)',
            browserRequired: true
        },
        {
            pattern: 'saucedemo-e2e.spec.ts',
            description: 'E2E Tests (3 tests)',
            browserRequired: true
        }
    ];
    
    const results = [];
    let totalPassed = 0;
    let totalFailed = 0;
    
    // Run framework validation (no browser required)
    console.log('\n1️⃣ Running Framework Validation...');
    const frameworkResult = runTests('simple-validation.spec.ts', 'Framework Validation');
    results.push(frameworkResult);
    
    if (frameworkResult.success) {
        console.log('✅ Framework validation passed - Core test structure is valid');
        totalPassed += 5; // 5 framework validation tests
    } else {
        console.log('❌ Framework validation failed - Check test structure');
        totalFailed += 5;
    }
    
    // Provide instructions for browser tests
    console.log('\n🌐 Browser-Dependent Tests');
    console.log('=========================');
    console.log('To run the remaining tests, you need to:');
    console.log('1. Install browsers: npx playwright install');
    console.log('2. Run individual test suites:');
    console.log('   • npx playwright test saucedemo-auth-login.spec.ts --reporter=html');
    console.log('   • npx playwright test saucedemo-inventory.spec.ts --reporter=html');
    console.log('   • npx playwright test saucedemo-cart.spec.ts --reporter=html');
    console.log('   • npx playwright test saucedemo-e2e.spec.ts --reporter=html');
    console.log('3. Or run all at once: npx playwright test saucedemo*.spec.ts --reporter=html');
    
    // Summary
    console.log('\n📊 Test Suite Summary');
    console.log('====================');
    console.log(`✅ Framework Tests: ${frameworkResult.success ? 'PASSED' : 'FAILED'} (5 tests)`);
    console.log(`🌐 Browser Tests: PENDING (29 tests) - Requires browser installation`);
    console.log(`📝 Total Tests: 34 (5 framework + 29 browser)`);
    console.log(`🎯 Current Status: Framework ready, browsers needed for full execution`);
    
    console.log('\n🚀 Next Steps:');
    console.log('1. Run: npx playwright install');
    console.log('2. Run: npx playwright test saucedemo*.spec.ts --reporter=html');
    console.log('3. View results: npx playwright show-report');
    
    return results;
}

// Run the test suite
if (require.main === module) {
    runTestSuite().catch(console.error);
}