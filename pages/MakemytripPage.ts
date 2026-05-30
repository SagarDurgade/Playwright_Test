import { test } from '@playwright/test'
import { BasePage, expect } from './BasePage'

export class MakemytripPage extends BasePage {

    // ── Locators ──────────────────────────────────────────────────────────
    oneWayOption       = this.page.getByText('One Way', { exact: true })
    roundTripOption    = this.page.getByText('Round Trip', { exact: true })
    multiCityOption    = this.page.getByText('Multi City', { exact: true })
    fromCityField      = this.page.locator('.fsw_inputBox.from')
    toCityField        = this.page.locator('.fsw_inputBox.to')
    fromCityInput      = this.page.locator('#fromCity')
    toCityInput        = this.page.locator('#toCity')
    returnDateField    = this.page.locator('.returnDate')
    searchButton       = this.page.locator('a.primaryBtn').first()
    hotelsNavLink      = this.page.getByRole('link', { name: 'Hotels', exact: true }).first()
    flightsNavLink     = this.page.getByRole('link', { name: 'Flights', exact: true }).first()
    cityAutoSuggest    = (city: string) => this.page.locator(`//*[contains(@class,'autoSuggest') or contains(@class,'react-autosuggest__suggestion')]//*[contains(text(),'${city}')]`).first()
    flightResultsCount = this.page.locator('.fliResults, [class*="listingCard"], [class*="flightResult"]').first()
    searchResultHeader = this.page.locator('[class*="flightSearchResult"], [class*="srp-header"], h2').first()
    hotelSearchButton  = this.page.locator('[class*="searchBtn"], [class*="primaryBtn"]').first()
    hotelCityInput     = this.page.locator('#city, [placeholder*="city"], [placeholder*="destination"]').first()

    // ── Methods ───────────────────────────────────────────────────────────

    async searchOneWayFlightBetweenCities(fromCity: string, toCity: string) {
        return test.step(`Search one-way flight from ${fromCity} to ${toCity}`, async () => {
            await this.oneWayOption.click()
            await this.fromCityField.click()
            await this.fromCityInput.fill(fromCity)
            await this.cityAutoSuggest(fromCity).click()
            await this.toCityField.click()
            await this.toCityInput.fill(toCity)
            await this.cityAutoSuggest(toCity).click()
            await this.searchButton.click()
            await this.page.waitForLoadState('networkidle')
        })
    }

    async searchRoundTripFlightBetweenCities(fromCity: string, toCity: string) {
        return test.step(`Search round-trip flight from ${fromCity} to ${toCity}`, async () => {
            await this.roundTripOption.click()
            await this.fromCityField.click()
            await this.fromCityInput.fill(fromCity)
            await this.cityAutoSuggest(fromCity).click()
            await this.toCityField.click()
            await this.toCityInput.fill(toCity)
            await this.cityAutoSuggest(toCity).click()
            await this.returnDateField.click()
            await this.page.keyboard.press('Escape')
            await this.searchButton.click()
            await this.page.waitForLoadState('networkidle')
        })
    }

    async openHotelsSectionAndSearchCity(city: string) {
        return test.step(`Navigate to Hotels and search for ${city}`, async () => {
            await this.hotelsNavLink.click()
            await this.page.waitForLoadState('networkidle')
            await this.hotelCityInput.fill(city)
            await this.cityAutoSuggest(city).click()
            await this.hotelSearchButton.click()
            await this.page.waitForLoadState('networkidle')
        })
    }

    async verifyFlightSearchResultsPageIsLoaded() {
        await expect(this.page).toHaveURL(/flight/, { timeout: 10000 })
    }
}
