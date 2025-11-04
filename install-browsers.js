// Browser installation script
const { execSync } = require('child_process');

try {
    console.log('Installing Playwright browsers...');
    execSync('npx playwright install', { stdio: 'inherit' });
    console.log('✅ Browsers installed successfully!');
} catch (error) {
    console.error('❌ Error installing browsers:', error.message);
    process.exit(1);
}