import { Page } from '@playwright/test'
import { BasePage } from './BasePage'
import { GoogleSearch } from './GoogleSearch'

export const createPages = (page: Page) => {
	return {
		base: new BasePage(page),
        google: new GoogleSearch(page),
	}
}
