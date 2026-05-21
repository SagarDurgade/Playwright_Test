import { readAndwrightExcel } from './excel.utils'
import { GetDateTime } from './getDateTime'

// Re-export
// export { readAndwrightExcel, GetDateTime }

// Singleton instances
export const excel = new readAndwrightExcel()
export const dateTime = new GetDateTime()