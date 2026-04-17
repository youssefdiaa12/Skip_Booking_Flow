# Skip Booking System

A QA Assessment project - A multi-step wizard for booking skip (container) rentals in the UK.

## Project Overview

This is a complete booking system with:
- **Frontend**: Multi-step wizard form (Step 1 → Step 4)
- **Backend**: Express.js mock API with deterministic fixtures
- **Testing**: Playwright E2E tests + Newman API tests + Manual tests
- **CI/CD**: GitHub Actions workflows

---

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server
```bash
npm start
```

### 3. Open Browser
```
http://localhost:3000
```

---

## Application Flow

### Step 1: Postcode Lookup
- Enter UK postcode
- System returns addresses (or shows manual entry)
- **Fixtures**: SW1A 1AA (12 addresses), EC1A 1BB (0), M1 1AE (2s delay), BS1 4DJ (error)

### Step 2: Waste Type Selection
- **General Waste**: Standard skip pricing
- **HeavyWaste**: Large skips disabled (8-yard+)
- **Plasterboard**: Requires extra option (Separate/Mixed/Bagged)

### Step 3: Skip Selection
- Shows 8 skip sizes (4-yard to 20-yard)
- Pricing varies by waste type
- Some skips disabled based on selection

### Step 4: Review & Confirm
- Price breakdown (skip + VAT)
- Confirm booking → Get Booking ID

---

## API Endpoints

| Method | Endpoint | Description | Request Body |
|--------|-----------|-------------|--------------|
| POST | `/api/postcode/lookup` | Lookup addresses | `{"postcode": "SW1A 1AA"}` |
| POST | `/api/waste-types` | Submit waste type | `{"heavyWaste": false, "plasterboard": true, "plasterboardOption": "separate"}` |
| GET | `/api/skips` | Get skips | `?postcode=SW1A1AA&heavyWaste=true` |
| POST | `/api/booking/confirm` | Confirm booking | `{"postcode": "SW1A 1AA", "addressId": "addr_1", "skipSize": "4-yard", "price": 120}` |

### API Response Examples

```json
// POST /api/postcode/lookup
{"postcode": "SW1A 1AA", "addresses": [{"id": "addr_1", "line1": "10 Downing Street", "city": "London"}]}

// GET /api/skips
{"skips": [{"size": "4-yard", "price": 120, "disabled": false}]}

// POST /api/booking/confirm
{"status": "success", "bookingId": "BK-ABC123"}
```

---

## Running Tests

### Playwright E2E Tests (Frontend)
```bash
# Install dependencies (first time)
npm install

# Install Playwright browsers
npx playwright install chromium

# Start server in background
npm start &

# Run tests
npm test

# Run with visible browser
npm run test:headed

# Run with Playwright UI
npm run test:ui
```

### Newman API Tests (Backend)
```bash
# Install Newman
npm install -g newman

# Start server
npm start &

# Run API tests
newman run API/collection.json --environment API/environment.json

# With HTML report
newman run API/collection.json --environment API/environment.json --reporters cli,html --reporter-html-export newman-report.html
```

---

## GitHub Actions (CI/CD)

On every push to `main`, two workflows run:

### 1. Playwright Tests
Location: `.github/workflows/playwright.yml`
- Installs dependencies
- Runs E2E tests
- Generates HTML report
- Uploads as artifact

### 2. Newman API Tests  
Location: `.github/workflows/newman.yml`
- Starts server
- Runs API tests
- Generates report
- Uploads as artifact

### View Reports
After workflow completes, check **Actions** tab → **Artifacts**

---

## Important Files

### Core Application
| File | Purpose |
|------|---------|
| `server.js` | Express backend - all API endpoints |
| `public/index.html` | Frontend - complete wizard UI + JS |

### Testing
| File | Purpose |
|------|---------|
| `automation/tests/booking.spec.ts` | Playwright E2E tests (8 test cases) |
| `automation/pages/Step1/` | Page Object Model - Step 1 |
| `automation/pages/Step2/` | Page Object Model - Step 2 |
| `automation/pages/Step3/` | Page Object Model - Step 3 |
| `automation/pages/Step4/` | Page Object Model - Step 4 |
| `automation/fixtures/testData.ts` | Test data & fixtures |
| `API/collection.json` | Newman Postman collection |

### Documentation
| File | Purpose |
|------|---------|
| `manual-tests.md` | 47 manual test cases |
| `bug-reports.md` | 4 bugs with reproduction steps |
| `API/README.md` | API testing guide |

### CI/CD
| File | Purpose |
|------|---------|
| `.github/workflows/playwright.yml` | Playwright workflow |
| `.github/workflows/newman.yml` | Newman workflow |
| `.github/workflows/sonar.yml` | SonarQube static analysis |
| `sonar-project.properties` | SonarQube configuration |

---

## Known Bugs (for testing)

| Bug ID | Description | How to Reproduce |
|--------|-------------|------------------|
| BUG-001 | Button shows "Processing..." but is still clickable | Click Confirm, then click again within 3 seconds |
| BUG-002 | BS1 4DJ always succeeds | Enter BS1 4DJ - always returns addresses (should fail!) |
| BUG-003 | Empty manual address allowed | Enter EC1A 1BB, leave address empty, click Continue |
| BUG-004 | Skip selection persists when changing waste type | Select General → 4-yard, back, change to Heavy, continue - old selection shows |

---

## Deterministic Fixtures (Test Data)

### Postcode Fixtures
| Postcode | Addresses | Behavior |
|----------|-----------|----------|
| SW1A 1AA | 12 | Success |
| EC1A 1BB | 0 | Empty state |
| M1 1AE | 1 | 2 second delay |
| BS1 4DJ | 1 | Always succeeds (bug!) |

### Skip Pricing by Waste Type
| Size | General | Heavy | Plasterboard |
|------|---------|-------|-------------|
| 4-yard | £120 | £150 | £130 |
| 6-yard | £180 | £210 | £190 |
| 8-yard | £240 | £280 (disabled!) | £250 |
| 10-yard | £300 | £350 (disabled!) | £310 |
| 12-yard | £360 | £410 (disabled!) | £370 |
| 14-yard | £420 | £470 (disabled!) | £430 (disabled!) |
| 16-yard | £480 | £530 (disabled!) | £490 (disabled!) |
| 20-yard | £600 | £650 (disabled!) | £610 (disabled!) |

---

## Project Structure

```
.
├── server.js                  # Express API server
├── public/
│   └── index.html            # Frontend (HTML+CSS+JS)
├── API/
│   ├── collection.json       # Postman collection
│   ├── environment.json     # Environment variables
│   └── README.md            # API testing docs
├── automation/
│   ├── pages/               # Page Object Model
│   │   ├── Step1/           # Step 1 POM
│   │   ├── Step2/           # Step 2 POM
│   │   ├── Step3/           # Step 3 POM
│   │   └── Step4/            # Step 4 POM
│   ├── fixtures/
│   │   └── testData.ts      # Test data
│   ├── tests/
│   │   └── booking.spec.ts  # Playwright tests
│   └── playwright.config.js
├── .github/
│   └── workflows/
│       ├── playwright.yml   # CI: Playwright
│       └── newman.yml      # CI: Newman
├── manual-tests.md         # Manual test cases
├── bug-reports.md           # Bug documentation
└── package.json            # Dependencies
```

---

## Troubleshooting

### Server won't start?
```bash
# Kill existing process
powershell -Command "Get-NetTCPConnection -LocalPort 3000 | Stop-Process -Force"
npm start
```

### Playwright tests fail?
```bash
# Install browsers
npx playwright install chromium

# Start server first
npm start
```

### Newman tests fail?
```bash
# Server must be running
npm start

# Then run tests
newman run API/collection.json --environment API/environment.json
```

---

## SonarQube Static Analysis

### What is SonarQube?
SonarQube is a code quality and security tool that performs static analysis on your code to:
- **Detect Bugs** - Find potential bugs and issues
- **Code Smells** - Identify code that is hard to maintain
- **Security Vulnerabilities** - Highlight security risks
- **Coverage** - Track test coverage (when configured)
- **Technical Debt** - Measure how much technical debt exists

### When is SonarQube Triggered?
SonarQube runs automatically on:
1. **Every Push** to the repository
2. **Every Pull Request** to any branch

### Workflow Location
`.github/workflows/sonar.yml`

```yaml
name: SonarQube Static Analysis

on: [push, pull_request]

jobs:
  sonarqube:
    name: SonarQube
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v4
      - name: SonarQube Scan
        uses: SonarSource/sonarqube-scan-action@v6
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_QUABE }}
```

### SonarQube Configuration
File: `sonar-project.properties`

```properties
sonar.projectKey=youssefdiaa12_Skip_Booking_Flow
sonar.organization=youssefdiaa12

sonar.sources=.
sonar.exclusions=node_modules/**,dist/**,test-results/**
sonar.sourceEncoding=UTF-8
```

### What Gets Analyzed
| Language | Analyzer Used |
|----------|---------------|
| JavaScript/TypeScript | SonarJS |
| HTML/CSS | Web backend |

### Files Excluded from Analysis
- `node_modules/` - Dependencies
- `dist/` - Build outputs
- `test-results/` - Test reports

### Viewing SonarQube Results
1. Go to SonarQube cloud dashboard: https://sonarsource.com
2. Or configure local SonarQube instance
3. View Quality Gates, Bugs, Code Smells

### Benefits of SonarQube in CI/CD
- **Early Detection** - Find issues before production
- **Quality Gates** - Block commits that affect the quality
- **Historical Tracking** - See quality trends over time
- **Security Scanning** - Detect vulnerabilities automatically
- **Technical Debt Metrics** - Measure codebase maintainability