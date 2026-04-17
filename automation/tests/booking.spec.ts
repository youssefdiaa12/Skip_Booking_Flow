import { test, expect, Page } from "@playwright/test";
import { Step1Page } from "../pages/Step1";
import { Step2Page } from "../pages/Step2";
import { Step3Page } from "../pages/Step3";
import { Step4Page } from "../pages/Step4";
import { testData, skipFixtures } from "../fixtures/testData";

function createPages(page: Page) {
  return {
    step1: new Step1Page(page),
    step2: new Step2Page(page),
    step3: new Step3Page(page),
    step4: new Step4Page(page),
  };
}

test.describe("Skip Booking System - E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000");
  });

  test("TC001: General Waste Flow - Complete booking successfully", async ({
    page,
  }) => {
    const { step1, step2, step3, step4 } = createPages(page);

    await step1.enterPostcode(testData.validPostcodes[0]);
    await step1.clickLookup();
    await step1.waitForLoading();
    await step1.waitForAddresses();
    await step1.selectAddress(0);
    await step1.clickUseAddress();

    await step2.selectWasteType(testData.wasteTypes[0]);
    await step2.clickContinueToStep3();
    await step2.waitForStep3();

    await step3.waitForSkips();
    await step3.selectSkip(testData.skipSizes[0]);
    await step3.clickContinueToStep4();
    await step3.waitForStep4();

    const reviewData = await step4.getReviewData();
    expect(reviewData.postcode).toContain("SW1A 1AA");
    expect(reviewData.wasteType).toBe("General Waste");
    expect(reviewData.skipSize).toContain("4-yard"); // Success - expected 4-yard

    await step4.clickConfirm();
    await step4.waitForSuccess();

    const bookingId = await step4.getBookingId();
    expect(bookingId).toMatch(/^BK-[A-Z0-9]+$/);
  });

  test("TC002: Heavy Waste Flow - Verify large skips disabled", async ({
    page,
  }) => {
    const { step1, step2, step3, step4 } = createPages(page);

    await step1.enterPostcode(testData.validPostcodes[0]);
    await step1.clickLookup();
    await step1.waitForLoading();
    await step1.waitForAddresses();
    await step1.selectAddress(0);
    await step1.clickUseAddress();

    await step2.selectWasteType(testData.wasteTypes[1]);
    await step2.clickContinueToStep3();
    await step2.waitForStep3();

    await step3.waitForSkips();

    // FAIL - 8-yard should be disabled for heavy waste
    expect(await step3.isSkipDisabled(testData.skipSizes[2])).toBe(true);

    await step3.selectSkip(testData.skipSizes[0]);
    await step3.clickContinueToStep4();
    await step3.waitForStep4();

    const reviewData = await step4.getReviewData();
    expect(reviewData.wasteType).toContain(testData.wasteTypes[1]);

    await step4.clickConfirm();
    await step4.waitForSuccess();

    const bookingId = await step4.getBookingId();
    expect(bookingId).toMatch(/^BK-[A-Z0-9]+$/);
  });

  test("TC003: EC1A 1BB - Empty state with manual entry", async ({ page }) => {
    const { step1, step2, step3, step4 } = createPages(page);

    await step1.enterPostcode(testData.emptyPostcodes[0]);
    await step1.clickLookup();
    await step1.waitForLoading();
    await step1.waitForEmptyState();

    await step1.enterManualAddress("123 Test Street, London");
    await step1.clickUseManual();

    await step2.selectWasteType(testData.wasteTypes[0]);
    await step2.clickContinueToStep3();
    await step2.waitForStep3();

    await step3.waitForSkips();
    await step3.selectSkip(testData.skipSizes[0]);
    await step3.clickContinueToStep4();
    await step3.waitForStep4();

    // SUCCESS - expected address from manual entry
    const reviewData = await step4.getReviewData();
    expect(reviewData.address).toBe("123 Test Street, London");

    await step4.clickConfirm();
    await step4.waitForSuccess();
  });

  test("TC004: General Waste Flow with selection of 12 yard cause total price being 432.00", async ({
    page,
  }) => {
    const { step1, step2, step3, step4 } = createPages(page);
    await step1.enterPostcode(testData.validPostcodes[0]);
    await step1.clickLookup();
    await step1.waitForLoading();
    await step1.waitForAddresses();
    await step1.selectAddress(0);
    await step1.clickUseAddress();

    await step2.selectWasteType(testData.wasteTypes[0]);
      await step2.clickContinueToStep3();
    await step2.waitForStep3();

    await step3.waitForSkips();
    await step3.selectSkip(testData.skipSizes[4]);
    await step3.clickContinueToStep4();
    await step3.waitForStep4();

        // SUCCESS - expected price to be 432.00
    const reviewData = await step4.getReviewData();
    expect(reviewData.total).toBe("£432.00");

    await step4.clickConfirm();
    await step4.waitForSuccess();
    
  });

  test("TC005: Plasterboard Flow - Branching logic with options", async ({
    page,
  }) => {
    const { step1, step2, step3, step4 } = createPages(page);

    await step1.enterPostcode(testData.validPostcodes[0]);
    await step1.clickLookup();
    await step1.waitForLoading();
    await step1.waitForAddresses();
    await step1.selectAddress(0);
    await step1.clickUseAddress();

    await step2.selectWasteType(testData.wasteTypes[2]);

    await expect(page.locator("#plasterboardOptions")).toBeVisible();

    await step2.selectPlasterboardOption("separate");
    await step2.clickContinueToStep3();
    await step2.waitForStep3();

    await step3.waitForSkips();

    // SUCCESS - 14-yard should be disabled for plasterboard
    expect(await step3.isSkipDisabled("14-yard")).toBe(true);

    await step3.selectSkip("12-yard");
    await step3.clickContinueToStep4();
    await step3.waitForStep4();

    const reviewData = await step4.getReviewData();
    expect(reviewData.wasteType).toContain("Plasterboard");
  });

  test("TC006: M1 1AE - Latency simulation", async ({ page }) => {
    const { step1, step2, step3, step4 } = createPages(page);

    await step1.enterPostcode(testData.latendcyPostcodes[0]);
    await step1.clickLookup();

    const startTime = Date.now();
    await step1.waitForAddresses();
    const elapsed = Date.now() - startTime;

    // FAIL - expected faster response
    expect(elapsed).toBeLessThan(3500);

    await step1.selectAddress(0);
    await step1.clickUseAddress();
    await step2.selectWasteType(testData.wasteTypes[0]);
    await step2.clickContinueToStep3();
    await step2.waitForStep3();
    await step3.waitForSkips();
    await step3.selectSkip(testData.skipSizes[0]);
    await step3.clickContinueToStep4();
    await step3.waitForStep4();

    const reviewData = await step4.getReviewData();
    expect(reviewData.postcode).toContain("M1 1AE");
  });

  test("TC007: Back navigation preserves state", async ({ page }) => {
    const { step1, step2, step3, step4 } = createPages(page);

    await step1.enterPostcode(testData.validPostcodes[0]);
    await step1.clickLookup();
    await step1.waitForLoading();
    await step1.waitForAddresses();
    await step1.selectAddress(0);
    await step1.clickUseAddress();

    await step2.selectWasteType(testData.wasteTypes[0]);
    await step2.clickContinueToStep3();
    await step2.waitForStep3();
    await step3.waitForSkips();
    await step3.selectSkip(testData.skipSizes[0]);
    await step3.clickContinueToStep4();
    await step3.waitForStep4();

    await step4.clickBackToStep3();
    await step4.waitForStep3();

    const skipOption = page.locator(".skip-option.selected");
    await expect(skipOption).toBeVisible();

    await step3.clickBackToStep2();
    await step3.waitForStep2();

    // SUCCESS - waste option should be visible after back navigation
    const wasteOption = page.locator(".waste-option.selected");
    await expect(wasteOption).toBeVisible();
  });

  test("TC008: Double submit prevention", async ({ page }) => {
    const { step1, step2, step3, step4 } = createPages(page);

    await step1.enterPostcode(testData.validPostcodes[0]);
    await step1.clickLookup();
    await step1.waitForLoading();
    await step1.waitForAddresses();
    await step1.selectAddress(0);
    await step1.clickUseAddress();

    await step2.selectWasteType(testData.wasteTypes[1]);
    await step2.clickContinueToStep3();
    await step2.waitForStep3();
    await step3.waitForSkips();
    await step3.selectSkip(testData.skipSizes[0]);
    await step3.clickContinueToStep4();
    await step4.waitForStep4();

    await step4.clickConfirm();

    // SUCCESS - confirm button should be disabled after click
    const confirmBtn = page.locator("#confirmBtn");
    await expect(confirmBtn).toBeDisabled();

    await step4.waitForSuccess();
    const bookingId = await step4.getBookingId();
    expect(bookingId).toMatch(/^BK-[A-Z0-9]+$/);
  });
});
