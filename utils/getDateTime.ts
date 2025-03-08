export class GetDateTime {
    getCurrentTime(): string {
        const now = new Date()
        const hours = now.getHours()
        const minutes = now.getMinutes()
        return `${hours}:${minutes}`
    }
    getCurrentTimeAndSeconds(): string {
        const now = new Date();
        return now.toLocaleTimeString() + ' ' + now.getSeconds();
    }
}