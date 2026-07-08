import { test, expect } from '../fixtures';
import loginCases from '../test-data/login-cases.json';
import { LoginTestCase } from '../test-data/types';

/**
 * Data-driven version of the login suite.
 *
 * Instead of hand-writing one test() per scenario, every case lives in
 * test-data/login-cases.json. Adding a new scenario - a new invalid input,
 * a new locale, a new account type - means adding one JSON object, not
 * writing new test code. This is the pattern you reach for once a manual
 * test suite outgrows a handful of hardcoded cases, and it keeps
 * QA-authored test data changes separate from code changes.
 *
 * The cast below is intentional: TypeScript widens JSON string fields to
 * `string`, so we assert the shape once here instead of on every case.
 */
const cases = loginCases as LoginTestCase[];

test.describe('Login (data-driven)', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  for (const testCase of cases) {
    test(`${testCase.caseId}: ${testCase.description}`, async ({ loginPage, inventoryPage }) => {
      await loginPage.login(testCase.username, testCase.password);

      if (testCase.expectedOutcome === 'success') {
        await inventoryPage.expectLoaded();
        await expect(inventoryPage.page).toHaveURL(/inventory\.html/);
      } else {
        // expectedError is required by convention whenever expectedOutcome is 'error';
        // fail loudly here rather than silently skipping the assertion.
        expect(
          testCase.expectedError,
          `Test data for ${testCase.caseId} is missing "expectedError"`
        ).toBeTruthy();
        await loginPage.expectErrorMessage(testCase.expectedError!);
      }
    });
  }
});
