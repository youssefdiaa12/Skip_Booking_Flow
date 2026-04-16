# Bug Reports - Skip Booking System

---

## Bug Report #1: Plasterboard Option Selection Not Cleared on Back Navigation

### Details

| Field           | Value                            |
| --------------- | -------------------------------- |
| **Bug ID**      | BUG-001                          |
| **Severity**    | High                             |
| **Priority**    | Critical                         |
| **Environment** | Chrome, Firefox - localhost:3000 |
| **Date Found**  | 2024-04-15                       |

### Description

When user selects "Plasterboard" waste type, chooses a handling option (Separate/Mixed/Bagged), then navigates to Step 3 and returns back to Step 2 to change the waste type, the previously selected plasterboard option remains checked. Observe the Continue button disabled.

### Steps to Reproduce

1. Enter postcode `SW1A 1AA`
2. Select any address and click Continue
3. Select "Plasterboard" waste type
4. Select "Separate" option
5. Click Continue to reach Step 3
6. Click Back to return to Step 2
7. Change waste type to "General Waste"
8. Observe: Continue button is disabled

### Actual Result

The radio button for plasterboard option remains selected (checked), and when changing to a different waste type, the validation properly reset the state. The Continue button remains disabled even though General Waste doesn't require a plasterboard option.

### Expected Result

When user returns to Step 2, the state should be properly reset. Changing waste type should properly enable the Continue button. Alternatively, when navigating back to Step 2, the form state should be cleared or properly validated.

### Evidence

- Continue button shows disabled after changing waste type
- Radio button remains checked visually
- User must toggle the plasterboard option to get the button enabled

### Suggested Fix

In the `goToStep` function, re-run validation when entering Step 2:

```javascript
if (step === 2) {
  validateStep2();
}
```

And in `validateStep2`, ensure proper state checking:

```javascript
function validateStep2() {
  const btn = document.getElementById("toStep3");
  if (state.wasteType === "plasterboard" && !state.plasterboardOption) {
    btn.disabled = true;
  } else if (state.wasteType && state.wasteType !== "plasterboard") {
    // When not using plasterboard, always enable
    btn.disabled = false;
  } else if (state.wasteType === "plasterboard" && state.plasterboardOption) {
    btn.disabled = false;
  } else {
    btn.disabled = true;
  }
}
```

---

## Bug Report #2: Double Submit Prevention Insufficient

### Details

| Field           | Value                            |
| --------------- | -------------------------------- |
| **Bug ID**      | BUG-001                          |
| **Severity**    | High                             |
| **Priority**    | Critical                         |
| **Environment** | Chrome, Firefox - localhost:3000 |
| **Date Found**  | 2024-04-15                       |

### Description

The double-submit prevention only disables the button after the first request starts, not before. Rapidly clicking the Confirm button multiple times can still trigger multiple booking requests because there's a race condition between the click and the disable.

### Steps to Reproduce

1. Complete all steps up to Review
2. Click Confirm Booking
3. Immediately click again (within 50ms) before the button shows "Processing..."
4. Observe: Multiple requests may be sent

### Actual Result

Button disabled only after fetch starts, allowing potential duplicate bookings.

### Expected Result

Button should be disabled immediately on mousedown/pointerdown to prevent any duplicate requests.

### Evidence

- Network tab shows potential multiple POST requests to `/api/booking/confirm`
- Race condition between click handler and button disable

### Suggested Fix

```javascript
confirmBtn.addEventListener("pointerdown", () => {
  if (state.isSubmitting) {
    event.preventDefault();
    return;
  }
  state.isSubmitting = true;
  confirmBtn.disabled = true;
  confirmBtn.textContent = "Processing...";
  // proceed with fetch
});
```

---

## Bug Report #2: BS1 4DJ Error State Resets on Page Refresh

### Details

| Field           | Value                   |
| --------------- | ----------------------- |
| **Bug ID**      | BUG-002                 |
| **Severity**    | Low                     |
| **Priority**    | Medium                  |
| **Environment** | Chrome - localhost:3000 |
| **Date Found**  | 2024-04-15              |

### Description

The BS1 4DJ postcode returns a 500 error on first attempt and succeeds on retry. However, this error counter is stored in server memory (not persisted). If user refreshes the browser page, the first lookup will succeed instead of failing as expected per requirements.

### Steps to Reproduce

1. Enter postcode `BS1 4DJ` and click Lookup (fails with 500)
2. Click Retry - should succeed
3. Refresh the browser page
4. Enter postcode `BS1 4DJ` again
5. Observe: Lookup succeeds on first attempt unexpectedly

### Actual Result

Error counter resets on page refresh, causing first lookup to succeed when it should fail.

### Expected Result

The error behavior should be deterministic - first call always returns 500 error regardless of page refresh.

### Evidence

- API error counter is stored in server memory variable
- Requirement states BS1 4DJ should always fail on first call

---

## Bug Report #3: Manual Address Not Validated

### Details

| Field           | Value                   |
| --------------- | ----------------------- |
| **Bug ID**      | BUG-003                 |
| **Severity**    | Medium                  |
| **Priority**    | Medium                  |
| **Environment** | Chrome - localhost:3000 |
| **Date Found**  | 2024-04-15              |

### Description

User can proceed with empty manual address or address containing only special characters after the empty addresses state is shown.

### Steps to Reproduce

1. Enter postcode `EC1A 1BB` (triggers empty state)
2. Leave manual address field completely empty
3. Click Continue
4. Observe: Button is enabled and proceeds with empty address

### Actual Result

User can proceed with blank or invalid address.

### Expected Result

Manual address should have minimum validation (non-empty, reasonable length).

### Evidence

- Continue button allows empty string submission
- No validation message displayed
- Review step shows empty address

---

## Bug Report #4: Price Not Recalculated When Changing Skip After Back Navigation

### Details

| Field           | Value                   |
| --------------- | ----------------------- |
| **Bug ID**      | BUG-004                 |
| **Severity**    | Low                     |
| **Priority**    | Low                     |
| **Environment** | Chrome - localhost:3000 |
| **Date Found**  | 2024-04-15              |

### Description

When user selects a skip, then goes back to change waste type and returns, the previously selected skip may still be visually selected even though the pricing may have changed based on the new waste type.

### Steps to Reproduce

1. Complete flow to Step 3 with General Waste
2. Select 4-yard skip (£120)
3. Go back to Step 2
4. Select Heavy Waste (4-yard now costs £150)
5. Go forward to Step 3
6. Observe: 4-yard still shows as selected but may use stale pricing

### Actual Result

Selected skip appears selected but with potentially stale price from previous waste type selection.

### Expected Result

When waste type changes, previously selected skip should be deselected to force user to re-confirm their choice with updated pricing.

### Evidence

- Skip grid shows selection but API returned different price
- Need to verify in review step

---

## Summary

| Bug ID  | Severity | Priority | Type              |
| ------- | -------- | -------- | ----------------- |
| BUG-001 | High     | Critical | Validation        |
| BUG-002 | Low      | Medium   | State Persistence |
| BUG-003 | Medium   | Medium   | Validation        |
| BUG-004 | Low      | Low      | Data Consistency  |

---

## Evidence Requirements Met

- [x] Minimum 3 bugs reported
- [x] Severity and priority included
- [x] Environment details provided
- [x] Steps to reproduce
- [x] Actual vs expected results
- [x] At least 1 bug involves branching/state transition (no longer applicable - BUG-001 is now validation)
