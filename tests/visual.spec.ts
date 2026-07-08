import { test, expect, USERS } from '../pages/fixtures';

/**
 * Visual Regression Testing — Playwright's built-in toHaveScreenshot()
 *
 * How it works:
 *   • FIRST RUN (update mode): `npm run test:visual:update`
 *     Playwright renders the page, saves a .png "golden" snapshot to
 *     tests/visual.spec.ts-snapshots/. These files are committed to source
 *     control so CI can diff against them on every subsequent run.
 *
 *   • SUBSEQUENT RUNS: `npm run test:visual`
 *     Playwright re-renders, pixel-diffs against the stored golden, and
 *     fails if the diff exceeds the tolerance set in playwright.config.ts
 *     (maxDiffPixels: 100, threshold: 0.2).
 *
 * Tolerance rationale (in playwright.config.ts):
 *   maxDiffPixels:100  — absorbs minor font-hinting / anti-aliasing deltas
 *   threshold: 0.2     — per-pixel: 20% colour difference is still "same"
 *   Together they prevent flaky failures from sub-pixel rendering while
 *   still catching meaningful visual regressions (broken images, layout
 *   shifts, wrong colours, etc.)
 *
 * Viewport: all tests run at a fixed 1280×720 viewport so screenshots are
 * pixel-identical across runs regardless of OS scroll-bar width or DPI.
 *
 * Tests in this file:
 *   1. Login page — the un-authenticated entry point (clean baseline)
 *   2. Inventory page — standard_user (correct) vs. problem_user (broken images)
 *   3. Checkout complete page — catches regressions in the success confirmation
 */

/** Fixed viewport used by every visual test for stable, reproducible snapshots. */
const SNAPSHOT_VIEWPORT = { width: 1280, height: 720 };

test.describe('Visual regression @visual', () => {
  // Pin every test in this suite to the same fixed viewport so golden
  // snapshots are pixel-identical across machines, OS scroll-bars, and CI.
  test.use({ viewport: SNAPSHOT_VIEWPORT });

  // ─────────────────────────────────────────────────────────────────────────
  // 1. Login page — baseline
  // ─────────────────────────────────────────────────────────────────────────

  test('login page matches golden snapshot', async ({ page }) => {
    await page.goto('/');

    // Wait for the login button to be fully rendered before snapping
    await page.locator('#login-button').waitFor({ state: 'visible' });

    await expect(page).toHaveScreenshot('login-page.png', {
      fullPage: true,
      // Mask the dynamic elements that change between runs (none on this page,
      // but this pattern is worth showing for pages that have timestamps etc.)
      mask: [],
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // 2a. Inventory page — standard_user (golden / correct state)
  // ─────────────────────────────────────────────────────────────────────────

  test('inventory page (standard_user) matches golden snapshot', async ({ page, loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await inventoryPage.expectLoaded();

    // Mask the cart badge — it's dynamic and not under test here
    await expect(page).toHaveScreenshot('inventory-standard-user.png', {
      fullPage: true,
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // 2b. Inventory page — problem_user (documents the broken-image bug visually)
  //
  //     This test is annotated with test.fail() because we KNOW the snapshot
  //     will differ from the standard_user golden — that IS the bug.
  //     The diff artifact in the HTML report shows exactly which images are
  //     wrong — far clearer than a text assertion.
  //
  //     Approach: we capture a separate golden for problem_user so CI always
  //     has a known-bad reference. Any deviation FROM the known-bad state
  //     (e.g., the bug being fixed) will surface as a snapshot change — which
  //     is exactly what you want: a signal that something changed.
  // ─────────────────────────────────────────────────────────────────────────

  test('inventory page (problem_user) snapshot documents broken-image bug', async ({
    page,
    loginPage,
    inventoryPage,
  }) => {
    test.info().annotations.push({
      type: 'bug',
      description:
        'problem_user sees an identical placeholder image (dog) for every product ' +
        'instead of each product\'s unique thumbnail. This snapshot captures the ' +
        'known-bad state so any future change (fix or regression) is automatically detected.',
    });

    await loginPage.goto();
    await loginPage.login(USERS.problem.username, USERS.problem.password);
    await inventoryPage.expectLoaded();

    // Capture the known-bad state as its own named snapshot.
    // If this snapshot matches on every CI run → bug is still present (expected).
    // If it stops matching → the bug was fixed and a human should update the snapshot.
    await expect(page).toHaveScreenshot('inventory-problem-user-known-bug.png', {
      fullPage: true,
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // 3. Checkout complete — success confirmation page
  //    Catches regressions in the "Your order has been dispatched" banner,
  //    the Pony Express image, and the "Back Home" button layout.
  // ─────────────────────────────────────────────────────────────────────────

  test('checkout complete confirmation page matches golden snapshot', async ({
    page,
    loginPage,
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    // Full happy-path flow to reach the confirmation screen
    await loginPage.goto();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await inventoryPage.expectLoaded();
    await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await cartPage.beginCheckout();
    await checkoutPage.fillInformation('Jane', 'Doe', '12345');
    await checkoutPage.finish();
    await checkoutPage.expectOrderComplete();

    await expect(page).toHaveScreenshot('checkout-complete.png', {
      fullPage: true,
    });
  });
});
