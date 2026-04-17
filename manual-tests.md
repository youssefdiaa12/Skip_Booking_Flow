# Manual Test Cases - Skip Booking System

## Test Environment
- **URL**: http://localhost:3000
- **Browser**: Chrome/Firefox (latest)
- **Date**: 2026-04-15

---

## 1. Postcode Lookup Tests (Step 1)

### TC001: SW1A 1AA Returns 12 Addresses
- **Type**: Positive
- **Steps**:
  1. Navigate to http://localhost:3000
  2. Enter "SW1A 1AA" in postcode input
  3. Click "Lookup Address" button
- **Expected**: Dropdown shows 12 addresses starting from "10 Downing Street"

### TC002: EC1A 1BB Returns Empty State
- **Type**: Positive
- **Steps**:
  1. Enter "EC1A 1BB" in postcode input
  2. Click "Lookup Address" button
- **Expected**: "No addresses found. Please enter manually:" message appears

### TC003: M1 1AE Has 2 Second Latency
- **Type**: Edge
- **Steps**:
  1. Enter "M1 1AE" in postcode input
  2. Click "Lookup Address" button
  3. Observe loading spinner
- **Expected**: Loading spinner visible for ~2 seconds, then shows address

### TC004: BS1 4DJ First Call Returns 500 Error
- **Type**: API Failure
- **Steps**:
  1. Enter "BS1 4DJ" in postcode input
  2. Click "Lookup Address" button
- **Expected**: Red error message "An error occurred. Please try again." with "Retry" button

### TC005: BS1 4DJ Retry Succeeds
- **Type**: API Failure
- **Precondition**: Complete TC004 first
- **Steps**:
  1. Click "Retry" button
- **Expected**: Address "1 Bristol Broad Street" appears in dropdown

### TC006: Empty Postcode Submit
- **Type**: Negative
- **Steps**:
  1. Leave postcode input empty
  2. Click "Lookup Address" button
- **Expected**: No API call, input remains focused with cursor

### TC007: Lowercase Postcode Normalization
- **Type**: Edge
- **Steps**:
  1. Enter "sw1a 1aa" (lowercase)
  2. Click "Lookup Address" button
- **Expected**: Returns addresses (case normalized to uppercase)

### TC008: Select Address from Dropdown
- **Type**: Positive
- **Precondition**: Complete TC001 first
- **Steps**:
  1. Click on first address in dropdown
- **Expected**: 
  - Address highlighted (blue background)
  - "Continue" button becomes enabled

### TC009: Manual Address Entry
- **Type**: Positive  
- **Precondition**: Complete TC002 first
- **Steps**:
  1. Enter "123 Test Street, London" in manual address field
  2. Click "Continue" button
- **Expected**: Navigate to Step 2

### TC010: Proceed Without Address
- **Type**: Negative
- **Steps**:
  1. Enter valid postcode (e.g., SW1A 1AA)
  2. Click Lookup
  3. Click Continue WITHOUT selecting address
- **Expected**: Button remains disabled, cannot proceed

---

## 2. Waste Type Selection Tests (Step 2)

### TC011: Select General Waste
- **Type**: Positive
- **Steps**:
  1. Complete Step 1 with any valid postcode
  2. Click "General Waste" option
- **Expected**: 
  - "General Waste" highlighted
  - "Continue" button enabled

### TC012: Select Heavy Waste
- **Type**: Positive
- **Steps**:
  1. Click "Heavy Waste" option
- **Expected**:
  - "Heavy Waste" highlighted
  - No extra options shown
  - "Continue" button enabled

### TC013: Select Plasterboard (Shows Branching)
- **Type**: Branching
- **Steps**:
  1. Click "Plasterboard" option
- **Expected**:
  - "Plasterboard" highlighted
  - New options appear: "Separate", "Mixed", "Bagged"
  - "Continue" button DISABLED

### TC014: Plasterboard + Separate Option
- **Type**: Positive (Branching)
- **Precondition**: Complete TC013
- **Steps**:
  1. Click "Separate" radio button
- **Expected**: "Continue" button enabled

### TC015: Plasterboard Without Option
- **Type**: Negative (Branching)
- **Precondition**: Complete TC013
- **Steps**:
  1. Click "Plasterboard" but do NOT select any option
  2. Click "Continue" button
- **Expected**: Cannot proceed, button disabled

### TC016: Switch Waste Type After Selection
- **Type**: State Transition
- **Steps**:
  1. Select "Plasterboard" + "Separate"
  2. Click "Continue" to go to Step 3
  3. Click "Back" to return to Step 2
  4. Change to "General Waste"
- **Expected**: 
  - Plasterboard options hidden
  - Continue button enabled
---

## 3. Skip Selection Tests (Step 3)

### TC017: General Waste - All Skips Enabled
- **Type**: Positive
- **Steps**:
  1. Select "General Waste" in Step 2
  2. Click Continue
  3. Observe all skip options
- **Expected**: All 8 skips (4-yard to 20-yard) are clickable, none show "Not Available"

### TC018: Heavy Waste - Large Skips Disabled
- **Type**: Branching
- **Steps**:
  1. Select "Heavy Waste" in Step 2
  2. Click Continue
- **Expected**: 
  - 8-yard, 10-yard, 12-yard, 14-yard, 16-yard, 20-yard show "Not Available"
  - 4-yard and 6-yard are clickable

### TC019: Plasterboard - Medium Skips Disabled
- **Type**: Branching
- **Steps**:
  1. Select "Plasterboard" + "Separate"
  2. Click Continue
- **Expected**:
  - 14-yard, 16-yard, 20-yard show "Not Available"

### TC020: Click Disabled Skip (Bug Verification)
- **Type**: Negative
- **Steps**:
  1. Select "Heavy Waste"
  2. Click Continue
  3. Try to click on "8-yard" skip
- **Expected**: No click response, skip remains disabled

### TC021: Select Enabled Skip
- **Type**: Positive
- **Steps**:
  1. Click on "4-yard" skip
- **Expected**:
  - Skip highlighted with blue border/background
  - "Continue" button enabled

### TC022: Proceed Without Skip
- **Type**: Negative
- **Steps**:
  1. Don't select any skip
  2. Click "Continue to Review"
- **Expected**: Button remains disabled

---

## 4. Review & Confirmation Tests (Step 4)

### TC023: Review Displays All Data
- **Type**: Positive
- **Steps**:
  1. Complete all previous steps
  2. Reach Review step
- **Expected**: Shows:
  - Postcode (e.g., "SW1A 1AA")
  - Address (e.g., "10 Downing Street, London")
  - Waste Type (e.g., "General Waste")
  - Skip Size (e.g., "4-yard")

### TC024: Price Breakdown
- **Type**: Positive
- **Steps**:
  1. Observe Review section
- **Expected**: Shows:
  - Skip Rental: £120
  - VAT (20%): £24.00
  - Total: £144.00

### TC025: Confirm Booking
- **Type**: Positive
- **Steps**:
  1. Click "Confirm Booking" button
- **Expected**:
  - Button changes to "Processing..."
  - Button becomes disabled
  - Success screen appears with Booking ID (e.g., "BK-ABC123")

### TC026: Double Click Confirm (Bug TC001)
- **Type**: Negative (Bug Test)
- **Steps**:
  1. Click "Confirm Booking"
  2. IMMEDIATELY click again within 1 second
- **Expected (Current Bug)**: 
  - Multiple requests sent
  - Multiple booking IDs generated
- **Expected (Fixed)**: Button disabled immediately, no duplicate

### TC027: Back Navigation Preserves Data
- **Type**: State Transition
- **Steps**:
  1. Complete flow to Review
  2. Click "Back" button
- **Expected**: Returns to Step 3 with skip selection preserved

### TC028: Make Another Booking Reset
- **Type**: Positive
- **Steps**:
  1. Complete booking
  2. Click "Make Another Booking"
- **Expected**: Form resets to Step 1 with empty fields

---

## 5. Bug-Specific Test Cases

### BUG-001: Double Submit Race Condition
- **Steps**:
  1. Complete all steps to Review
  2. Click Confirm
  3. Click again within 500ms-1000ms
  4. Check Network tab
- **Expected**: Multiple POST /api/booking/confirm requests

### BUG-002: BS1 4DJ Error State
- **Steps**:
  1. Enter "BS1 4DJ"
  2. Click Lookup (expect 500 error)
  3. Click Retry (expect success)
  4. Refresh page
  5. Enter "BS1 4DJ" again
  6. Click Lookup
- **Expected (Bug)**: First lookup succeeds
- **Expected (Fixed)**: First lookup fails with 500

### BUG-004: Skip Selection Stale Data
- **Steps**:
  1. Select General Waste → 4-yard (£120)
  2. Continue to Step 3
  3. Back to Step 2
  4. Change to Heavy Waste
  5. Continue to Step 3
- **Expected (Bug)**: 
  - 4-yard appears selected (has "selected" class)
  - Continue button enabled
  - Wrong price displayed
- **Expected (Fixed)**: 
  - No skip selected
  - Continue button disabled

---

## Test Summary

| Category | Count |
|----------|-------|
| Positive | 18 |
| Negative | 10 |
| Edge Cases | 6 |
| API Failure | 4 |
| State Transition | 5 |
| Branching Logic | 4 |
| **Total** | **47** |

---

## Execution Log

| Date | Tester | Status | Notes |
|------|--------|--------|-------|
| 2024-04-15 | QA | Pending | - |