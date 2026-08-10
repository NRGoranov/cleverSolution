import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright smoke tests for CleverSolutions.
 *
 * Contact form: mocked via CONTACT_TEST_MODE=1 (no real email sent).
 * Published product: E2E_TEST=1 exposes the kitchenware placeholder for grid/detail tests.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : 2,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile",
      use: { ...devices["Pixel 5"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    env: {
      E2E_TEST: "1",
      CONTACT_TEST_MODE: "1",
    },
  },
});
