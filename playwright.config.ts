import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 4 : 4,
  reporter: [ ['html', { open: 'never' }]],

  timeout: 60000,
  expect: {
    timeout: 5000,
  },

  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    actionTimeout: 30000,
    headless: true,
  },

  /* Configure projects for major browsers */
  projects: [{
    name: 'Edge',
    use: {
      ...devices['Desktop Edge'],
      channel: 'msedge',
      headless: true,
      launchOptions: { args: ['--disable-http2'] },
    }
  }]
})
