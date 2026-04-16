# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: booking.spec.ts >> Skip Booking System - E2E Tests >> TC008: Double submit prevention
- Location: automation\tests\booking.spec.ts:239:7

# Error details

```
Error: expect(locator).toBeEnabled() failed

Locator:  locator('#confirmBtn')
Expected: enabled
Received: disabled
Timeout:  5000ms

Call log:
  - Expect "toBeEnabled" with timeout 5000ms
  - waiting for locator('#confirmBtn')
    9 × locator resolved to <button disabled id="confirmBtn" class="btn btn-success">Processing...</button>
      - unexpected value "disabled"

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - heading "Skip Booking System" [level=1] [ref=e3]
  - generic [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]: "1"
      - generic [ref=e7]: Postcode
    - generic [ref=e8]:
      - generic [ref=e9]: "2"
      - generic [ref=e10]: Waste Type
    - generic [ref=e11]:
      - generic [ref=e12]: "3"
      - generic [ref=e13]: Select Skip
    - generic [ref=e14]:
      - generic [ref=e15]: "4"
      - generic [ref=e16]: Review
  - generic [ref=e18]:
    - generic [ref=e19]: ✓
    - generic [ref=e20]: Booking Confirmed!
    - paragraph [ref=e21]:
      - text: "Booking ID:"
      - strong [ref=e22]: BK-CW1K7Q52J
    - button "Make Another Booking" [ref=e23] [cursor=pointer]
```

# Test source

```ts
  161 |     await expect(page.locator("#plasterboardOptions")).toBeVisible();
  162 | 
  163 |     await step2.selectPlasterboardOption("separate");
  164 |     await step2.clickContinueToStep3();
  165 |     await step2.waitForStep3();
  166 | 
  167 |     await step3.waitForSkips();
  168 | 
  169 |     // FAIL - 14-yard should be disabled for plasterboard
  170 |     expect(await step3.isSkipDisabled("14-yard")).toBe(false);
  171 | 
  172 |     await step3.selectSkip("12-yard");
  173 |     await step3.clickContinueToStep4();
  174 |     await step3.waitForStep4();
  175 | 
  176 |     const reviewData = await step4.getReviewData();
  177 |     expect(reviewData.wasteType).toContain("Plasterboard");
  178 |   });
  179 | 
  180 |   test("TC006: M1 1AE - Latency simulation", async ({ page }) => {
  181 |     const { step1, step2, step3, step4 } = createPages(page);
  182 | 
  183 |     await step1.enterPostcode(testData.latendcyPostcodes[0]);
  184 |     await step1.clickLookup();
  185 | 
  186 |     const startTime = Date.now();
  187 |     await step1.waitForAddresses();
  188 |     const elapsed = Date.now() - startTime;
  189 | 
  190 |     // FAIL - expected faster response
  191 |     expect(elapsed).toBeLessThan(500);
  192 | 
  193 |     await step1.selectAddress(0);
  194 |     await step1.clickUseAddress();
  195 |     await step2.selectWasteType("general");
  196 |     await step2.clickContinueToStep3();
  197 |     await step2.waitForStep3();
  198 |     await step3.waitForSkips();
  199 |     await step3.selectSkip("4-yard");
  200 |     await step3.clickContinueToStep4();
  201 |     await step3.waitForStep4();
  202 | 
  203 |     const reviewData = await step4.getReviewData();
  204 |     expect(reviewData.postcode).toContain("M1 1AE");
  205 |   });
  206 | 
  207 |   test("TC007: Back navigation preserves state", async ({ page }) => {
  208 |     const { step1, step2, step3, step4 } = createPages(page);
  209 | 
  210 |     await step1.enterPostcode(testData.validPostcodes[0]);
  211 |     await step1.clickLookup();
  212 |     await step1.waitForLoading();
  213 |     await step1.waitForAddresses();
  214 |     await step1.selectAddress(0);
  215 |     await step1.clickUseAddress();
  216 | 
  217 |     await step2.selectWasteType("general");
  218 |     await step2.clickContinueToStep3();
  219 |     await step2.waitForStep3();
  220 |     await step3.waitForSkips();
  221 |     await step3.selectSkip("4-yard");
  222 |     await step3.clickContinueToStep4();
  223 |     await step3.waitForStep4();
  224 | 
  225 |     await step4.clickBackToStep3();
  226 |     await step4.waitForStep3();
  227 | 
  228 |     const skipOption = page.locator(".skip-option.selected");
  229 |     await expect(skipOption).toBeVisible();
  230 | 
  231 |     await step3.clickBackToStep2();
  232 |     await step3.waitForStep2();
  233 | 
  234 |     // FAIL - waste option should NOT be visible after back navigation
  235 |     const wasteOption = page.locator(".waste-option.selected");
  236 |     await expect(wasteOption).not.toBeVisible();
  237 |   });
  238 | 
  239 |   test("TC008: Double submit prevention", async ({ page }) => {
  240 |     const { step1, step2, step3, step4 } = createPages(page);
  241 | 
  242 |     await step1.enterPostcode(testData.validPostcodes[0]);
  243 |     await step1.clickLookup();
  244 |     await step1.waitForLoading();
  245 |     await step1.waitForAddresses();
  246 |     await step1.selectAddress(0);
  247 |     await step1.clickUseAddress();
  248 | 
  249 |     await step2.selectWasteType("general");
  250 |     await step2.clickContinueToStep3();
  251 |     await step2.waitForStep3();
  252 |     await step3.waitForSkips();
  253 |     await step3.selectSkip("4-yard");
  254 |     await step3.clickContinueToStep4();
  255 |     await step4.waitForStep4();
  256 | 
  257 |     await step4.clickConfirm();
  258 | 
  259 |     // FAIL - button should NOT be disabled during processing
  260 |     const confirmBtn = page.locator("#confirmBtn");
> 261 |     await expect(confirmBtn).toBeEnabled();
      |                              ^ Error: expect(locator).toBeEnabled() failed
  262 | 
  263 |     await step4.waitForSuccess();
  264 |     const bookingId = await step4.getBookingId();
  265 |     expect(bookingId).toMatch("sas");
  266 |   });
  267 | });
  268 | 
```