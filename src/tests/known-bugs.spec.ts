import { test, expect, USERS } from '../fixtures';

/**
 * SauceDemo intentionally ships a handful of UI bugs when logged in as
 * "problem_user" - this is well known in the QA community and is exactly
 * the kind of thing automation should catch. These tests are written to
 * DEMONSTRATE bug detection, not to pass cleanly - each one documents a
 * real, reproducible defect the way you would report it to a dev team.
 *
 * Rather than silently failing in a CI run, each test uses soft assertions
 * / explicit annotations so the HTML report clearly explains what is wrong,
 * why, and how to reproduce it - this is what a bug report attached to a
 * failing automated test should look like.
 */
test.describe('Known bugs (problem_user) @bug-report', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(USERS.problem.username, USERS.problem.password);
  });

  test('BUG: all product images render identically for problem_user', async ({ page }) => {
    // We expect this to fail because of the defect.
    // test.fail() ensures it doesn't break the CI pipeline.
    test.fail();
    test.info().annotations.push({
      type: 'bug',
      description:
        'Expected: each product should show its own unique thumbnail image. ' +
        'Actual: problem_user sees the same placeholder image (dog) for every product. ' +
        'Steps to reproduce: log in as problem_user -> view inventory page -> compare product image src attributes.',
    });

    const imageSources = await page.locator('.inventory_item_img img').evaluateAll((imgs) =>
      imgs.map((img) => (img as HTMLImageElement).src)
    );

    const uniqueSources = new Set(imageSources);
    // This assertion documents the bug: we EXPECT more than one unique image,
    // but the defect causes only one to be served for every product.
    expect(uniqueSources.size, 'All product images should not be identical').toBeGreaterThan(1);
  });

  test('BUG: last name field cannot be edited during checkout for problem_user', async ({
    page,
    inventoryPage,
    checkoutPage,
  }) => {
    // We expect this to fail because of the defect.
    test.fail();
    test.info().annotations.push({
      type: 'bug',
      description:
        'Expected: the "Last Name" field on the checkout information form should accept ' +
        'typed input like any other field. Actual: for problem_user, the field silently ' +
        'rejects keystrokes, making checkout impossible to complete correctly. ' +
        'Steps to reproduce: log in as problem_user -> add an item -> go to checkout -> ' +
        'attempt to type into the Last Name field.',
    });

    await inventoryPage.expectLoaded();
    await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await page.locator('[data-test="checkout"]').click();

    await checkoutPage.lastNameInput.fill('Doe');
    const actualValue = await checkoutPage.lastNameInput.inputValue();

    expect(actualValue, 'Last Name field should retain typed input').toBe('Doe');
  });
});
