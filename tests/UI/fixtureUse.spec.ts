import { test } from '../../pages/fixturesTwo'

test('Verify I can use fixture', async ({ Hello }) => {
  console.log('This is test case')
  console.log(Hello)
})