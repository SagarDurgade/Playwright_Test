import { test as base } from '@playwright/test'
import { createPages } from './app'

type PageFixtures = {
    pages: ReturnType<typeof createPages>
}

export const test = base.extend<PageFixtures>({
    pages: async ({ page }, use) => {
        await use(createPages(page))
    },
})

export { expect } from '@playwright/test'
