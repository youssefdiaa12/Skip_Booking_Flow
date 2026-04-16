# Automation Tests - Playwright with POM

This document explains the automation setup and how to execute tests.

## Project Structure

```
automation/
├── config/
│   └── (future config files)
├── pages/
│   └── BookingPage.js    # Page Object Model - all page selectors & methods
├── tests/
│   └── booking.spec.js  # Test cases using the BookingPage
├── playwright.config.js # Playwright configuration
└── README.md            # This file
```

## Page Object Model (POM) Design

The automation follows the Page Object Model pattern:

### BookingPage.js

Contains all selectors and methods for interacting with the booking form:

**Selectors (lines 8-50):**

- Step 1: postcodeInput, lookupBtn, addressList, addressItems, etc.
- Step 2: wasteOptions, generalWasteOption, heavyWasteOption, plasterboardOption
- Step 3: skipGrid, skipOptions, skipsLoading
- Step 4: reviewPostcode, reviewAddress, confirmBtn, etc.

**Methods:**

- `goto()` - Navigate to the application
- `enterPostcode()`, `clickLookup()` - Step 1 actions
- `selectWasteType()`, `selectPlasterboardOption()` - Step 2 actions
- `selectSkip()`, `isSkipDisabled()` - Step 3 actions
- `getReviewData()`, `clickConfirm()` - Step 4 actions
- `waitForSuccess()`, `getBookingId()` - Success verification

### Test Strategy

**8 E2E Tests implemented:**

1. **TC001: General Waste Flow** - Complete booking with valid postcode
2. **TC002: Heavy Waste Flow** - Verify large skips are disabled for heavy waste
3. **TC003: EC1A 1BB Empty State** - Manual entry when no addresses found
4. **TC004: BS1 4DJ Error/Retry** - API error handling
5. **TC005: Plasterboard Flow** - Branching logic with extra options
6. **TC006: M1 1AE Latency** - Loading state simulation
7. **TC007: Back Navigation** - State preservation
8. **TC008: Double Submit** - Prevention verification

## Running the Tests

### Prerequisites

1. Install dependencies:

```bash
npm install
```

2. Ensure server is running on port 3000:

```bash
npm start
```

### Test Commands

**Run all tests (headless - default):**

```bash
npm test
```

**Run tests with visible browser (headed mode):**

```bash
npm run test:headed
```

**Run tests with Playwright UI:**

```bash
npm run test:ui
```

**Run specific test:**

```bash
npx playwright test booking.spec.js:12 --headed
```

**Run with detailed output:**

```bash
npx playwright test --reporter=list --headed
```

## Configuration

The `playwright.config.js` contains:

- `baseURL`: http://localhost:3000
- `timeout`: 30 seconds per test
- `reporter`: list (console output)
- `projects`: chromium (Chrome browser)
- `trace`: on-first-retry (for debugging)
- `screenshot`: only-on-failure

## Mock/Test Data Strategy

The tests use deterministic fixtures:

| Postcode | Behavior            | Test Used                  |
| -------- | ------------------- | -------------------------- |
| SW1A 1AA | 12 addresses        | TC001, TC002, TC005, TC007 |
| EC1A 1BB | 0 addresses         | TC003                      |
| BS1 4DJ  | 500 error → success | TC004                      |
| M1 1AE   | 2s latency          | TC006                      |

**Skip prices by waste type:**

- General Waste: 4-yard = £120
- Heavy Waste: 4-yard = £150 (larger skips disabled)
- Plasterboard: 4-yard = £130 (medium/large skips disabled)

## Assertions

Each test includes assertions at each step:

- Postcode lookup: address count verification
- Waste type: correct option selected
- Skip selection: disabled/enabled states verified
- Review: price breakdown (price + 20% VAT)
- Success: booking ID format (BK-XXXXXXXX)

## Debugging Failed Tests

1. **Screenshots**: Automatically captured on failure
2. **Traces**: Available in `playwright-report/trace`
3. **Videos**: Retained on failure in test-results/

Run with UI to see live execution:

```bash
npm run test:ui
```

## Expected Results

```
Running 8 tests using 1 worker

  ✓ TC001: General Waste Flow (4.1s)
  ✓ TC002: Heavy Waste Flow (2.7s)
  ✓ TC003: EC1A 1BB Empty State (2.9s)
  ✓ TC004: BS1 4DJ Error/Retry (varies)
  ✓ TC005: Plasterboard Flow (7.0s)
  ✓ TC006: M1 1AE Latency (5.2s)
  ✓ TC007: Back Navigation (2.1s)
  ✓ TC008: Double Submit (varies)

  8 passed
```
