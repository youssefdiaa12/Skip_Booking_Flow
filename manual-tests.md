# Manual Test Cases - Skip Booking System

## Test Environment

- **URL**: http://localhost:3000
- **Browser**: Chrome/Firefox (latest)
- **Date**: 2024

---

## 1. Postcode Lookup Tests (Step 1)

| ID    | Test Case                                         | Type        | Expected Result                                   |
| ----- | ------------------------------------------------- | ----------- | ------------------------------------------------- |
| TC001 | Enter valid postcode `SW1A 1AA` and click Lookup  | Positive    | Display 12 addresses in dropdown                  |
| TC002 | Enter valid postcode `EC1A 1BB` and click Lookup  | Positive    | Display "No addresses found" and manual entry     |
| TC003 | Enter valid postcode `M1 1AE` and click Lookup    | Edge        | Loading spinner for ~2 seconds, then show address |
| TC004 | Enter postcode `BS1 4DJ` (first attempt)          | API Failure | Display error message with retry button           |
| TC005 | Click Retry after BS1 4DJ error                   | API Failure | Display address successfully                      |
| TC006 | Leave postcode empty and click Lookup             | Negative    | No API call, input remains focused                |
| TC007 | Enter invalid format `123` and click Lookup       | Negative    | Return generic address (fallback)                 |
| TC008 | Enter lowercase `sw1a 1aa`                        | Edge        | Normalize to uppercase, return addresses          |
| TC009 | Enter postcode with extra spaces `SW1A  1AA`      | Edge        | Normalize and return addresses                    |
| TC010 | Select an address from dropdown                   | Positive    | Enable Continue button                            |
| TC011 | Enter address manually when dropdown empty        | Positive    | Enable Continue button with manual address        |
| TC012 | Click Continue without selecting/entering address | Negative    | Button remains disabled                           |

---

## 2. Waste Type Selection Tests (Step 2)

| ID    | Test Case                                   | Type             | Expected Result                                            |
| ----- | ------------------------------------------- | ---------------- | ---------------------------------------------------------- |
| TC013 | Select "General Waste"                      | Positive         | Enable Continue button                                     |
| TC014 | Select "Heavy Waste"                        | Positive         | Enable Continue button, no extra options shown             |
| TC015 | Select "Plasterboard"                       | Branching        | Show plasterboard handling options (Separate/Mixed/Bagged) |
| TC016 | Select Plasterboard without choosing option | Negative         | Continue button remains disabled                           |
| TC017 | Select Plasterboard + "Separate"            | Positive         | Enable Continue button                                     |
| TC018 | Select Plasterboard + "Mixed"               | Positive         | Enable Continue button                                     |
| TC019 | Select Plasterboard + "Bagged"              | Positive         | Enable Continue button                                     |
| TC020 | Switch from Plasterboard to General Waste   | State Transition | Hide plasterboard options, enable Continue                 |
| TC021 | Click Continue with General Waste selected  | State Transition | Navigate to Step 3                                         |
| TC022 | Click Back from Step 2                      | State Transition | Return to Step 1 with previous selections preserved        |

---

## 3. Skip Selection Tests (Step 3)

| ID    | Test Case                                          | Type             | Expected Result                             |
| ----- | -------------------------------------------------- | ---------------- | ------------------------------------------- |
| TC023 | Select General Waste, verify all skips enabled     | Positive         | All 8 skip options are clickable            |
| TC024 | Select Heavy Waste, verify large skips disabled    | Branching        | 8-yard and above show "Not Available"       |
| TC025 | Select Plasterboard, verify medium skips disabled  | Branching        | 14-yard and above show "Not Available"      |
| TC026 | Click on disabled skip (Heavy Waste path)          | Negative         | No selection, skip remains disabled         |
| TC027 | Select an enabled skip                             | Positive         | Highlight selected skip, enable Continue    |
| TC028 | Click Continue without selecting skip              | Negative         | Continue button remains disabled            |
| TC029 | Change waste type from Step 3 (back and re-select) | State Transition | Skip options update based on new waste type |
| TC030 | Verify skip prices are displayed                   | Positive         | Each skip shows price (e.g., "£120")        |

---

## 4. Review & Confirmation Tests (Step 4)

| ID    | Test Case                                 | Type             | Expected Result                                         |
| ----- | ----------------------------------------- | ---------------- | ------------------------------------------------------- |
| TC031 | Complete flow to Review step              | Positive         | Display postcode, address, waste type, skip size        |
| TC032 | Verify price breakdown shows              | Positive         | Show Skip Rental, VAT (20%), and Total                  |
| TC033 | Verify total calculates correctly         | Positive         | Total = Price + VAT                                     |
| TC034 | Click Confirm Booking                     | Positive         | Show loading, then success with Booking ID              |
| TC035 | Double-click Confirm button               | Negative         | Button disabled during submission, no duplicate booking |
| TC036 | Click Back from Review                    | State Transition | Return to Step 3 with selection preserved               |
| TC037 | Verify "Make Another Booking" resets form | Positive         | Return to Step 1 with empty fields                      |

---

## 5. Edge Cases

| ID    | Test Case                                  | Type        | Expected Result                               |
| ----- | ------------------------------------------ | ----------- | --------------------------------------------- |
| TC038 | Refresh page mid-flow                      | Edge        | Form resets to Step 1                         |
| TC039 | Enter very long postcode string            | Edge        | Input handles gracefully, truncates if needed |
| TC040 | Network timeout on skip load               | API Failure | Show error with retry option                  |
| TC041 | Verify mobile responsiveness               | Edge        | Form usable on 375px width viewport           |
| TC042 | Tab navigation through form                | Edge        | Logical focus order between fields            |
| TC043 | Enter special characters in manual address | Edge        | Accept and display correctly                  |

---

## 6. State Transition Summary

| ID    | From Step | To Step  | Trigger                           | Expected                          |
| ----- | --------- | -------- | --------------------------------- | --------------------------------- |
| ST001 | 1         | 2        | Valid postcode + address selected | Step 2 visible                    |
| ST002 | 2         | 3        | Valid waste type selected         | Skips load based on waste type    |
| ST003 | 3         | 4        | Skip selected                     | Review shows all data             |
| ST004 | 4         | Success  | Confirm Booking                   | Success card with Booking ID      |
| ST005 | Any       | Previous | Back button                       | Previous step with data preserved |

---

## Test Summary

| Category               | Count  |
| ---------------------- | ------ |
| Positive Tests         | 18     |
| Negative Tests         | 10     |
| Edge Cases             | 6      |
| API Failure Tests      | 4      |
| State Transition Tests | 5      |
| Branching Logic Tests  | 4      |
| **Total**              | **43** |

---

## Execution Log

| Date       | Tester | Status  | Notes |
| ---------- | ------ | ------- | ----- |
| 2024-04-15 | QA     | Pending | -     |
