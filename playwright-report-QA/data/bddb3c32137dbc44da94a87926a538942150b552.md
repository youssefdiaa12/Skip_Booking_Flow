# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: booking.spec.ts >> Skip Booking System - E2E Tests >> TC003: EC1A 1BB - Empty state with manual entry
- Location: automation\tests\booking.spec.ts:90:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: "Different Address"
Received: "123 Test Street, London"
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
    - heading "Review Your Booking" [level=2] [ref=e18]
    - generic [ref=e19]:
      - generic [ref=e20]:
        - generic [ref=e21]: "Postcode:"
        - generic [ref=e22]: EC1A 1BB
      - generic [ref=e23]:
        - generic [ref=e24]: "Address:"
        - generic [ref=e25]: 123 Test Street, London
      - generic [ref=e26]:
        - generic [ref=e27]: "Waste Type:"
        - generic [ref=e28]: General Waste
      - generic [ref=e29]:
        - generic [ref=e30]: "Skip Size:"
        - generic [ref=e31]: 6-yard
    - generic [ref=e32]:
      - generic [ref=e33]:
        - generic [ref=e34]: "Skip Rental:"
        - generic [ref=e35]: £180
      - generic [ref=e36]:
        - generic [ref=e37]: "VAT (20%):"
        - generic [ref=e38]: £36.00
      - generic [ref=e39]:
        - generic [ref=e40]: "Total:"
        - generic [ref=e41]: £216.00
    - generic [ref=e42]:
      - button "Back" [ref=e43] [cursor=pointer]
      - button "Confirm Booking" [ref=e44] [cursor=pointer]
```

# Test source

```ts
  12  |     step3: new Step3Page(page),
  13  |     step4: new Step4Page(page),
  14  |   };
  15  | }
  16  | 
  17  | test.describe("Skip Booking System - E2E Tests", () => {
  18  |   test.beforeEach(async ({ page }) => {
  19  |     await page.goto("http://localhost:3000");
  20  |   });
  21  | 
  22  |   test("TC001: General Waste Flow - Complete booking successfully", async ({
  23  |     page,
  24  |   }) => {
  25  |     const { step1, step2, step3, step4 } = createPages(page);
  26  | 
  27  |     await step1.enterPostcode(testData.validPostcodes[0]);
  28  |     await step1.clickLookup();
  29  |     await step1.waitForLoading();
  30  |     await step1.waitForAddresses();
  31  |     await step1.selectAddress(0);
  32  |     await step1.clickUseAddress();
  33  | 
  34  |     await step2.selectWasteType("general");
  35  |     await step2.clickContinueToStep3();
  36  |     await step2.waitForStep3();
  37  | 
  38  |     await step3.waitForSkips();
  39  |     await step3.selectSkip("4-yard");
  40  |     await step3.clickContinueToStep4();
  41  |     await step3.waitForStep4();
  42  | 
  43  |     const reviewData = await step4.getReviewData();
  44  |     expect(reviewData.postcode).toContain("SW1A 1AA");
  45  |     expect(reviewData.wasteType).toBe("General Waste");
  46  |     expect(reviewData.skipSize).toContain("8-yard"); // FAIL - expected 4-yard
  47  | 
  48  |     await step4.clickConfirm();
  49  |     await step4.waitForSuccess();
  50  | 
  51  |     const bookingId = await step4.getBookingId();
  52  |     expect(bookingId).toMatch(/^BK-[A-Z0-9]+$/);
  53  |   });
  54  | 
  55  |   test("TC002: Heavy Waste Flow - Verify large skips disabled", async ({
  56  |     page,
  57  |   }) => {
  58  |     const { step1, step2, step3, step4 } = createPages(page);
  59  | 
  60  |     await step1.enterPostcode(testData.validPostcodes[0]);
  61  |     await step1.clickLookup();
  62  |     await step1.waitForLoading();
  63  |     await step1.waitForAddresses();
  64  |     await step1.selectAddress(0);
  65  |     await step1.clickUseAddress();
  66  | 
  67  |     await step2.selectWasteType("heavy");
  68  |     await step2.clickContinueToStep3();
  69  |     await step2.waitForStep3();
  70  | 
  71  |     await step3.waitForSkips();
  72  | 
  73  |     // FAIL - 8-yard should be disabled for heavy waste
  74  |     expect(await step3.isSkipDisabled("8-yard")).toBe(false);
  75  | 
  76  |     await step3.selectSkip("4-yard");
  77  |     await step3.clickContinueToStep4();
  78  |     await step3.waitForStep4();
  79  | 
  80  |     const reviewData = await step4.getReviewData();
  81  |     expect(reviewData.wasteType).toBe("Heavy Waste");
  82  | 
  83  |     await step4.clickConfirm();
  84  |     await step4.waitForSuccess();
  85  | 
  86  |     const bookingId = await step4.getBookingId();
  87  |     expect(bookingId).toMatch(/^BK-[A-Z0-9]+$/);
  88  |   });
  89  | 
  90  |   test("TC003: EC1A 1BB - Empty state with manual entry", async ({ page }) => {
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
> 112 |     expect(reviewData.address).toBe("Different Address");
      |                                ^ Error: expect(received).toBe(expected) // Object.is equality
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
```