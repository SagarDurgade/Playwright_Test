---
applyTo: "tests/**/*.ts,pages/**/*.ts,data/**/*.ts,utils/**/*.ts"
---

# Playwright Automation Framework – AI Coding Instructions

This document defines the coding conventions, structure, and rules for this TypeScript Playwright test automation framework. All AI-generated code **must** follow these instructions exactly.

---

## Project Overview

- **Language:** TypeScript
- **Test runner:** `@playwright/test` (UI), `@cucumber/cucumber` (API/BDD)
- **Pattern:** Page Object Model (POM)
- **Reporting:** Playwright HTML, JUnit XML, Allure

---

## Folder Structure

```
pages/          → Page Object Model layer
data/           → Test data (URLs, user data)
utils/          → Reusable utility helpers
tests/UI/       → Playwright UI test files
tests/API/      → Cucumber BDD API tests
```

---

## 1. Page Object Rules (`pages/`)

### BasePage
`BasePage` accepts a `Page` instance in its constructor, exposes `this.page` to all subclasses, and re-exports `expect` from `@playwright/test` so page classes do not need to import from `@playwright/test` directly.

Every page class **must** extend `BasePage` from `./BasePage`.

```typescript
import { BasePage, expect } from './BasePage'

export class MyPage extends BasePage {
    // locators and methods here
}
```

### Naming Convention
- File name: `<PageName>Page.ts` in PascalCase (e.g., `LoginPage.ts`)
- Class name: `<PageName>Page` (e.g., `LoginPage`)
- Always use `this.page` for Playwright `Page` access (inherited from `BasePage`)

### Locators
- Declare locators as class properties (not inside methods)
- Prefer accessible role selectors: `getByRole`, `getByLabel`, `getByPlaceholder`
- Use `locator()` or XPath only when role selectors are not possible
- Dynamic locators must be arrow functions:

```typescript
resultItem = (id: string) => this.page.locator(`//*[contains(text(),"${id}")]`)
```

### Methods
- All methods must be `async`
- Use `await` for every Playwright action
- In **page classes**, use `expect` imported from `./BasePage` (do not import from `@playwright/test` directly in page files)
- Wrap multi-action page methods in `test.step()` to group them in reports. Single-action methods do not need `test.step()`.

### Example Page

```typescript
import { BasePage, expect } from './BasePage'

export class LoginPage extends BasePage {
    usernameInput = this.page.getByLabel('Username')
    passwordInput = this.page.getByLabel('Password')
    loginButton   = this.page.getByRole('button', { name: 'Login' })
    errorMessage  = this.page.locator('.error-message')

    async login(username: string, password: string) {
        await this.usernameInput.fill(username)
        await this.passwordInput.fill(password)
        await this.loginButton.click()
    }

    async verifyLoginError(message: string) {
        await expect(this.errorMessage).toBeVisible({ timeout: 5000 })
        await expect(this.errorMessage).toContainText(message)
    }
}
```

### Registering a New Page in `pages/app.ts`
After creating a page file, always register it in `app.ts`:

```typescript
import { Page } from 'playwright'
import { BasePage } from './BasePage'
import { LoginPage } from './LoginPage'
// ...other imports

export const createPages = (page: Page) => {
    return {
        base:  new BasePage(page),
        login: new LoginPage(page),
        // ...other pages
    }
}
```

---

## 2. Test Data Rules (`data/`)

### Files
| File | Purpose |
|---|---|
| `urls.ts` | All application base URLs |
| `userData.ts` | User-specific input data and expected text |
| `index.ts` | Aggregates and re-exports as `testData` — **do not modify this structure** |

### Adding Data
Add entries directly to `urls.ts` or `userData.ts`:

```typescript
// urls.ts
export const urls = {
    duckduckgoUrl: 'https://duckduckgo.com/',
    loginUrl: 'https://example.com/login',
}

// userData.ts
export const userData = {
    searchData: 'playwright test engineer',
    verifyText: 'Playwright - Fast and reliable end-to-end testing',
    loginUsername: 'testuser@example.com',
    loginPassword: 'SecurePassword123',
}
```

New data added to those files is automatically available through `testData` in `data/index.ts`. Never add a new file to `data/` without also exporting it from `index.ts`.

---

## 3. Utility Rules (`utils/`)

| File | Class / Export | Purpose |
|---|---|---|
| `excel.utils.ts` | `readAndwrightExcel` | Read, write, verify Excel (ExcelJS) |
| `getDateTime.ts` | `GetDateTime` | Current time helpers wrapped in `test.step` |
| `utilities.ts` | `excel`, `dateTime` | Singleton instances — **import only from here** |

Never instantiate `readAndwrightExcel` or `GetDateTime` directly in tests. Always use the singletons from `utilities.ts`.

---

## 4. Test File Rules (`tests/`)

### File Naming
- UI tests: `<description>.test.ts` inside `tests/UI/`
- API tests: `<feature>.feature` inside `tests/API/cucumber/features/`
- Step definitions: `<feature>.steps.ts` inside `tests/API/cucumber/features/step_definitions/`

### Mandatory Import Pattern
Every `.test.ts` file **must** use this import structure — no exceptions:

```typescript
import { test }                   from '@playwright/test'
import { createPages }            from '../../pages/app'           // ✅ always from app.ts
import { testData }               from '../../data/index'          // ✅ always from index.ts
import { excel, dateTime }        from '../../utils/utilities'     // ✅ always from utilities.ts
```

**Forbidden imports in test files:**

```typescript
import { GooglePage }    from '../../pages/GooglePage'    // ❌ never import page directly
import { urls }          from '../../data/urls'           // ❌ never import data directly
import { GetDateTime }   from '../../utils/getDateTime'  // ❌ never import util directly
```

### Test Structure

```typescript
import { test } from '@playwright/test'
import { createPages } from '../../pages/app'
import { testData } from '../../data/index'

test.describe('Feature Name', () => {

    test('should do something meaningful', async ({ page }) => {
        const pages = createPages(page)

        await page.goto(testData.urls.someUrl)
        await pages.somePage.doAction(testData.userData.someInput)
        await pages.somePage.verifyResult(testData.userData.expectedText)
    })

})
```

### Test Naming
- Use descriptive `test()` and `test.describe()` names written in plain English
- Describe *what* the test verifies, not *how* it does it
- Example: `'should display error when login credentials are invalid'`

### Assertions
- In **test files**, import and use `expect` from `@playwright/test`. In **page classes**, use `expect` re-exported from `./BasePage` — do not import `@playwright/test` directly in page files.
- Always specify a `timeout` in assertions: `{ timeout: 5000 }` or `{ timeout: 10000 }`
- Prefer specific matchers: `toBeVisible`, `toContainText`, `toHaveURL`, `toHaveValue`

---

## 5. Playwright Configuration (`playwright.config.ts`)

Do not modify the config unless explicitly asked. Key settings to be aware of:

| Setting | Value |
|---|---|
| `testDir` | `./tests` |
| `fullyParallel` | `true` |
| `retries` | 1 on CI, 0 locally |
| `workers` | 4 on CI |
| `browser` | Chromium (Desktop Chrome) |
| `trace` | `on-first-retry` |
| `screenshot` | `only-on-failure` |
| `reporters` | HTML + JUnit XML |

---

## 6. Running Tests

```bash
# All UI tests
npx playwright test

# Specific file
npx playwright test tests/UI/findLinkinByDuckduckGo.test.ts

# Headed mode
npx playwright test --headed

# Specific browser
npx playwright test --project=chromium

# API / Cucumber tests
npm run test:cucumber

# Open HTML report
npx playwright show-report

# Generate Allure report
npx allure generate allure-results --clean
npx allure open
```

---

## 7. Playwright MCP Server – Automation Guidelines

When using the Playwright MCP server to automate browser interactions:

### Do
- Use the MCP browser tools to navigate, click, fill, and assert on pages
- Capture browser snapshots (`browser_snapshot`) to understand the DOM before writing locators
- Map discovered locators back into the correct `Page` class inside `pages/`
- After exploring a page with MCP, generate or update the corresponding `<Name>Page.ts`
- Always verify selectors are stable (prefer `role`, `label`, `placeholder` over CSS class names)

### Do Not
- Hard-code locators inside test files — they belong in page classes
- Use `page.locator('.some-class')` in tests directly — put it in the page object
- Skip registering a new page in `pages/app.ts`
- Use `page.waitForTimeout()` as a substitute for proper `waitForLoadState` or `waitForSelector`

### Workflow: Discover → Model → Test

1. **Discover** – Use MCP `browser_navigate` and `browser_snapshot` to explore the target page
2. **Model** – Create or update the corresponding `<Name>Page.ts` with discovered locators and methods
3. **Register** – Add the new page to `pages/app.ts` via `createPages()`
4. **Data** – Add required URLs/test inputs to `data/urls.ts` and `data/userData.ts`
5. **Test** – Write a `.test.ts` file under `tests/UI/` following the mandatory import pattern

---

## 8. TypeScript Guidelines

- Use `async/await` — never `.then()` chains
- Use `readonly` for locator properties when they don't change
- No `any` types — use proper Playwright types (`Page`, `Locator`, `BrowserContext`, etc.)
- Use `const` for all variable declarations unless reassignment is needed
- Keep test files under ~50 lines; extract complex logic into page methods or utilities

---

## 9. Quick Cheatsheet

```typescript
// Navigate
await page.goto(testData.urls.someUrl)

// Fill input
await pages.myPage.myInput.fill('value')

// Click
await pages.myPage.myButton.click()

// Assert visible
await expect(pages.myPage.element).toBeVisible({ timeout: 5000 })

// Assert text
await expect(pages.myPage.element).toContainText('expected', { timeout: 5000 })

// Assert URL
await expect(page).toHaveURL(/expected-path/, { timeout: 5000 })

// Wait for network
await page.waitForLoadState('networkidle')

// Get date/time
const time = await dateTime.getCurrentTime()

// Excel
const data = await excel.readExcel('./data/testdata.xlsx')
```
