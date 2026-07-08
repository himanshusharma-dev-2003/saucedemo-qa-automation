import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object for the product listing ("Inventory") page.
 */
export class InventoryPage {
  readonly page: Page;
  readonly inventoryList: Locator;
  readonly inventoryItems: Locator;
  readonly sortDropdown: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly itemPrices: Locator;
  readonly itemNames: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inventoryList = page.locator('.inventory_list');
    this.inventoryItems = page.locator('.inventory_item');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
    this.itemPrices = page.locator('.inventory_item_price');
    this.itemNames = page.locator('.inventory_item_name');
  }

  async expectLoaded() {
    await expect(this.inventoryList).toBeVisible();
  }

  async addItemToCartByName(itemName: string) {
    const item = this.page.locator('.inventory_item', { hasText: itemName });
    await item.getByRole('button', { name: /add to cart/i }).click();
  }

  async removeItemFromCartByName(itemName: string) {
    const item = this.page.locator('.inventory_item', { hasText: itemName });
    await item.getByRole('button', { name: /remove/i }).click();
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.sortDropdown.selectOption(option);
  }

  async getAllPrices(): Promise<number[]> {
    const texts = await this.itemPrices.allTextContents();
    return texts.map((t) => parseFloat(t.replace('$', '')));
  }

  async getAllNames(): Promise<string[]> {
    return this.itemNames.allTextContents();
  }

  async goToCart() {
    await this.cartLink.click();
  }

  async expectCartCount(count: number) {
    if (count === 0) {
      await expect(this.cartBadge).not.toBeVisible();
    } else {
      await expect(this.cartBadge).toHaveText(String(count));
    }
  }
}
