import { test, expect, USERS } from '../fixtures';
import { orderQueries } from '../queries/orderQueries';

test.describe('Database Validation during Checkout', () => {
  test('should persist order details in the database after successful checkout', async ({
    loginPage,
    inventoryPage,
    cartPage,
    checkoutPage,
    db, // Injected via our fixture
  }) => {
    // 1. Setup & Login
    await loginPage.goto();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    
    // 2. Add an item to the cart
    await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    
    // 3. Complete Checkout Flow
    await cartPage.beginCheckout();
    await checkoutPage.fillInformation('Jane', 'Doe', '90210');
    await checkoutPage.finish();
    await checkoutPage.expectOrderComplete();

    // 4. Capture Order ID
    // Note: SauceDemo does not visually display an Order ID on the UI.
    // In a real application, we would scrape the ID from the UI or an intercepted API response.
    // For this demonstration, we simulate a captured Order ID:
    const capturedOrderId = 'ORD-12345';

    // 5. Query the Database
    // The `db` fixture automatically manages the connection lifecycle.
    const results = await db.executeQuery(orderQueries.getOrderById, [capturedOrderId]);
    
    // 6. Assertions on Database Values
    expect(results.length).toBe(1); // Ensure exactly one record was found

    const orderRecord = results[0];
    
    // Verify specific column values
    expect(orderRecord.order_id).toBe(capturedOrderId);
    expect(orderRecord.customer_name).toBe(USERS.standard.username);
    expect(orderRecord.total_amount).toBe(32.39); // Price of backpack + tax
    expect(orderRecord.order_status).toBe('PROCESSING');
  });
});
