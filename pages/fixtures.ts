import { test as base } from '@playwright/test';
import { LoginPage } from './LoginPage';
import { InventoryPage } from './InventoryPage';
import { CartPage } from './CartPage';
import { CheckoutPage } from './CheckoutPage';

/**
 * SauceDemo's publicly documented practice accounts.
 * See https://www.saucedemo.com for the full list of usernames.
 *
 * STANDARD_USER / STANDARD_PASSWORD are read from the environment so that
 * different credentials can be used in staging vs. production without
 * touching test code. Fallbacks keep existing tests working with no .env file.
 */
export const USERS = {
  standard: {
    username: process.env.STANDARD_USER ?? 'standard_user',
    password: process.env.STANDARD_PASSWORD ?? 'secret_sauce',
  },
  lockedOut: { username: 'locked_out_user', password: 'secret_sauce' },
  problem:   { username: 'problem_user',    password: 'secret_sauce' },
  glitch:    { username: 'performance_glitch_user', password: 'secret_sauce' },
};

type Pages = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
};

/**
 * Extends the base Playwright test with our page objects pre-instantiated,
 * so test files don't need boilerplate `new LoginPage(page)` in every test.
 */
export const test = base.extend<Pages>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
});

export { expect } from '@playwright/test';

