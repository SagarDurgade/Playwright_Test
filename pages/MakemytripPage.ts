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
    // Hotel city widget: the readonly input acts as a display; clicking its parent opens a search popover
    hotelCityWidget    = this.page.locator('[data-cy="city"]').first()
    hotelCitySearchInput = this.page.locator('.hsw_inputField:not([readonly]), input[placeholder*="ity"], input[placeholder*="estination"]').first()

    // ── Methods ───────────────────────────────────────────────────────────

    async searchOneWayFlightBetweenCities(fromCity: string, toCity: string) {
        return test.step(`Search one-way flight from ${fromCity} to ${toCity}`, async () => {
            await this.oneWayOption.scrollIntoViewIfNeeded()
            await this.oneWayOption.click({ force: true })
            await this.fromCityField.click({ force: true })
            await this.fromCityInput.fill(fromCity)
            await this.cityAutoSuggest(fromCity).click()
            await this.toCityField.click({ force: true })
            await this.toCityInput.fill(toCity)
            await this.cityAutoSuggest(toCity).click()
            await this.searchButton.click({ force: true })
            await this.page.waitForLoadState('load')
        })
    }

    async searchRoundTripFlightBetweenCities(fromCity: string, toCity: string) {
        return test.step(`Search round-trip flight from ${fromCity} to ${toCity}`, async () => {
            await this.roundTripOption.scrollIntoViewIfNeeded()
            await this.roundTripOption.click({ force: true })
            await this.fromCityField.click({ force: true })
            await this.fromCityInput.fill(fromCity)
            await this.cityAutoSuggest(fromCity).click()
            await this.toCityField.click({ force: true })
            await this.toCityInput.fill(toCity)
            await this.cityAutoSuggest(toCity).click()
            await this.returnDateField.click({ force: true })
            await this.page.keyboard.press('Escape')
            await this.searchButton.click({ force: true })
            await this.page.waitForLoadState('load')
        })
    }

    async openHotelsSectionAndSearchCity(city: string) {
        return test.step(`Navigate to Hotels and search for ${city}`, async () => {
            await this.hotelsNavLink.click()
            await this.page.waitForLoadState('load')
            // The city field is a readonly display input — click its parent widget to open the search popover
            await this.hotelCityWidget.click({ force: true })
            await this.hotelCitySearchInput.waitFor({ state: 'visible', timeout: 5000 })
            await this.hotelCitySearchInput.fill(city)
            await this.cityAutoSuggest(city).click()
            await this.hotelSearchButton.click({ force: true })
            await this.page.waitForLoadState('load')
        })
    }

    async verifyFlightSearchResultsPageIsLoaded() {
        await expect(this.page).toHaveURL(/flight/, { timeout: 10000 })
    }
}

