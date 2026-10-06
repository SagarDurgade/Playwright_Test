import { test, expect } from '@playwright/test'


test.beforeEach(async ({ page }) => {
  await page.goto('https://playground.bondaracademy.com/pages/iot-dashboard') 
  await page.getByText('Forms').click()
  await page.getByText('Form Layouts').click()
})

test('Extracting values', async ({ page }) => {

  //extracting text
  const basicFormSection = page.locator('nb-card', { hasText: 'Basic form' })
  const submitButtonText = await basicFormSection.getByRole('button').textContent()
  expect(submitButtonText).toEqual('Submit')

  //extract multiple text values
  const allRadioButtonValues = await page.locator('nb-radio').allTextContents()
  expect(allRadioButtonValues).toContain('Option 1')

  //extract input field values
  const emailField = basicFormSection.getByRole('textbox', { name: 'Email' })
  await emailField.fill('test@test.com')
  const emailFieldValue = await emailField.inputValue()
  console.log(emailFieldValue)

  //extract attribute value
  const emailPlaceholder = await emailField.getAttribute('placeholder')
  console.log(emailPlaceholder)

})

test('Assertion', async ({ page }) => {
    // Generic assertion
    const value = 5
    expect(value).toEqual(5)
})