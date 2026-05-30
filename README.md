# Playwright Test Framework

A **TypeScript-based test automation framework** built on [Playwright](https://playwright.dev/), following the **Page Object Model (POM)** pattern. It supports both UI and API testing, with Cucumber BDD integration for API scenarios and multi-reporter output (HTML, JUnit, Allure).

---

## Project Structure

```
Playwright_Test/
├── pages/                         # Page Object Model (POM) layer
│   ├── BasePage.ts                # Base class shared by all page objects
│   ├── app.ts                     # Page factory — creates all page instances
│   ├── GooglePage.ts              # Google search page actions & assertions
│   └── DuckduckgoPage.ts          # DuckDuckGo search page actions & assertions
│
├── data/                          # Test data layer
│   ├── urls.ts                    # Application URLs
│   ├── userData.ts                # User-specific test data (search terms, expected text)

│   └── index.ts                   # Aggregates and exports all data as `testData`
│
├── utils/                         # Reusable utility helpers
│   ├── excel.utils.ts             # Excel read / write / verify (ExcelJS)
│   ├── getDateTime.ts             # Date & time helpers wrapped in Playwright steps
│   └── utilities.ts               # Singleton exports: `excel`, `dateTime`
│
├── tests/
│   ├── UI/
│   │   ├── findLinkinByDuckduckGo.test.ts   # Active UI test suite
│   │   └── notAutomated/                    # Pending / commented-out tests
│   │       ├── google.test.ts
│   │       ├── todo.test.ts
│   │       └── excel2.test.ts
│   └── API/
│       └── cucumber/
│           └── features/
│               ├── realtime.feature          # BDD feature file (reqres.in API)
│               └── step_definitions/
│                   └── realtime.steps.ts     # Cucumber step implementations
│
├── allure-results/                # Raw Allure test result files
├── allure-report/                 # Generated Allure HTML report
├── playwright-report/             # Playwright built-in HTML report
├── test-results/                  # JUnit XML report output
├── download/                      # Downloaded files during test runs
├── storageState.json              # Saved browser authentication state
├── playwright.config.ts           # Playwright configuration
├── tsconfig.json                  # TypeScript compiler options
└── package.json                   # Dependencies and npm scripts
```

---

## Architecture Overview

### 1. `pages/` — Page Object Model

All UI interactions are encapsulated in page classes.

| File | Responsibility |
|---|---|
| `BasePage.ts` | Holds the `Page` instance and re-exports `expect` and `Page` from Playwright |
| `app.ts` | Factory function `createPages(page)` that returns all page objects in one call |
| `GooglePage.ts` | Locators and methods for Google search (`searchText`, `verifySearchResult`) |
| `DuckduckgoPage.ts` | Locators and methods for DuckDuckGo (`searchText`, `verifySearchResult`, `selectSearchResult`, `ifDownloadOptionExists`) |

**Usage in a test:**
```typescript
const pages = createPages(page)
await pages.duckduckgo.searchText('playwright')
await pages.duckduckgo.verifySearchResult('Playwright - Fast and reliable end-to-end testing')
```

---

### 2. `data/` — Test Data Layer

All test data is centralized and imported via a single `testData` object.

| File | Contents |
|---|---|
| `urls.ts` | `duckduckgoUrl` and other base URLs |
| `userData.ts` | `searchData` (search term), `verifyText` (expected result text) |
| `index.ts` | Exports `{ urls, userData }` as `testData` |

**Usage in a test:**
```typescript
import { testData } from '../../data/index'

await page.goto(testData.urls.duckduckgoUrl)
await pages.duckduckgo.searchText(testData.userData.searchData)
```

---

### 3. `utils/` — Utility Helpers

Reusable helpers that are not page-specific.

| File | Class / Export | Purpose |
|---|---|---|
| `excel.utils.ts` | `readAndwrightExcel` | Read, write, and verify Excel files using **ExcelJS** |
| `getDateTime.ts` | `GetDateTime` | Get current time and time-with-seconds, wrapped as Playwright steps |
| `utilities.ts` | `excel`, `dateTime` | Singleton instances ready to import anywhere |

**Usage in a test:**
```typescript
import { dateTime, excel } from '../../utils/utilities'

const time = await dateTime.getCurrentTime()
const data = await excel.readExcel('./data/testdata.xlsx')
```

---

### 4. `tests/` — Test Suites

#### UI Tests (`tests/UI/`)
Written with `@playwright/test`. Tests import pages via `createPages()` and data via `testData`.

**Active test — `findLinkinByDuckduckGo.test.ts`:**
- Searches DuckDuckGo for a LinkedIn profile and verifies the result appears.
- Gets the current date/time using the `dateTime` utility.

#### API Tests (`tests/API/cucumber/`)
Uses **Cucumber BDD** (`@cucumber/cucumber`) together with Playwright's `request` API for HTTP calls.

- **Feature file** (`realtime.feature`): Written in Gherkin, describes API scenarios for [reqres.in](https://reqres.in).
- **Step definitions** (`realtime.steps.ts`): Maps Gherkin steps to Playwright API requests and `expect` assertions.

---

## Setup & Installation

### Prerequisites
- Node.js >= 18
- npm

### Install dependencies
```bash
npm install
```

### Install Playwright browsers
```bash
npx playwright install
```

---

## Running Tests

### Run all UI tests (Playwright)
```bash
npx playwright test
```

### Run a specific test file
```bash
npx playwright test tests/UI/findLinkinByDuckduckGo.test.ts
```

### Run API tests (Cucumber BDD)
```bash
npm run test:cucumber
```

### Run tests in headed mode (visible browser)
```bash
npx playwright test --headed
```

### Run tests in a specific browser
```bash
npx playwright test --project=chromium
```

---

## Reporting

### Playwright HTML Report
Generated automatically after each run. Open with:
```bash
npx playwright show-report
```

### JUnit XML Report
Output to `test-results/junit-results.xml` — compatible with CI systems like Jenkins and GitHub Actions.

### Allure Report
Generate and open the Allure report:
```bash
npx allure generate allure-results --clean
npx allure open
```

---

## Configuration (`playwright.config.ts`)

| Setting | Value |
|---|---|
| Test directory | `./tests` |
| Parallel execution | Enabled (`fullyParallel: true`) |
| Retries | 1 on CI, 0 locally |
| Workers on CI | 4 |
| Browser | Chromium (Desktop Chrome) |
| Trace | On first retry |
| Screenshot | On failure only |
| Reporters | HTML, JUnit XML |

---

## Key Dependencies

| Package | Purpose |
|---|---|
| `@playwright/test` | Core test runner, browser automation, API testing |
| `@cucumber/cucumber` | BDD test runner for feature files |
| `exceljs` | Read and write Excel files (`.xlsx`) |
| `allure-playwright` | Allure reporter integration |
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
