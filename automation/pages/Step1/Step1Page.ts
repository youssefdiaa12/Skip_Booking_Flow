import { Page, Locator } from "@playwright/test";
import { BasePage } from "../BasePage";

export class Step1Page extends BasePage {
  readonly postcodeInput: Locator;
  readonly lookupBtn: Locator;
  readonly lookupLoading: Locator;
  readonly lookupError: Locator;
  readonly errorText: Locator;
  readonly retryBtn: Locator;
  readonly addressesContainer: Locator;
  readonly addressList: Locator;
  readonly addressItems: Locator;
  readonly useAddressBtn: Locator;
  readonly manualEntry: Locator;
  readonly manualAddressInput: Locator;
  readonly useManualBtn: Locator;

  constructor(page: Page) {
    super(page);

    this.postcodeInput = this.getById("postcode");
    this.lookupBtn = this.getById("lookupBtn");
    this.lookupLoading = this.getById("lookupLoading");
    this.lookupError = this.getById("lookupError");
    this.errorText = this.page.locator("#errorText");
    this.retryBtn = this.getById("retryBtn");
    this.addressesContainer = this.getById("addressesContainer");
    this.addressList = this.getById("addressList");
    this.addressItems = this.page.locator(".address-item");
    this.useAddressBtn = this.getById("useAddressBtn");
    this.manualEntry = this.getById("manualEntry");
    this.manualAddressInput = this.getById("manualAddress");
    this.useManualBtn = this.getById("useManualBtn");
  }

  async enterPostcode(postcode: string): Promise<void> {
    await this.postcodeInput.fill(postcode);
  }

  async clickLookup(): Promise<void> {
    await this.lookupBtn.click();
  }

  async waitForLoading(): Promise<void> {
    await this.waitForVisible(this.lookupLoading);
    await this.waitForHidden(this.lookupLoading);
  }

  async waitForAddresses(): Promise<void> {
    await this.waitForVisible(this.addressesContainer);
  }

  async selectAddress(index: number = 0): Promise<void> {
    const address = this.addressItems.nth(index);
    await address.click();
  }

  async clickUseAddress(): Promise<void> {
    await this.useAddressBtn.click();
  }

  async waitForEmptyState(): Promise<void> {
    await this.waitForVisible(this.manualEntry);
  }

  async enterManualAddress(address: string): Promise<void> {
    await this.manualAddressInput.fill(address);
  }

  async clickUseManual(): Promise<void> {
    await this.useManualBtn.click();
  }

  async waitForError(): Promise<void> {
    await this.waitForVisible(this.lookupError);
  }

  async clickRetry(): Promise<void> {
    await this.retryBtn.click();
  }

  async getErrorMessage(): Promise<string | null> {
    return this.errorText.textContent();
  }
}
