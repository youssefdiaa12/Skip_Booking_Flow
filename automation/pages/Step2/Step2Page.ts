import { Page, Locator } from "@playwright/test";
import { BasePage } from "../BasePage";

export class Step2Page extends BasePage {
  readonly step2Container: Locator;
  readonly generalWasteOption: Locator;
  readonly heavyWasteOption: Locator;
  readonly plasterboardOption: Locator;
  readonly plasterboardOptions: Locator;
  readonly toStep3Btn: Locator;
  readonly backToStep1Btn: Locator;

  constructor(page: Page) {
    super(page);

    this.step2Container = this.page.locator("#step2");
    this.generalWasteOption = this.page.locator('[data-type="general"]');
    this.heavyWasteOption = this.page.locator('[data-type="heavy"]');
    this.plasterboardOption = this.page.locator('[data-type="plasterboard"]');
    this.plasterboardOptions = this.getById("plasterboardOptions");
    this.toStep3Btn = this.getById("toStep3");
    this.backToStep1Btn = this.getById("backToStep1");
  }

  async selectWasteType(
    type: "General Waste" | "Heavy Waste" | "Plasterboard",
  ): Promise<void> {
    const option = {
      "General Waste": this.generalWasteOption,
      "Heavy Waste": this.heavyWasteOption,
      "Plasterboard": this.plasterboardOption,
    }[type];
    await option.click();
  }

  async selectPlasterboardOption(
    option: "separate" | "mixed" | "bagged",
  ): Promise<void> {
    await this.page
      .locator(`input[name="plasterboardOption"][value="${option}"]`)
      .check();
  }

  async clickContinueToStep3(): Promise<void> {
    await this.toStep3Btn.click();
  }

  async waitForStep3(): Promise<void> {
    await this.page.locator("#step3").waitFor({ state: "visible" });
  }

  async clickBackToStep1(): Promise<void> {
    await this.backToStep1Btn.click();
  }

  async waitForStep1(): Promise<void> {
    await this.page.locator("#step1").waitFor({ state: "visible" });
  }

  async isPlasterboardOptionsVisible(): Promise<boolean> {
    return this.plasterboardOptions.isVisible();
  }

  async isContinueButtonEnabled(): Promise<boolean> {
    return this.toStep3Btn.isEnabled();
  }
}
