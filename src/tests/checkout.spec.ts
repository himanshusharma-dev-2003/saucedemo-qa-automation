import { test, expect, USERS } from '../fixtures';
import { TestDataGenerator } from '../utils/testDataGenerator';

test.describe('Checkout flow', () => {
  test.beforeEach(async ({ loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await inventoryPage.expectLoaded();
    await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
    await inventoryPage.addItemToCartByName('Sauce Labs Bike Light');
    await inventoryPage.goToCart();
  });

  test('completes a full purchase end to end', async ({ cartPage, checkoutPage }) => {
    await cartPage.expectItemCount(2);
    await cartPage.beginCheckout();

    const user = TestDataGenerator.generateUser();
    await checkoutPage.fillInformation(user.firstName, user.lastName, user.address.postalCode);
    await checkoutPage.expectTotalsAreConsistent();

    await checkoutPage.finish();
    await checkoutPage.expectOrderComplete();
  });

  test('cannot continue checkout without a first name', async ({ cartPage, checkoutPage }) => {
    await cartPage.beginCheckout();
    const user = TestDataGenerator.generateUser();
    await checkoutPage.fillInformation('', user.lastName, user.address.postalCode);
    await checkoutPage.expectInformationError('First Name is required');
  });

  test('cannot continue checkout without a postal code', async ({ cartPage, checkoutPage }) => {
    await cartPage.beginCheckout();
    const user = TestDataGenerator.generateUser();
    await checkoutPage.fillInformation(user.firstName, user.lastName, '');
    await checkoutPage.expectInformationError('Postal Code is required');
  });

  test('order total correctly reflects both items in cart', async ({ cartPage, checkoutPage }) => {
    await cartPage.expectItemPresent('Sauce Labs Backpack');
    await cartPage.expectItemPresent('Sauce Labs Bike Light');
    await cartPage.beginCheckout();
    const user = TestDataGenerator.generateUser();
    await checkoutPage.fillInformation(user.firstName, user.lastName, user.address.postalCode);
    await checkoutPage.expectTotalsAreConsistent();
  });
});
