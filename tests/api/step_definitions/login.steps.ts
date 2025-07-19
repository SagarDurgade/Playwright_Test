import { Given, When, Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'

let balance = 0
let withdrawalAmount = 0
let withdrawalSuccess = false

Given('Alice has two in their account', function () {
  balance = 2
})

When('Alice tries to withdraw one', function () {
  withdrawalAmount = 1
  if (balance >= withdrawalAmount) {
    balance -= withdrawalAmount
    withdrawalSuccess = true
  } else {
    withdrawalSuccess = false
  }
})

Then('the withdrawal is successful', function () {
  expect(withdrawalSuccess).toBe(true)
})