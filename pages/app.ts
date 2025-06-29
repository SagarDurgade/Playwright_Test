import { Page } from 'playwright'
import { BasePage } from './BasePage'
import { GooglePage } from './GooglePage'
import { DuckduckgoPage } from './DuckduckgoPage'

export const createPages = (page: Page) => {
    return {
        base: new BasePage(page),
        google: new GooglePage(page),
        duckduckgo: new DuckduckgoPage(page),
    }
}