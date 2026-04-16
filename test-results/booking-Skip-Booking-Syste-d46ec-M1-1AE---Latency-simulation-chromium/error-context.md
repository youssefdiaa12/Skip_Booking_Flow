# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: booking.spec.ts >> Skip Booking System - E2E Tests >> TC006: M1 1AE - Latency simulation
- Location: automation\tests\booking.spec.ts:180:7

# Error details

```
Error: expect(received).toBeLessThan(expected)

Expected: < 500
Received:   2756
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
  - generic [ref=e17]:
    - heading "Enter Your Postcode" [level=2] [ref=e18]
    - generic [ref=e19]:
      - generic [ref=e20]: UK Postcode
      - textbox "UK Postcode" [ref=e21]:
        - /placeholder: e.g. SW1A 1AA
        - text: M1 1AE
    - button "Lookup Address" [ref=e22] [cursor=pointer]
    - generic [ref=e23]:
      - generic [ref=e24]:
        - generic [ref=e25]: Select Address
        - generic [ref=e27] [cursor=pointer]: 1 Piccadilly Gardens, Manchester
      - button "Continue" [disabled] [ref=e28]
```

# Test source

```ts
  91  |     const { step1, step2, step3, step4 } = createPages(page);
  92  | 
  93  |     await step1.enterPostcode(testData.emptyPostcodes[0]);
  94  |     await step1.clickLookup();
  95  |     await step1.waitForLoading();
  96  |     await step1.waitForEmptyState();
  97  | 
  98  |     await step1.enterManualAddress("123 Test Street, London");
  99  |     await step1.clickUseManual();
  100 | 
  101 |     await step2.selectWasteType("general");
  102 |     await step2.clickContinueToStep3();
  103 |     await step2.waitForStep3();
  104 | 
  105 |     await step3.waitForSkips();
  106 |     await step3.selectSkip("6-yard");
  107 |     await step3.clickContinueToStep4();
  108 |     await step3.waitForStep4();
  109 | 
  110 |     // FAIL - expected different address
  111 |     const reviewData = await step4.getReviewData();
  112 |     expect(reviewData.address).toBe("Different Address");
  113 | 
  114 |     await step4.clickConfirm();
  115 |     await step4.waitForSuccess();
  116 |   });
  117 | 
  118 |   test("TC004: BS1 4DJ - Error on first call, success on retry", async ({
  119 |     page,
  120 |   }) => {
  121 |     const { step1, step2, step3, step4 } = createPages(page);
  122 | 
  123 |     await step1.enterPostcode(testData.errorPostcodes[0]);
  124 |     await step1.clickLookup();
  125 |     await step1.waitForError();
  126 | 
  127 |     await step1.clickRetry();
  128 |     await step1.waitForLoading();
  129 |     await step1.waitForAddresses();
  130 | 
  131 |     await step1.selectAddress(0);
  132 |     await step1.clickUseAddress();
  133 | 
  134 |     await step2.selectWasteType("general");
  135 |     await step2.clickContinueToStep3();
  136 |     await step2.waitForStep3();
  137 |     await step3.waitForSkips();
  138 |     await step3.selectSkip("8-yard");
  139 |     await step3.clickContinueToStep4();
  140 |     await step3.waitForStep4();
  141 | 
  142 |     // FAIL - wrong postcode expected
  143 |     const reviewData = await step4.getReviewData();
  144 |     expect(reviewData.postcode).toContain("SW1A 1AA");
  145 |   });
  146 | 
  147 |   test("TC005: Plasterboard Flow - Branching logic with options", async ({
  148 |     page,
  149 |   }) => {
  150 |     const { step1, step2, step3, step4 } = createPages(page);
  151 | 
  152 |     await step1.enterPostcode(testData.validPostcodes[0]);
  153 |     await step1.clickLookup();
  154 |     await step1.waitForLoading();
  155 |     await step1.waitForAddresses();
  156 |     await step1.selectAddress(0);
  157 |     await step1.clickUseAddress();
  158 | 
  159 |     await step2.selectWasteType("plasterboard");
  160 | 
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
> 191 |     expect(elapsed).toBeLessThan(500);
      |                     ^ Error: expect(received).toBeLessThan(expected)
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
  261 |     await expect(confirmBtn).toBeEnabled();
  262 | 
  263 |     await step4.waitForSuccess();
  264 |     const bookingId = await step4.getBookingId();
  265 |     expect(bookingId).toMatch("sas");
  266 |   });
  267 | });
  268 | 
```