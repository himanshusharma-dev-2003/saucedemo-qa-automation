import { test, expect, USERS } from '../pages/fixtures';

test.describe('Inventory', () => {
  test.beforeEach(async ({ loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await inventoryPage.expectLoaded();
  });

  test('displays six products by default', async ({ inventoryPage }) => {
    await expect(inventoryPage.inventoryItems).toHaveCount(6);
  });

  test('sorting by price low to high orders items correctly', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('lohi');
    const prices = await inventoryPage.getAllPrices();
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  test('sorting by price high to low orders items correctly', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('hilo');
    const prices = await inventoryPage.getAllPrices();
    const sorted = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sorted);
  });

  test('sorting A to Z orders items alphabetically', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('az');
    const names = await inventoryPage.getAllNames();
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  });

  test('adding an item updates the cart badge', async ({ inventoryPage }) => {
    await inventoryPage.expectCartCount(0);
    await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
    await inventoryPage.expectCartCount(1);
  });

  test('removing an item updates the cart badge', async ({ inventoryPage }) => {
    await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
    await inventoryPage.expectCartCount(1);
    await inventoryPage.removeItemFromCartByName('Sauce Labs Backpack');
    await inventoryPage.expectCartCount(0);
  });

  test('adding multiple items accumulates the cart badge correctly', async ({ inventoryPage }) => {
    await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
    await inventoryPage.addItemToCartByName('Sauce Labs Bike Light');
    await inventoryPage.addItemToCartByName('Sauce Labs Bolt T-Shirt');
    await inventoryPage.expectCartCount(3);
  });
});
