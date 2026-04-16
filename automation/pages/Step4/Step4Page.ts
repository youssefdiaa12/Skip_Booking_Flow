import { Page, Locator } from "@playwright/test";
import { BasePage } from "../BasePage";

export interface ReviewData {
  postcode: string;
  address: string;
  wasteType: string;
  skipSize: string;
  skipPrice: string;
  vat: string;
  total: string;
}

export class Step4Page extends BasePage {
  readonly reviewPostcode: Locator;
  readonly reviewAddress: Locator;
  readonly reviewWasteType: Locator;
  readonly reviewSkipSize: Locator;
  readonly skipPrice: Locator;
  readonly vatAmount: Locator;
  readonly totalPrice: Locator;
  readonly confirmBtn: Locator;
  readonly backToStep3Btn: Locator;
  readonly successCard: Locator;
  readonly bookingId: Locator;
  readonly newBookingBtn: Locator;

  constructor(page: Page) {
    super(page);

    this.reviewPostcode = this.getById("reviewPostcode");
    this.reviewAddress = this.getById("reviewAddress");
    this.reviewWasteType = this.getById("reviewWasteType");
    this.reviewSkipSize = this.getById("reviewSkipSize");
    this.skipPrice = this.getById("skipPrice");
    this.vatAmount = this.getById("vatAmount");
    this.totalPrice = this.getById("totalPrice");
    this.confirmBtn = this.getById("confirmBtn");
    this.backToStep3Btn = this.getById("backToStep3");
    this.successCard = this.getById("successCard");
    this.bookingId = this.getById("bookingId");
    this.newBookingBtn = this.getById("newBooking");
  }

  async getReviewData(): Promise<ReviewData> {
    return {
      postcode: (await this.reviewPostcode.textContent()) ?? "",
      address: (await this.reviewAddress.textContent()) ?? "",
      wasteType: (await this.reviewWasteType.textContent()) ?? "",
      skipSize: (await this.reviewSkipSize.textContent()) ?? "",
      skipPrice: (await this.skipPrice.textContent()) ?? "",
      vat: (await this.vatAmount.textContent()) ?? "",
      total: (await this.totalPrice.textContent()) ?? "",
    };
  }

  async clickConfirm(): Promise<void> {
    await this.confirmBtn.click();
  }

  async waitForSuccess(): Promise<void> {
    await this.waitForVisible(this.successCard);
  }

  async getBookingId(): Promise<string | null> {
    return this.bookingId.textContent();
  }

  async clickNewBooking(): Promise<void> {
    await this.newBookingBtn.click();
  }

  async waitForStep1(): Promise<void> {
    await this.page.locator("#step1").waitFor({ state: "visible" });
  }

  async clickBackToStep3(): Promise<void> {
    await this.backToStep3Btn.click();
  }

  async waitForStep3(): Promise<void> {
    await this.page.locator("#step3").waitFor({ state: "visible" });
  }

  async waitForStep4(): Promise<void> {
    await this.page.locator("#step4").waitFor({ state: "visible" });
  }

  async isConfirmButtonDisabled(): Promise<boolean> {
    return this.confirmBtn.isDisabled();
  }

  async getConfirmButtonText(): Promise<string | null> {
    return this.confirmBtn.textContent();
  }
}
