import { test } from '../../pages/fixtures'

test('Verify the page fixture able to use in test case', async({ pages }) => {
    test.setTimeout(30000)
    await pages.goto.gotoUrl('https://www.google.co.in')
    await pages.google.searchText('Sagar Durgade - Senior SDET')
})
