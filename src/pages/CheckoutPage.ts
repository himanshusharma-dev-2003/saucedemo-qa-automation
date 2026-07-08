import { Page, Locator, expect } from '@playwright/test';

/**
 * Covers both checkout steps: information form (step one) and the
 * overview/confirmation screen (step two + completion).
 */
export class CheckoutPage {
  readonly page: Page;

  // Step one - information form
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly errorMessage: Locator;

  // Step two - overview
  readonly finishButton: Locator;
  readonly summarySubtotal: Locator;
  readonly summaryTax: Locator;
  readonly summaryTotal: Locator;

  // Completion
  readonly completeHeader: Locator;

  constructor(page: Page) {
    this.page = page;

    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.errorMessage = page.locator('[data-test="error"]');

    this.finishButton = page.locator('[data-test="finish"]');
    this.summarySubtotal = page.locator('.summary_subtotal_label');
    this.summaryTax = page.locator('.summary_tax_label');
    this.summaryTotal = page.locator('.summary_total_label');

    this.completeHeader = page.locator('.complete-header');
  }

  async fillInformation(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }

  async expectInformationError(expectedText: string | RegExp) {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(expectedText);
  }

  /** Confirms subtotal + tax adds up to the displayed total (catches pricing bugs). */
  async expectTotalsAreConsistent() {
    const parse = async (locator: Locator) => {
      const text = await locator.textContent();
      return parseFloat((text ?? '').replace(/[^0-9.]/g, ''));
    };
    const subtotal = await parse(this.summarySubtotal);
    const tax = await parse(this.summaryTax);
    const total = await parse(this.summaryTotal);

    expect(Math.round((subtotal + tax) * 100) / 100).toBeCloseTo(total, 2);
  }

  async finish() {
    await this.finishButton.click();
  }

  async expectOrderComplete() {
    await expect(this.completeHeader).toHaveText(/thank you for your order/i);
  }
}
