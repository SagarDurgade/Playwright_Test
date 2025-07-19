Feature: Withdrawing cash

  Rule: Customers cannot withdraw more than their balance

    Scenario: Successful withdrawal within balance
      Given Alice has two in their account
      When Alice tries to withdraw one
      Then the withdrawal is successful














