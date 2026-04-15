# Skip Booking System - Server Code Explanation

This document explains the server.js file line by line.

## Line 1-3: Import Modules

```javascript
const express = require("express");
const cors = require("cors");
const path = require("path");
```

- **express**: A web framework for Node.js to create the server and API routes
- **cors**: Middleware that allows cross-origin requests (needed when frontend and backend are on different ports)
- **path**: Built-in Node.js module for handling file paths

---

## Line 5-6: Initialize Express App

```javascript
const app = express();
const PORT = process.env.PORT || 3000;
```

- Creates the Express application instance
- Defines the port: uses environment variable `PORT` if set, otherwise defaults to 3000

---

## Line 8-10: Middleware Setup

```javascript
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
```

- **cors()**: Enables Cross-Origin Resource Sharing
- **express.json()**: Parses incoming JSON requests (needed for POST request bodies)
- **express.static("public")**: Serves static files from the "public" folder (HTML, CSS, JS)

---

## Line 12-34: Address Fixtures (Test Data)

```javascript
const addressFixtures = {
  "SW1A 1AA": [
    { id: "addr_1", line1: "10 Downing Street", city: "London" },
    // ... 12 addresses total
  ],
  "EC1A 1BB": [], // Empty array - returns no addresses
  "M1 1AE": [
    { id: "addr_m1_1", line1: "1 Piccadilly Gardens", city: "Manchester" },
  ],
  "BS1 4DJ": [
    { id: "addr_bs1_1", line1: "1 Bristol Broad Street", city: "Bristol" },
  ],
};
```

This object stores test data for different postcodes. Each postcode maps to an array of addresses.

---

## Line 36: Error Counter for BS1 4DJ

```javascript
let bs1ErrorCount = 0;
```

Tracks how many times BS1 4DJ has been requested (first call returns 500 error, second succeeds)

---

## Line 38-69: Skip Fixtures

```javascript
const skipFixtures = {
  default: [
    { size: "4-yard", price: 120, disabled: false },
    // ... 8 skip sizes, all enabled
  ],
  heavyWaste: [
    // Large skips disabled (8-yard and above)
  ],
  plasterboard: [
    // Medium/large skips disabled (14-yard and above)
  ],
};
```

Contains skip options based on waste type. The `disabled: true` makes certain skip sizes unavailable.

---

## Line 71-73: Helper Function - Normalize Postcode

```javascript
function normalizePostcode(postcode) {
  return postcode.replace(/\s/g, "").toUpperCase();
}
```

Removes spaces and converts to uppercase. This allows "SW1A1AA" and "SW1A 1AA" to match the same fixture.

---

## Line 75-77: Helper Function - Delay

````javascript
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

Creates a delay (in milliseconds) to simulate slow network responses (used for M1 1AE).

---

## Line 79-131: POST /api/postcode/lookup

```javascript
app.post("/api/postcode/lookup", async (req, res) => {
  const { postcode } = req.body;
  const normalized = normalizePostcode(postcode);
  await delay(500);

  if (normalized === "SW1A1AA") {
    return res.json({
      postcode: postcode,
      addresses: addressFixtures["SW1A 1AA"],
    });
  }
  // ... other postcodes
});
````

**What it does:**

1. Extracts postcode from request body
2. Normalizes it (removes spaces, uppercases)
3. Adds 500ms delay
4. Returns addresses based on postcode:
   - SW1A 1AA → 12 addresses
   - EC1A 1BB → empty array
   - M1 1AE → 2 second delay
   - BS1 4DJ → 500 error on first call, then works

---

## Line 133-135: POST /api/waste-types

```javascript
app.post("/api/waste-types", (req, res) => {
  res.json({ ok: true });
});
```

Simple endpoint that acknowledges waste type submission (not really used in this implementation).

---

## Line 137-149: GET /api/skips

```javascript
app.get("/api/skips", (req, res) => {
  const { postcode, heavyWaste, plasterboard } = req.query;

  let skips = skipFixtures.default;

  if (heavyWaste === "true") {
    skips = skipFixtures.heavyWaste;
  } else if (plasterboard === "true") {
    skips = skipFixtures.plasterboard;
  }

  res.json({ skips });
});
```

**What it does:**

1. Reads query parameters from URL
2. Returns appropriate skip list based on waste type
3. heavyWaste disables large skips
4. plasterboard disables medium/large skips

---

## Line 151-155: POST /api/booking/confirm

```javascript
app.post("/api/booking/confirm", (req, res) => {
  const bookingId =
    "BK-" + Math.random().toString(36).substr(2, 9).toUpperCase();
  res.json({ status: "success", bookingId });
});
```

Generates a random booking ID like "BK-XYZ123" and returns success.

---

## Line 157-159: Catch-All Route

```javascript
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
```

Any GET request that doesn't match an API route serves the frontend HTML.

---

## Line 161-163: Start Server

```javascript
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

Starts the HTTP server and logs the URL.
