import { Page } from 'playwright'
import { BasePage } from './BasePage'
import { GooglePage } from './GooglePage'
import { DuckduckgoPage } from './DuckduckgoPage'
import { MakemytripPage } from './MakemytripPage'

export const createPages = (page: Page) => {
    return {
        base: new BasePage(page),
        google: new GooglePage(page),
        duckduckgo: new DuckduckgoPage(page),
        makemytrip: new MakemytripPage(page),
    }
}