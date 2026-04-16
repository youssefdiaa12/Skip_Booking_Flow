# API Tests - Postman Collection

This folder contains the Postman collection and environment for API testing.

## Prerequisites

- Node.js
- Newman (`npm install -g newman`)

## Running Tests Locally

```bash
# Start the server first
npm start

# Run API tests
newman run api/collection.json --environment api/environment.json
```

## Collection Contents

| Endpoint | Description |
|----------|-------------|
| POST `/api/postcode/lookup` | Postcode lookup with deterministic fixtures |
| POST `/api/waste-types` | Submit waste type selection |
| GET `/api/skips` | Get available skips based on waste type |
| POST `/api/booking/confirm` | Confirm booking |

## Test Fixtures

| Postcode | Behavior |
|----------|----------|
| SW1A 1AA | Returns 12 addresses |
| EC1A 1BB | Returns 0 addresses (empty state) |
| M1 1AE | 2 second delay (latency test) |
| BS1 4DJ | 500 error (first call), success (retry) |

## Run with HTML Report

```bash
newman run api/collection.json \
  --environment api/environment.json \
  --reporters cli,html \
  --reporter-html-export newman-report.html
```