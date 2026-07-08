import { test, expect, USERS } from '../fixtures';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('standard user can log in successfully', async ({ loginPage, inventoryPage }) => {
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await inventoryPage.expectLoaded();
    await expect(inventoryPage.page).toHaveURL(/inventory\.html/);
  });

  test('locked out user is blocked with a clear error', async ({ loginPage }) => {
    await loginPage.login(USERS.lockedOut.username, USERS.lockedOut.password);
    await loginPage.expectErrorMessage('locked out');
  });

  test('invalid password is rejected', async ({ loginPage }) => {
    await loginPage.login(USERS.standard.username, 'wrong_password');
    await loginPage.expectErrorMessage('Username and password do not match');
  });

  test('empty credentials show a required-field error', async ({ loginPage }) => {
    await loginPage.login('', '');
    await loginPage.expectErrorMessage('Username is required');
  });

  test('empty password shows a required-field error', async ({ loginPage }) => {
    await loginPage.login(USERS.standard.username, '');
    await loginPage.expectErrorMessage('Password is required');
  });

  test('unregistered username is rejected', async ({ loginPage }) => {
    await loginPage.login('not_a_real_user', 'secret_sauce');
    await loginPage.expectErrorMessage('do not match');
  });
});
