import { Page } from '@playwright/test'
import { GooglePage } from './GooglePage'
import { DuckduckgoPage } from './DuckduckgoPage'
import { MakemytripPage } from './MakemytripPage'

export const createPages = (page: Page) => {
    return {
        google: new GooglePage(page),
        duckduckgo: new DuckduckgoPage(page),
        makemytrip: new MakemytripPage(page),
    }
}