import { Page } from '@playwright/test'
import { GooglePage } from './GooglePage'
import { DuckduckgoPage } from './DuckduckgoPage'
import { MakemytripPage } from './MakemytripPage'
import { amazonPage } from './amazonPage'
import { NaukariPage } from './NaukariPage'


export const createPages = (page: Page) => {
    return {
        google: new GooglePage(page),
        duckduckgo: new DuckduckgoPage(page),
        makemytrip: new MakemytripPage(page),
        amazon: new amazonPage(page),
        naukari: new NaukariPage(page),
    }
}