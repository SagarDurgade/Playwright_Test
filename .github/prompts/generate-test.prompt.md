---
agent: true
description: Generate Playwright test cases with POM from any URL using the MCP browser
model: claude-3.7-sonnet
inputs:
  - id: targetUrl
    description: "Target URL to automate (e.g. https://example.com/login)"
    type: promptString
    default: "https://"
  - id: pageName
    description: "Page name in PascalCase (e.g. LoginPage). Leave blank to auto-derive from the URL."
    type: promptString
    default: ""
  - id: testFocus
    description: "Brief description of what to test (e.g. 'login flow', 'search feature', 'checkout process')"
    type: promptString
    default: "main user flows"
tools:
  - mcp_microsoft_pla_browser_navigate
  - mcp_microsoft_pla_browser_snapshot
  - mcp_microsoft_pla_browser_click
  - mcp_microsoft_pla_browser_fill_form
  - mcp_microsoft_pla_browser_type
  - mcp_microsoft_pla_browser_select_option
  - mcp_microsoft_pla_browser_hover
  - mcp_microsoft_pla_browser_take_screenshot
  - mcp_microsoft_pla_browser_wait_for
  - mcp_microsoft_pla_browser_evaluate
  - mcp_microsoft_pla_browser_network_requests
  - mcp_microsoft_pla_browser_press_key
  - mcp_microsoft_pla_browser_tabs
  - changes
  - codebase
  - editFiles
  - fetch
  - findTestFiles
  - githubRepo
  - problems
  - runTasks
  - search
  - searchResults
  - usages
---

# Generate Playwright Test Cases from URL

You are an expert Playwright test automation engineer. Your job is to explore a given URL using the Playwright MCP browser, understand the page features and UI elements, then generate fully working test code following the Page Object Model pattern used in this codebase.

## Resolved Inputs

The following values were provided when this prompt was started:

| Input | Value |
|---|---|
| **Target URL** | `${input:targetUrl}` |
| **Page Name** | `${input:pageName}` *(blank = auto-derive from URL path or page title)* |
| **Test Focus** | `${input:testFocus}` |

Use `${input:targetUrl}` as the URL to navigate to.
If `${input:pageName}` is blank, derive a PascalCase name from the URL path or page `<title>` (e.g. `https://example.com/login` → `LoginPage`).
Focus test scenario planning on: **${input:testFocus}**.

---

## Step-by-Step Instructions

Follow every step in order. Do not skip any step.

### Step 1 — Navigate and Explore

1. Call `mcp_microsoft_pla_browser_navigate` with `${input:targetUrl}`.
2. Call `mcp_microsoft_pla_browser_snapshot` to capture the full accessibility tree.
3. Identify all interactive elements: inputs, buttons, links, dropdowns, checkboxes, headings, error messages, success banners.
4. For each element note: its **role**, **label/name/placeholder**, and **purpose** (what feature or functionality it serves).
5. If the page has multiple states (e.g., a form that shows results after submission), interact with key elements and take additional snapshots to discover result/error states.
6. Call `mcp_microsoft_pla_browser_take_screenshot` to capture the visual state for reference.

### Step 2 — Plan Test Scenarios

Based on the exploration, define **2 to 4 test scenarios** focused on **${input:testFocus}** that cover meaningful user flows. For each scenario:
- Identify the user action sequence (navigate → interact → verify)
- Plan **3 to 4 assertions** that verify visible outcomes (text, visibility, URL, input value)
- Name the test in plain English describing the feature being verified (e.g., `'should display validation error when form is submitted empty'`)

### Step 3 — Create the Page Object File

Create `pages/<PageName>Page.ts` following these exact rules:

```typescript
import { BasePage, expect } from './BasePage'

export class <PageName>Page extends BasePage {

    // ── Locators ──────────────────────────────────────────────────────────
    // Declare every locator as a class property, NOT inside methods.
    // Prefer getByRole > getByLabel > getByPlaceholder > locator(css) > locator(xpath)
    exampleInput   = this.page.getByLabel('Email')
    submitButton   = this.page.getByRole('button', { name: 'Submit' })
    successMessage = this.page.locator('.success-banner')
    errorMessage   = this.page.locator('[data-testid="error"]')

    // Dynamic locator — use arrow function
    resultItem = (text: string) => this.page.locator(`//*[contains(text(),"${text}")]`)

    // ── Methods ───────────────────────────────────────────────────────────
    // Method names must describe the FEATURE or FUNCTIONALITY they perform.
    // Multi-action methods must be wrapped in test.step().
    // Single-action methods do not need test.step().

    async fillAndSubmitContactForm(email: string, message: string) {
        return this.page.context().browser()!.newPage() // replace with real actions
        // wrap multi-step flows in test.step:
    }

    async verifySuccessConfirmationIsShown() {
        await expect(this.successMessage).toBeVisible({ timeout: 5000 })
    }
}
```

**Method naming rules:**
- Names must describe the feature or functionality, not the mechanics
- Good: `submitLoginCredentials`, `verifyWelcomeBannerIsDisplayed`, `selectProductFromDropdown`
- Bad: `clickButton`, `fillInput`, `check`
- Multi-action methods (2+ Playwright actions) → wrap body in `test.step('description', async () => { ... })`
- Single-action methods (1 Playwright action) → no `test.step` needed

**Use `expect` imported from `./BasePage`** inside page methods. Do not import `@playwright/test` directly in page files.

### Step 4 — Register the Page in `pages/app.ts`

Read the current contents of `pages/app.ts`, then add the new page:

```typescript
import { <PageName>Page } from './<PageName>Page'

export const createPages = (page: Page) => {
    return {
        // ...existing pages...
        <camelCaseName>: new <PageName>Page(page),
    }
}
```

### Step 5 — Add Test Data

Read `data/urls.ts` and `data/userData.ts`, then append only what is needed:

```typescript
// data/urls.ts  — add the new URL
export const urls = {
    // ...existing...
    <pageName>Url: '${input:targetUrl}',
}

// data/userData.ts  — add any input values and expected texts used in tests
export const userData = {
    // ...existing...
    <pageName>Input: '<value used in the test>',
    <pageName>ExpectedText: '<text expected to appear after the action>',
}
```

Do NOT modify `data/index.ts` — the new entries are automatically available through `testData`.

### Step 6 — Write the Test File

Create `tests/UI/<featureDescription>.test.ts`.

**Mandatory structure — follow exactly:**

```typescript
import { test, expect } from '@playwright/test'
import { createPages }  from '../../pages/app'
import { testData }     from '../../data/index'

test.describe('<Page or Feature Name>', () => {

    test('<plain English description of what is verified>', async ({ page }) => {
        const pages = createPages(page)

        // Arrange
        await page.goto(testData.urls.<pageName>Url)

        // Act
        await pages.<camelCaseName>.<meaningfulMethodName>(testData.userData.<inputKey>)

        // Assert — include 3 to 4 assertions
        await expect(pages.<camelCaseName>.<locator>).toBeVisible({ timeout: 5000 })
        await expect(pages.<camelCaseName>.<locator>).toContainText(testData.userData.<expectedTextKey>, { timeout: 5000 })
        await expect(page).toHaveURL(/<expected-path>/, { timeout: 5000 })
        await expect(pages.<camelCaseName>.<locator>).toHaveValue(testData.userData.<inputKey>, { timeout: 5000 })
    })

})
```

**Rules for test files:**
- Every test must have **3 to 4 `expect` assertions** — no more, no fewer per test
- Import `expect` from `@playwright/test` in test files (not from `./BasePage`)
- Never import individual page files — always use `createPages` from `pages/app`
- Never import `urls.ts` or `userData.ts` directly — always use `testData` from `data/index`
- Never import utility helpers directly — use singletons from `utils/utilities`
- Do not use `page.waitForTimeout()` for waiting — use `waitForLoadState('networkidle')` or locator assertions with `timeout`

---

## Output Checklist

Before finishing, confirm each item is complete:

- [ ] `pages/<PageName>Page.ts` created — extends `BasePage`, all locators as class properties, method names describe features/functionality
- [ ] Multi-action methods wrapped in `test.step()`
- [ ] `pages/app.ts` updated — new page imported and registered in `createPages()`
- [ ] `data/urls.ts` updated — URL added
- [ ] `data/userData.ts` updated — input values and expected texts added
- [ ] `tests/UI/<feature>.test.ts` created — imports only from `app`, `data/index`, `utils/utilities`; each test has 3–4 assertions
- [ ] No forbidden direct imports in the test file

---

## Example (for reference only — do not copy locators verbatim)

Given URL: `https://duckduckgo.com/`

**`pages/DuckduckgoPage.ts`** (already exists — shows the expected pattern):
```typescript
import { BasePage, expect } from './BasePage'

export class DuckduckgoPage extends BasePage {
    searchInput    = this.page.locator('input[name="q"]')
    searchButton   = this.page.getByRole('button', { name: 'Search', exact: true })
    searchResult   = (id: string) => this.page.locator(`//*[contains(text(),"${id}")]`)
    searchError    = this.page.locator('text=Unexpected error. Please try again.')

    async performSearchQuery(text: string) {
        return test.step(`Search for "${text}"`, async () => {
            await this.searchInput.fill(text)
            await this.page.keyboard.press('Enter')
            await this.page.waitForLoadState('networkidle')
        })
    }

    async verifySearchResultIsVisible(text: string) {
        await expect(this.searchError).not.toBeVisible({ timeout: 5000 })
        await expect(this.searchResult(text)).toBeVisible({ timeout: 10000 })
    }
}
```

**`tests/UI/duckduckgoSearch.test.ts`**:
```typescript
import { test, expect } from '@playwright/test'
import { createPages } from '../../pages/app'
import { testData }    from '../../data/index'

test.describe('DuckDuckGo Search', () => {

    test('should display relevant results when searching for a LinkedIn profile', async ({ page }) => {
        const pages = createPages(page)

        await page.goto(testData.urls.duckduckgoUrl)
        await pages.duckduckgo.performSearchQuery(testData.userData.searchData)

        await expect(pages.duckduckgo.searchError).not.toBeVisible({ timeout: 5000 })
        await expect(pages.duckduckgo.searchResult(testData.userData.verifyText)).toBeVisible({ timeout: 10000 })
        await expect(page).toHaveURL(/duckduckgo\.com/, { timeout: 5000 })
        await expect(page).not.toHaveURL(/error/, { timeout: 5000 })
    })

})
```
