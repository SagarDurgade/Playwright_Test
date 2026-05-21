import { test } from '@playwright/test'

export class GetDateTime {
    async getCurrentTime(): Promise<string> {
        return test.step('Get current time (HH:MM)', async () => {
            const now = new Date()
            const hours = now.getHours()
            const minutes = now.getMinutes()
            return `${hours}:${minutes}`
        })
    }

    async getCurrentTimeAndSeconds(): Promise<string> {
        return test.step('Get current time with seconds', async () => {
            const now = new Date()
            return now.toLocaleTimeString() + ' ' + now.getSeconds()
        })
    }
}