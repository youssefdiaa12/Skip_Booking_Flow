import { Page, Locator } from "@playwright/test";
import { BasePage } from "../BasePage";

export class Step3Page extends BasePage {
  readonly skipGrid: Locator;
  readonly skipOptions: Locator;
  readonly skipsLoading: Locator;
  readonly toStep4Btn: Locator;
  readonly backToStep2Btn: Locator;

  constructor(page: Page) {
    super(page);

    this.skipGrid = this.getById("skipGrid");
    this.skipOptions = this.page.locator(".skip-option");
    this.skipsLoading = this.getById("skipsLoading");
    this.toStep4Btn = this.getById("toStep4");
    this.backToStep2Btn = this.getById("backToStep2");
  }

  async waitForSkips(): Promise<void> {
    await this.waitForHidden(this.skipsLoading);
  }

  async selectSkip(size: string): Promise<void> {
    const skip = this.skipOptions.filter({ hasText: size }).first();
    await skip.click();
  }

  async isSkipDisabled(size: string): Promise<boolean> {
    const skip = this.skipOptions.filter({ hasText: size }).first();
    return skip.evaluate((el) => el.classList.contains("disabled"));
  }

  async clickContinueToStep4(): Promise<void> {
    await this.toStep4Btn.click();
  }

  async waitForStep4(): Promise<void> {
    await this.page.locator("#step4").waitFor({ state: "visible" });
  }

  async clickBackToStep2(): Promise<void> {
    await this.backToStep2Btn.click();
  }

  async waitForStep2(): Promise<void> {
    await this.page.locator("#step2").waitFor({ state: "visible" });
  }

  async getSkipPrice(size: string): Promise<string> {
    const skip = this.skipOptions.filter({ hasText: size }).first();
    const priceElement = skip.locator(".skip-price");
    return priceElement.textContent();
  }

  async isContinueButtonEnabled(): Promise<boolean> {
    return this.toStep4Btn.isEnabled();
  }
}
