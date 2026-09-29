import { test, expect } from '@playwright/test'
import { createPages } from '../../pages/app'
import { testData } from '../../data/index'

test.describe('MakeMeTrip - End to End Flight & Travel Search', () => {

    test('should land on flight search results page after completing a one-way flight search', async ({ page }) => {
        const pages = createPages(page)

        // Arrange
        await page.goto(testData.urls.makemytripUrl, { waitUntil: 'domcontentloaded' })
        await page.waitForLoadState('load')

        // Act — full E2E: select trip type → fill cities → submit search
        await pages.makemytrip.searchOneWayFlightBetweenCities(
            testData.userData.makemytripFromCity,
            testData.userData.makemytripToCity
        )

        // Assert — verify the search results page is fully loaded
        await expect(page).toHaveURL(/makemytrip\.com/, { timeout: 10000 })
        await expect(page).toHaveURL(new RegExp(testData.userData.makemytripFlightUrlPattern), { timeout: 10000 })
        await expect(pages.makemytrip.flightResultsCount).toBeVisible({ timeout: 15000 })
        await expect(pages.makemytrip.oneWayOption).not.toBeVisible({ timeout: 5000 })
    })

    test('should land on round-trip flight results page after completing a round-trip search', async ({ page }) => {
        const pages = createPages(page)

        // Arrange
        await page.goto(testData.urls.makemytripUrl, { waitUntil: 'domcontentloaded' })
        await page.waitForLoadState('load')

        // Act — full E2E: select round trip → fill cities → open return date → submit
        await pages.makemytrip.searchRoundTripFlightBetweenCities(
            testData.userData.makemytripFromCity,
            testData.userData.makemytripToCity
        )

        // Assert — verify round-trip results page URL and listings
        await expect(page).toHaveURL(/makemytrip\.com/, { timeout: 10000 })
        await expect(page).toHaveURL(new RegExp(testData.userData.makemytripFlightUrlPattern), { timeout: 10000 })
        await expect(pages.makemytrip.flightResultsCount).toBeVisible({ timeout: 15000 })
        await expect(page).not.toHaveURL(/error/, { timeout: 5000 })
    })

    test('should land on hotel results page after searching for hotels in a city', async ({ page }) => {
        const pages = createPages(page)

        // Arrange
        await page.goto(testData.urls.makemytripUrl, { waitUntil: 'domcontentloaded' })
        await page.waitForLoadState('load')

        // Act — full E2E: click Hotels tab → enter city → submit search
        await pages.makemytrip.openHotelsSectionAndSearchCity(
            testData.userData.makemytripHotelCity
        )

        // Assert — verify hotels results page is loaded with correct URL
        await expect(page).toHaveURL(/makemytrip\.com/, { timeout: 10000 })
        await expect(page).toHaveURL(new RegExp(testData.userData.makemytripHotelUrlPattern), { timeout: 10000 })
        await expect(pages.makemytrip.hotelSearchButton).toBeVisible({ timeout: 10000 })
        await expect(page).not.toHaveURL(/flights/, { timeout: 5000 })
    })

})
