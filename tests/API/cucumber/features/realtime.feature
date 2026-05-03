Feature: Real-time User API Testing

  Scenario: Verify the response of user list on page 2
    Given I send a GET request to "https://reqres.in/api/users?page=2"
    Then the response status code should be 200
    And the response should contain total number of users as 12
    And the email of first user should be "michael.lawson@reqres.in"
