import { defineConfig, devices } from '@playwright/test';

const baseURL =
  process.env.BASE_URL ?? 'https://worknest-site.netlify.app';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */

export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 2 : 4,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/playwright-html', open: 'never' }],
    ['allure-playwright', {
      resultsDir: 'reports/allure-results', // KHÔNG PHẢI outputFolder
      detail: true,
      suiteTitle: false,
      environmentInfo: {
        BASE_URL: baseURL,
        NODE_VERSION: process.version
      }
    }]
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'setup',
      testMatch: /setup\/auth\.setup\.ts/,
      fullyParallel: false,
    },

    {
      name: 'admin-chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: '.auth/admin.json',
      },
      dependencies: ['setup'],
      testMatch: /e2e\/.*\.spec\.ts/,
    },

    {
      name: 'manager-chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: '.auth/manager.json',
      },
      dependencies: ['setup'],
      testMatch: /e2e\/.*\.spec\.ts/,
      testIgnore: /auth-data-driven\.spec\.ts/,
    },

    {
      name: 'employee-chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: '.auth/employee.json',
      },
      dependencies: ['setup'],
      testMatch: /e2e\/.*\.spec\.ts/,
      testIgnore: /auth-data-driven\.spec\.ts/,
    },

    {
      name: 'api-project',
      testMatch: /api\/.*\.spec\.ts/,
    },

    {
      name: 'visual-admin-chromium',
      testMatch: /visual\/.*\.spec\.ts/,
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: '.auth/admin.json',
        viewport: { width: 1440, height: 900 },
      },
    }

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
