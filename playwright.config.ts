import { defineConfig, devices } from '@playwright/test'
import dotenv from 'dotenv'
dotenv.config()

const environment = process.env.ENV || 'qa'
export default defineConfig({
  metadata: {
        Environment: environment.toUpperCase(),
      },
  timeout: 60 * 1000,
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 1,
  reporter: [
    // ['allure-playwright'],
    [
      './src/utils/custom-report',
      {
        attach: {
          screenshot: 'on',
          video: 'on',
          trace: 'on',
        },
        branding: {
          name: 'Playwright Automation Report',
          subtitle: 'E2E Playwright Automation Execution Summary',
        },
        outputFolder: './reports/TCOE-Report',
      },
    ],
    ['html', { open: 'never', outputFolder: './reports/playwright-report' }],
  ],
  use: {
    actionTimeout: 60 * 1000,
    baseURL: 'https://www.testmuai.com/',
    headless: true,
    screenshot: 'on',
    video: 'on',
    trace: 'on',
    ignoreHTTPSErrors: true,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      metadata: {
        Environment: environment.toUpperCase(),
      },
    },
  ],
})
