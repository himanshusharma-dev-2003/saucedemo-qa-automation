import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

/**
 * Load environment variables from .env (local dev) before the config is read.
 * In CI, these same variables are injected via GitHub Actions secrets instead.
 * Override any variable at call-time: BASE_URL=https://staging.example.com npx playwright test
 *
 * Docs: https://playwright.dev/docs/test-configuration
 */
dotenv.config();

const BASE_URL = process.env.BASE_URL ?? 'https://www.saucedemo.com';
const TEST_ENV  = process.env.TEST_ENV  ?? 'local';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  // HTML report is great for portfolio screenshots; list gives clean CLI output too
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
    // Metadata row in the HTML report shows which environment was tested
    ['json', { outputFile: `test-results/results-${TEST_ENV}.json` }],
  ],

  use: {
    // Reads from .env (LOCAL) or CI secrets (CI/CD) — no hardcoded URLs in code
    baseURL: BASE_URL,
    trace: 'on-first-retry',       // captures a debuggable trace when a test fails then retries
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
  },

  // Visual regression tolerance — allows up to 100 pixels of minor rendering
  // variance (anti-aliasing, font hinting) before flagging a snapshot failure.
  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 100,
      // Threshold per pixel — 0.2 = 20% colour difference tolerated per pixel
      threshold: 0.2,
    },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
});
