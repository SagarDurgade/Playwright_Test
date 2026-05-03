import { Given, When, Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import { request, APIResponse } from '@playwright/test'

let apiBaseUrl: string
let response: APIResponse
let responseBody: any

Given('the API base URL is {string}', function (baseUrl: string) {
  apiBaseUrl = baseUrl
})

When('I send a GET request to {string}', async function (endpoint: string) {
  const apiContext = await request.newContext({ baseURL: apiBaseUrl })
  response = await apiContext.get(endpoint)
  console.log(`Response status: ${response.status()}`)
  console.log(`Response URL: ${response.url()}`)
  responseBody = await response.json()
})

Then('the response status code should be {int}', function (statusCode: number) {
  expect(response.status()).toBe(statusCode)
  // print response body
  console.log(`Response body: ${JSON.stringify(responseBody, null, 2)}`)
})

Then('the response should contain total number of users as {int}', function (total: number) {
  expect(responseBody.total).toBe(total)
})

Then('the email of first user should be {string}', function (email: string) {
  expect(responseBody.data && responseBody.data.length > 0).toBe(true)
  expect(responseBody.data[0].email).toBe(email)
})

