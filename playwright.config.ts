import { defineConfig, devices } from '@playwright/test'
import dotenv from 'dotenv'
// Keep JSON test discovery free of dotenv startup messages.
dotenv.config({ quiet: true })

const environment = process.env.ENV || 'qa'
// DataLoader and reporter metadata must use the same default in a clean CI checkout.
process.env.ENV = environment


export default defineConfig({
  metadata: {
        Environment: environment.toUpperCase(),
      },
  timeout: 60 * 1000,
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // Xray receives one final result per key; retain existing retries for other CI runs.
  retries: process.env.XRAY_RUN === 'true' ? 0 : process.env.CI ? 2 : 0,
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
        outputFolder: './TCOE-Report',
      },
    ],
    ['html', { open: 'never', outputFolder: './reports/playwright-report' }],
    // Static test_key annotations map JUnit cases to existing Xray Tests.
    ['junit', { outputFile: 'results/xray-results.xml', stripANSIControlSequences: true }],
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
