# Skip Booking System

A QA Assessment project - A multi-step wizard for booking skip (container) rentals in the UK.

## Features

- UK postcode lookup with deterministic fixtures
- Multi-path waste type selection (General, Heavy, Plasterboard)
- Skip size selection with disabled states based on waste type
- Price breakdown with VAT
- Loading, empty, and error state handling
- Booking confirmation with double-submit prevention

## Prerequisites

- Node.js (v14 or higher)
- npm

## Installation

```bash
npm install
```

## Running the Application

```bash
npm start
```

The application will be available at `http://localhost:3000`

## API Endpoints

| Method | Endpoint               | Description                                                            |
| ------ | ---------------------- | ---------------------------------------------------------------------- |
| POST   | `/api/postcode/lookup` | Lookup addresses by postcode                                           |
| POST   | `/api/waste-types`     | Submit waste type selection                                            |
| GET    | `/api/skips`           | Get available skips (query params: postcode, heavyWaste, plasterboard) |
| POST   | `/api/booking/confirm` | Confirm booking                                                        |

## Deterministic Fixtures

| Postcode   | Behavior                                  |
| ---------- | ----------------------------------------- |
| `SW1A 1AA` | Returns 12 addresses                      |
| `EC1A 1BB` | Returns 0 addresses (empty state)         |
| `M1 1AE`   | Simulated latency (2s delay)              |
| `BS1 4DJ`  | 500 error on first call, success on retry |

## Testing

Manual test cases are documented in `manual-tests.md`

Automation tests are in the `automation/` directory

## Project Structure

```
.
├── server.js          # Express backend with mock API
├── public/
│   └── index.html    # Frontend HTML/CSS/JS
├── automation/       # E2E tests
├── manual-tests.md    # Manual test documentation
├── bug-reports.md    # Bug reports
├── package.json      # Dependencies
└── README.md         # This file
```
