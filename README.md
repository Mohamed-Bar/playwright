# Playwright Automation Test Suite (Playwright Tests + Allure + Docker+GitHub Actions)

A comprehensive end-to-end and API test automation framework using Playwright with Page Object Model (POM) architecture, Allure reporting, and Docker support.

## 📋 Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running Tests](#running-tests)
- [Docker Setup](#docker-setup)
- [Allure Reports](#allure-reports)
- [CI/CD Integration](#cicd-integration)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## 🎯 Overview

This project provides:
- **E2E Tests**: Web application testing using Playwright with POM design pattern
- **API Tests**: REST API testing with request/response validation
- **Allure Reporting**: Beautiful test reports with artifacts and timings
- **Docker Support**: Containerized test execution for consistent CI/CD pipelines
- **Jenkins Integration**: Automated job creation and execution via Script Console

**Test Coverage**:
- Login page interactions
- Product page operations
- Shopping cart functionality
- API CRUD operations (GET, POST, PUT, PATCH, DELETE)
- Dialog handling and frame navigation

## 📁 Project Structure

```
playwright/
├── tests/
│   ├── pages/
│   │   ├── basepage.ts              # Base class for all page objects
│   │   ├── loginpage/
│   │   │   └── loginpage.ts         # Login page object
│   │   └── productpage/
│   │       └── productpage.ts       # Product page object
│   ├── pom.spec.ts                  # E2E test scenarios
│   ├── actions.spec.ts              # UI actions and interactions
│   ├── api.spec.ts                  # API test scenarios
│   └── testapi.spec.ts              # Additional API tests
├── test-results/                    # Test execution artifacts
├── allure-results/                  # Allure report data
├── allure-report/                   # Generated Allure reports
├── Dockerfile                       # Docker image definition
├── docker-compose.yml               # Docker Compose configuration
├── playwright.config.ts             # Playwright configuration
├── package.json                     # Dependencies and scripts
└── README.md                        # This file
```

## 🔧 Prerequisites

- **Node.js** 18+ and npm
  ```bash
  node --version  # Verify Node
  npm --version   # Verify npm
  ```
- **Java** JDK 11 or 17 (for Allure server)
  - Set `JAVA_HOME` environment variable to JDK root directory
  - Verify: `java --version`
- **Docker** (optional, for containerized runs)
  - Download: [Docker Desktop](https://www.docker.com/products/docker-desktop)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd playwright
   ```

2. **Install dependencies**
   ```bash
   npm ci
   ```

3. **Install Playwright browsers**
   ```bash
   npx playwright install --with-deps
   ```

4. **Verify installation**
   ```bash
   npm run test --version
   ```

## ▶️ Running Tests

### Run all tests
```bash
npm test
```

### Run specific test file
```bash
npx playwright test tests/pom.spec.ts
```

### Run tests by tag
```bash
npx playwright test -g "E2E"          # Run E2E tests
npx playwright test -g "smoke"        # Run smoke tests
npx playwright test -g "api"          # Run API tests
```

### Run with headed browser (see browser UI)
```bash
npx playwright test --headed
```

### Run with debug mode
```bash
npx playwright test -g "E2E" --debug
```

### Run single test
```bash
npx playwright test tests/pom.spec.ts:24  # Run test at line 24
```

### Available npm scripts
```bash
npm run script:to:run              # Run Playwright tests
npm run clean:reports             # Clear previous reports
npm run gen:reports               # Generate Allure report
npm run open:reports              # Open Allure report in browser
npm run test:headed               # Run tests in headed mode
npm test                           # Full pipeline: clean → test → gen report → open
```

## 🐳 Docker Setup

### Build Docker image
```bash
docker build -t playwright-tests .
```

### Run tests in Docker (PowerShell)
```bash
docker run --rm -v ${PWD}:/projectHome -w /projectHome playwright-tests
```

### Run tests in Docker (CMD)
```cmd
docker run --rm -v %cd%:/projectHome -w /projectHome playwright-tests
```

### Run specific test suite in Docker
```bash
docker run --rm -v ${PWD}:/projectHome -w /projectHome `
  -e COMMAND_TO_RUN_TESTS="npx playwright test pom" `
  playwright-tests
```

### Using Docker Compose
```bash
# Build and run
docker compose up --build

# Run detached
docker compose up --build -d

# Follow logs
docker compose logs -f playwright-tests

# Stop and cleanup
docker compose down --rmi local --volumes
```

### Clear Docker cache
```bash
docker builder prune --all --force
docker build --no-cache -t playwright-tests .
```

## 📊 Allure Reports

### Generate report
```bash
npx allure generate ./allure-results --clean -o ./allure-report
```

### View report
```bash
npx allure open ./allure-report
```

### Report features
- Test execution timeline
- Pass/fail statistics
- Test artifacts (screenshots, videos, traces)
- Response time metrics
- Test categorization by tags

## 🔄 CI/CD Integration

### GitHub Actions
Create `.github/workflows/playwright.yml`:
```yaml
name: Playwright Tests
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 9 * * *'  # Daily at 9 AM

jobs:
  playwright-test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm test
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: allure-report/
```

### Jenkins Script Console
Create Pipeline job via Script Console:
```groovy
import jenkins.model.*
import org.jenkinsci.plugins.workflow.job.WorkflowJob
import org.jenkinsci.plugins.workflow.cps.CpsFlowDefinition

def j = Jenkins.instance
def jobName = "playwright-tests"
def job = j.createProject(WorkflowJob, jobName)
def pipeline = """
pipeline {
  agent any
  stages {
    stage('Checkout') { steps { checkout scm } }
    stage('Build') { steps { sh 'docker build -t playwright-tests .' } }
    stage('Test') { steps { sh 'docker run --rm -v \\$WORKSPACE:/projectHome -w /projectHome playwright-tests' } }
  }
  post {
    always { 
      archiveArtifacts artifacts: 'allure-report/**', allowEmptyArchive: true
    }
  }
}
"""
job.definition = new CpsFlowDefinition(pipeline, true)
job.save()
println("Created job '${jobName}'")
```

## 🐛 Troubleshooting

### Issue: Test timeout on `page.goto()`
**Solution**: 
- Verify URL is reachable: open in browser
- Increase timeout:
  ```typescript
  await page.goto(url, { timeout: 60000 });
  ```
- Set test timeout:
  ```typescript
  test('name', async () => { ... }, 90000);
  ```

### Issue: Playwright browser executable not found
**Solution**:
- Reinstall browsers:
  ```bash
  npx playwright install --with-deps
  ```
- Rebuild Docker image:
  ```bash
  docker build --no-cache -t playwright-tests .
  ```

### Issue: JAVA_HOME not recognized
**Solution** (Windows PowerShell as Admin):
```powershell
setx /M JAVA_HOME "C:\Program Files\Eclipse Adoptium\jdk-11.0.x"
$env:Path += ";%JAVA_HOME%\bin"
```
- Restart terminal and verify:
  ```bash
  echo $env:JAVA_HOME
  java --version
  ```

### Issue: Docker image mismatch with Playwright version
**Solution**:
- Check package.json @playwright/test version
- Update Dockerfile FROM tag to match:
  ```dockerfile
  FROM mcr.microsoft.com/playwright:v1.55.1-noble
  ```

### Issue: npm script with spaces not recognized
**Solution**: Use colons in script names:
```json
"clean:reports": "rimraf allure-report allure-results",
"gen:reports": "allure generate allure-results --clean",
"open:reports": "allure open allure-report"
```

## 📝 Test Writing Examples

### E2E Test (Page Object Model)
```typescript
import { test, expect } from '@playwright/test';
import LoginPage from './pages/loginpage/loginpage';

test('E2E@smoke', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await page.goto('https://www.saucedemo.com/');
  await loginPage.enterusername('standard_user');
  await loginPage.enterpassword('secret_sauce');
  await loginPage.clickonloginbutton();
  await expect(page.locator('.app_logo')).toBeVisible();
});
```

### API Test
```typescript
test('POST API', async ({ request }) => {
  const payload = { name: "Test Item", data: { foo: "bar" } };
  const response = await request.post('https://api.example.com/objects', { data: payload });
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.name).toBe("Test Item");
});
```

### Best Practices
- Use Page Object Model for UI tests
- Keep tests independent and repeatable
- Use descriptive test names with tags (@smoke, @regression, etc.)
- Clean up resources in afterEach hooks
- Use fixtures for common setup/teardown

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Add tests for your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📄 License

This project is licensed under the ISC License — see LICENSE file for details.

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review test files for usage examples

## 📚 Resources

- [Playwright Documentation](https://playwright.dev)
- [Allure Report](https://docs.qameta.io/allure/)
- [Docker Documentation](https://docs.docker.com)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)

---

**Happy Testing! 🎭**
