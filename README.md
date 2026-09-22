# Playwright Test Framework

A **TypeScript-based test automation framework** built on [Playwright](https://playwright.dev/), following the **Page Object Model (POM)** pattern. It covers UI automation (Amazon, DuckDuckGo, MakeMyTrip, Naukri), Playwright's native API testing, and Excel-driven data tests, and runs on a daily schedule via GitHub Actions.

---

## Project Structure

```
Playwright_Test/
├── pages/                              # Page Object Model (POM) layer
│   ├── BasePage.ts                     # Base class shared by all page objects; re-exports `expect`/`Page`
│   ├── app.ts                          # Page factory — createPages(page) builds every page object at once
│   ├── GooglePage.ts                   # Google search actions & assertions
│   ├── DuckduckgoPage.ts               # DuckDuckGo search actions & assertions
│   ├── amazonPage.ts                   # Amazon search, product & Apple Store flows
│   ├── MakemytripPage.ts               # MakeMyTrip flight/hotel search flows
│   └── NaukariPage.ts                  # Naukri login & resume upload flow
│
├── data/                                # Test data layer
│   ├── urls.ts                          # Application URLs
│   ├── userData.ts                      # Search terms / expected text used across suites
│   ├── amazonData.ts                    # Amazon-specific test data
│   ├── index.ts                         # Aggregates everything into a single `testData` export
│   ├── SagarDurgade_SDET_8years.pdf     # Sample resume used by the Naukri upload test
│   └── userExcelDataFile.xlsx           # Sample Excel data used by the Excel test
│
├── utils/                               # Reusable utility helpers
│   ├── excel.utils.ts                   # `readAndwrightExcel` — read/write/verify Excel via ExcelJS
│   ├── getDateTime.ts                   # `GetDateTime` — current time helpers wrapped in `test.step`
│   └── utilities.ts                     # Singleton exports: `excel`, `dateTime`
│
├── tests/
│   ├── UI/
│   │   ├── amazon.test.ts                     # Amazon search → product page → new tab → Apple Store flow
│   │   ├── browserWithoutFixxture.spec.ts      # Launches Chromium manually, without Playwright's built-in fixtures
│   │   ├── findLinkinByDuckduckGo.test.ts      # DuckDuckGo search for a LinkedIn profile (runs on `msedge` channel)
│   │   ├── makemytripFlightSearch.test.ts      # MakeMyTrip flight/hotel E2E specs (currently commented out)
│   │   ├── popUp.spec.ts                       # Handles JS alert/confirm/prompt dialogs
│   │   ├── readAndWriteExcel.spec.ts           # Reads credentials from an Excel file and logs in
│   │   ├── stroageState.spec.ts                # Notes/snippet for saving auth storage state (commented out)
│   │   ├── uploadResumeToNaukri.spec.ts        # Naukri login + resume upload, credentials from `.env`
│   │   └── notAutomated/                       # Draft/pending specs not part of the active run
│   └── API/
│       └── apiFirst.spec.ts             # GET/POST requests against the Conduit API using Playwright's `request` fixture
│
├── .github/workflows/playwright.yml     # CI: scheduled + manual test runs, uploads logs/reports as artifacts
├── .env / .env.example                  # Local secrets (gitignored) / template for required env vars
├── playwright.config.ts                 # Playwright configuration (loads `.env` via `dotenv/config`)
├── tsconfig.json                        # TypeScript compiler options
└── package.json                         # Dependencies and npm scripts
```

---

## Architecture Overview

### 1. `pages/` — Page Object Model

All UI interactions are encapsulated in page classes that extend `BasePage`.

| File | Responsibility |
|---|---|
| `BasePage.ts` | Holds the `Page` instance and re-exports `expect`/`Page` from Playwright |
| `app.ts` | Factory function `createPages(page)` that returns all page objects in one call |
| `GooglePage.ts` | Locators/methods for Google search |
| `DuckduckgoPage.ts` | Locators/methods for DuckDuckGo search and result verification |
| `amazonPage.ts` | Amazon search, department selection, product page, Apple Store cross-tab flow |
| `MakemytripPage.ts` | One-way/round-trip flight search and hotel search flows |
| `NaukariPage.ts` | Login and resume upload (`#attachCV` file input + "Update resume" submit) |

**Usage in a test:**
```typescript
const pages = createPages(page)
await pages.naukari.login(process.env.NAUKRI_EMAIL!, process.env.NAUKRI_PASSWORD!)
await pages.naukari.updateResume('data/SagarDurgade_SDET_8years.pdf')
```

---

### 2. `data/` — Test Data Layer

All test data is centralized and imported via a single `testData` object.

| File | Contents |
|---|---|
| `urls.ts` | Base URLs (DuckDuckGo, MakeMyTrip, Amazon, Naukri) |
| `userData.ts` | Search terms, expected text, MakeMyTrip cities/URL patterns |
| `amazonData.ts` | Amazon department, product search term, Apple Watch labels |
| `index.ts` | Exports `{ urls, userData, amazonData }` as `testData` |

**Usage in a test:**
```typescript
import { testData } from '../../data/index'

await page.goto(testData.urls.duckduckgoUrl)
await pages.duckduckgo.searchText(testData.userData.searchData)
```

---

### 3. `utils/` — Utility Helpers

| File | Class / Export | Purpose |
|---|---|---|
| `excel.utils.ts` | `readAndwrightExcel` | Read, write, and verify Excel files using **ExcelJS** |
| `getDateTime.ts` | `GetDateTime` | Current time helpers, wrapped as Playwright `test.step`s |
| `utilities.ts` | `excel`, `dateTime` | Singleton instances ready to import anywhere |

**Usage in a test:**
```typescript
import { dateTime, excel } from '../../utils/utilities'

const time = await dateTime.getCurrentTime()
const data = await excel.readExcel('./data/userExcelDataFile.xlsx')
```

---

### 4. `tests/` — Test Suites

#### UI tests (`tests/UI/`)
- **`amazon.test.ts`** — searches Amazon, opens a product in a new tab, and verifies the Apple Store showcase.
- **`browserWithoutFixxture.spec.ts`** — launches Chromium manually (no built-in `page` fixture) to demonstrate raw Playwright API usage.
- **`findLinkinByDuckduckGo.test.ts`** — searches DuckDuckGo for a LinkedIn profile; forced to run on the `msedge` channel because DuckDuckGo blocks Playwright's bundled Chromium in headless mode.
- **`makemytripFlightSearch.test.ts`** — one-way/round-trip flight and hotel search specs (currently commented out/disabled).
- **`popUp.spec.ts`** — accepts native JS `alert`/`confirm`/`prompt` dialogs.
- **`readAndWriteExcel.spec.ts`** — reads login credentials from `data/userExcelDataFile.xlsx` and signs in to a demo app.
- **`stroageState.spec.ts`** — reference snippet for saving `storageState.json` (commented out, not an active test).
- **`uploadResumeToNaukri.spec.ts`** — logs into Naukri and uploads a resume; credentials come from environment variables, not hardcoded.
- **`notAutomated/`** — draft specs excluded from the main run.

#### API tests (`tests/API/`)
- **`apiFirst.spec.ts`** — GET/POST requests against the Conduit demo API using Playwright's built-in `request` fixture (no Cucumber/BDD layer currently wired up).

---

## Setup & Installation

### Prerequisites
- Node.js >= 18
- npm

### 1. Install dependencies
```bash
npm install
```

### 2. Install Playwright browsers
```bash
npx playwright install
```

### 3. Configure environment variables
Copy the template and fill in real values — `playwright.config.ts` loads `.env` automatically via `dotenv/config`.
```bash
cp .env.example .env
```
Required variables:
| Variable | Used by |
|---|---|
| `NAUKRI_EMAIL` | `tests/UI/uploadResumeToNaukri.spec.ts` |
| `NAUKRI_PASSWORD` | `tests/UI/uploadResumeToNaukri.spec.ts` |

`.env` is gitignored — never commit real credentials. In CI, the same variables are supplied via GitHub Actions repository secrets (see below).

---

## Running Tests

### Run all tests
```bash
npx playwright test
```

### Run a specific test file
```bash
npx playwright test tests/UI/uploadResumeToNaukri.spec.ts
```

### Run tests matching a name (grep)
```bash
npx playwright test -g "upload resume to naukri"
```

### Run in headed mode (visible browser)
```bash
npx playwright test --headed
```

### Run in a specific browser project
```bash
npx playwright test --project=chromium
```

---

## Reporting

### Playwright HTML report
Generated automatically after each run (`reporter: html` in `playwright.config.ts`).
```bash
npx playwright show-report
```

### Traces
Traces are captured `on-first-retry`. To view a trace:
```bash
npx playwright show-trace path/to/trace.zip
```

> `allure-playwright` / `allure-commandline` are installed as dependencies but are not currently wired into `reporter` in `playwright.config.ts` — add an `['allure-playwright']` entry there first if you want Allure output.

---

## Continuous Integration

`.github/workflows/playwright.yml` runs the suite in the official `mcr.microsoft.com/playwright` container:

- **Schedule**: daily at `0 4 * * *` UTC (9:30 AM IST)
- **Manual trigger**: `workflow_dispatch` with an optional `tag` input to `--grep` a subset of tests
- **Secrets required**: add `NAUKRI_EMAIL` and `NAUKRI_PASSWORD` under repo **Settings → Secrets and variables → Actions** — they're injected into the test step's environment
- **Artifacts uploaded**: run logs, Playwright HTML report, and `test-results/` (raw traces/screenshots), each retained for 30 days

---

## Configuration (`playwright.config.ts`)

| Setting | Value |
|---|---|
| Test directory | `./tests` |
| Parallel execution | Enabled (`fullyParallel: true`) |
| Retries | 1 on CI, 0 locally |
| Workers | 4 (CI and local) |
| Browser | Chromium (Desktop Chrome) |
| Trace | On first retry |
| Screenshot | On failure only |
| Reporters | HTML only |
| Env loading | `dotenv/config` (reads `.env` at the repo root) |

---

## Key Dependencies

| Package | Purpose |
|---|---|
| `@playwright/test` | Core test runner, browser automation, API testing |
| `dotenv` | Loads `.env` values into `process.env` |
| `exceljs` / `xlsx` | Read and write Excel files (`.xlsx`) |
| `@cucumber/cucumber` | Installed for BDD-style tests (not currently wired into any active spec) |
| `allure-playwright` / `allure-commandline` | Allure reporter integration (not currently enabled in `playwright.config.ts`) |
| `typescript` | TypeScript language support |
| `ts-node` | Run TypeScript files directly (used by Cucumber) |

---

## Adding a New Page

> **Naming convention:** Every new page file must be named `<PageName>Page.ts` in PascalCase.
> For example, if the page is called `abcd`, the file must be `AbcdPage.ts` and the class must be `AbcdPage`.

1. Create `pages/AbcdPage.ts` extending `BasePage`:
   ```typescript
   import { BasePage, expect } from './BasePage'

   export class AbcdPage extends BasePage {
       myButton = this.page.getByRole('button', { name: 'Click Me' })

       async clickMyButton() {
           await this.myButton.click()
       }
   }
   ```
2. Register it in `pages/app.ts`:
   ```typescript
   import { AbcdPage } from './AbcdPage'

   export const createPages = (page: Page) => ({
       ...
       abcd: new AbcdPage(page),
   })
   ```
3. Use it in your test (import only from `app.ts` — never import individual page files directly):
   ```typescript
   const pages = createPages(page)
   await pages.abcd.clickMyButton()
   ```

---

## Adding New Test Data

Add entries to `data/urls.ts` or `data/userData.ts` — they are automatically available via `testData` through `data/index.ts`.

---

## Import Rules for Test Files

To keep tests clean and consistent, every `.spec.ts` / `.test.ts` file **must** follow these import rules:

| What you need | Import from | Do NOT import from |
|---|---|---|
| Page locators & methods | `pages/app.ts` only | individual page files (`GooglePage.ts`, etc.) |
| Test data (URLs, user data) | `data/index.ts` only | `urls.ts`, `userData.ts` directly |
| Utility helpers | `utils/utilities.ts` only | `excel.utils.ts`, `getDateTime.ts` directly |

**Correct pattern:**
```typescript
import { createPages } from '../../pages/app'          // pages
import { testData }    from '../../data/index'          // data
import { excel, dateTime } from '../../utils/utilities' // utils
```

**Incorrect — do not do this:**
```typescript
import { GooglePage }        from '../../pages/GooglePage'   // ❌ import page directly
import { urls }              from '../../data/urls'           // ❌ import data directly
import { GetDateTime }       from '../../utils/getDateTime'  // ❌ import util directly
```
