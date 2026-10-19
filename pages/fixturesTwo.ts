import { test as base } from '@playwright/test'

type MyFixture = {
	Hello: string
}

export const test = base.extend<MyFixture>( { Hello: async({}, use) => {
	console.log('this is in fixture setup hook')
	await use('Sagar')
	console.log('this is in fixture teardown hook')
}})