# Playwright Tests + Allure + Docker+GitHub Actions 

Short repo overview
- Playwright-based test suite for web and API automation.
- Allure report generation for test artifacts.
- Dockerfile and docker-compose included to run tests reproducibly in CI or locally.

Contents
- tests/ — Playwright test files (specs)
- tests/pages/ — Page Object Model classes
- Dockerfile — container image to run tests
- docker-compose.yml — optional compose for local runs
- allure-results / allure-report — test artifacts / generated reports
- package.json — test and report scripts

Prerequisites
- Node 18+ and npm
  - Verify: `node --version && npm --version`
- Playwright installed in project devDeps (run `npm ci`)
- Allure CLI (use npx if installed as dev Dependency)
- Docker (optional) — for container runs
- Java (for Allure server) — set `JAVA_HOME` to JDK root (recommended JDK 11 or 17)

Quick setup (local)
1. Install dependencies
   npm ci

2. Install Playwright browsers (ensure matching version)
   npx playwright install --with-deps

3. Run full test suite
   npx playwright test

4. Run a specific test or group
   npx playwright test tests/pom.spec.ts
   npx playwright test -g "E2E"          # grep by test title
   npx playwright test --headed          # open headed browser

Docker (recommended for CI / reproducible runs)
1. Build image (from repo root)
   docker build -t playwright-tests .

2. Run tests (mount repo so results persist)
   # PowerShell
   docker run --rm -v ${PWD}:/projectHome -w /projectHome playwright-tests

   # override command to run specific suite
   docker run --rm -v ${PWD}:/projectHome -w /projectHome -e COMMAND_TO_RUN_TESTS="npx playwright test pom" playwright-tests

3. Using docker compose
   docker compose up --build

Allure reports
- Generate report after tests:
  npx allure generate ./allure-results --clean -o ./allure-report
- Serve/open report (prints server URL)
  npx allure open ./allure-report
- If running in container, open printed URL in host browser.

Common troubleshooting
- Timeout on page.goto:
  - Confirm target URL is reachable from your machine/container.
  - Increase navigation or test timeout:
    await page.goto(url, { timeout: 60000 });
    test('...', async () => { ... }, 90000);

- Playwright Docker browser mismatch:
  - Ensure Docker base image Playwright tag matches @playwright/test version in package.json.
  - Or run `npx playwright install --with-deps` inside the image.
  - Rebuild image with `docker build --no-cache -t playwright-tests .`

- JAVA_HOME issues (Allure):
  - Set JAVA_HOME to JDK root (no `\bin` or `\lib` suffix).
    e.g. `C:\Program Files\Eclipse Adoptium\jdk-17.0.x`
  - Restart terminal / service after changing system env.

- npm script errors with spaces:
  - Use script names without spaces or call with proper quoting. Prefer `clean:reports` style.

CI tips (GitHub Actions)
- Use a workflow that checks out code, installs Node, runs `npm ci`, installs Playwright browsers, and runs tests.
- Example: use `mcr.microsoft.com/playwright:<version>-noble` image or run `npx playwright install --with-deps`.

Contributing
- Create issues for problems or feature requests.
- Open a PR with tests and update README if behavior changes.

License
- Add a LICENSE file if you want to open-source this project.

Contact / Notes
- This README is a minimal guide. See test files for detailed usage and test names for `-g` patterns.  
